export default class GameManager {
  constructor(tilesPerLine) {
    this.nbTilesPerLine = tilesPerLine;
    this.lvl = 0;
    this.nbEnemies = 15;
    this.hero = new Hero();
  }
  random(min = 0, max = 1, int = true) {
    return (int)?  Math.floor(Math.random() * (max - min + 1)) + min : Math.random() * (max - min) + min;
  }
  generateLevel() {
    let dungeonLvl = this.lvl % 10;
    let bossLvl = (dungeonLvl === 9)? true : false;

    if (this.lvl >= 0 && this.lvl < 10) {
      this.imgTileset = 'crossRoad';
      this.enemySet = [
        { name: 'Loup', imgX: 6 },
        { name: 'Mouche géante', imgX: 7 },
        { name: 'Bandit', imgX: 8 },
        { name: 'Chef des bandits', imgX: 9 }
      ]

      console.log('La croisée des chemins');
    }
    else if (this.lvl >= 10 && this.lvl < 20) {
      this.imgTileset = 'farDesert';
      console.log('Le désert retiré');
    }
    else if (this.lvl >= 20 && this.lvl < 30) {
      this.imgTileset = 'multiplicatedWoods';
      console.log('La forêt multipliée');
    }
    else if (this.lvl >= 30 && this.lvl < 40) {
      this.imgTileset = 'dividedValley';
      console.log('La vallée divisée');
    }
    else if (this.lvl >= 40 && this.lvl < 50) {
      this.imgTileset = 'dungeonOfPower';
      console.log('Le donjon de puissance');
    }
    else if (this.lvl >= 50 && this.lvl < 60) {
      this.imgTileset = 'rootOfTheWorld';
      console.log('Les racines du monde');
    }

    if(dungeonLvl === 0) {
      return this.generateFirstLevel();
    }
  }
  generateFirstLevel() {
    let lvlMap = [];
    let middle = Math.ceil(this.nbTilesPerLine/2);
    this.hero.x = 1;
    this.hero.y = middle;

    for(let i = 0 ; i < this.nbTilesPerLine; i++) {
      lvlMap[i] = [];

      for(let j = 0; j < this.nbTilesPerLine; j++) {
        //map border
        if(
          ((i === 0 || i === this.nbTilesPerLine -1) && (j < middle - 1 || j > middle + 1)) ||
          (j === 0 || j === this.nbTilesPerLine -1)
          ) {
          lvlMap[i][j] = {
            backPart: new Tile(i, j, this.imgTileset, this.random(3, 5), 1, false),
            frontPart: null
          };
        }
        //basic map
        else {
          lvlMap[i][j] = {
            backPart: new Tile(i, j, this.imgTileset, this.random(0, 2), 1, true),
            frontPart: null
          };
        }
      }

      //main way
      lvlMap[i][middle].backPart.imgX = 0;
      lvlMap[i][middle].backPart.imgY = 0;

      lvlMap[i][middle - 1].backPart.imgX = 1;
      lvlMap[i][middle - 1].backPart.imgY = 0;

      lvlMap[i][middle + 1].backPart.imgX = 2;
      lvlMap[i][middle + 1].backPart.imgY = 0;
    }

    //NPC and hero
    lvlMap[0][middle].frontPart = new NPC(0, middle, 'mathemagician', 0, 0, false);
    lvlMap[1][middle].frontPart = this.hero;

    //enemies
    let enemiesPlaced = this.nbEnemies;

    while(enemiesPlaced > 0) {
      let randX = this.random(1, this.nbTilesPerLine - 1);
      let randY = this.random(1, this.nbTilesPerLine - 1);
      let randMonster = this.random(0, this.enemySet.length - 2);

      if(!lvlMap[randX][randY].frontPart && lvlMap[randX][randY].backPart.canWalkOnIt) {
        lvlMap[randX][randY].frontPart = new Monster(randX, randY, this.imgTileset, this.enemySet[randMonster].imgX, 1, false, this.enemySet[randMonster].name);
        enemiesPlaced--;
      }
    }

    return lvlMap;
  }
  generateEquation(enemy) {
    let dungeonLvl = this.lvl % 10;

    let question = '';
    let a = this.random(0, dungeonLvl + 1);
    let b = this.random(0, dungeonLvl + 1);
    let c = this.random(0, dungeonLvl + 1);
    let answer = 0;

    if (this.lvl >= 0 && this.lvl < 10) {
      if(encodeURI.isBoss) {
        question = `${a} + ${b} + ${c}`;
        answer = a + b + c;
      }
      else {
        question = `${a} + ${b}`;
        answer = a + b;
      }
    }
    else if (this.lvl >= 10 && this.lvl < 20) {
      if(encodeURI.isBoss) {
        a = (a < b + c)? this.random(b + c, 20) : a;
        question = `${a} - ${b} - ${c}`;
        answer = a - b - c;
      }
      else {
        a = (a < b)? this.random(b, 20) : a;
        question = `${a} - ${b}`;
        answer = a - b;
      }
    }
    else if (this.lvl >= 20 && this.lvl < 30) {

    }
    else if (this.lvl >= 30 && this.lvl < 40) {

    }
    else if (this.lvl >= 40 && this.lvl < 50) {

    }
    else if (this.lvl >= 50 && this.lvl < 60) {

    }

    return {
      problem: question,
      solution: answer,
      fightX: enemy.x,
      fightY: enemy.y
     };
  }
  checkAccess(x, y, dungeon) {
    return new Promise((resolve, reject) => {
      if(x < 0 || x >= dungeon.length ||
        y < 0 || y >= dungeon[x].length ||
        !dungeon[x][y].backPart.canWalkOnIt) {
        reject();
      }
      else if(dungeon[x][y].frontPart && !dungeon[x][y].frontPart.canWalkOnIt) {
        reject(dungeon[x][y].frontPart.constructor.name);
      }
      else {
        resolve();
      }
    });
  }
  moveHero(x, y, dungeon) {
    this.hero = dungeon[this.hero.x][this.hero.y].frontPart;
    dungeon[this.hero.x][this.hero.y].frontPart = null;

    this.hero.x = x;
    this.hero.y = y;
    dungeon[x][y].frontPart = this.hero;
  }
  debug() {
    console.log(this);
  }
}

class Tile {
  constructor(x = 0, y = 0, img = '', imgX = 0, imgY = 0, canWalkOnIt = true) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.imgX = imgX;
    this.imgY = imgY;
    this.canWalkOnIt = canWalkOnIt;
  }
}

class NPC extends Tile {
  constructor(x = 0, y = 0, img = 'mathemagician', imgX = 0, imgY = 0, canWalkOnIt = false, name = 'John Doe') {
    super(x, y, img, imgX, imgY, canWalkOnIt);
    this.live = 3;
    this.name = name;
  }
}

class Hero extends NPC {
  constructor(x = 0, y = 0, img = 'hero', imgX = 0, imgY = 0, canWalkOnIt = false, name = 'John Doe') {
    super(x, y, img, imgX, imgY, canWalkOnIt);
    this.isHero = true;
  }
  fight(userAnswer, goodAnswer) {
    return new Promise((resolve, reject) => {
      console.log(userAnswer + ' - ' + goodAnswer)
      if(userAnswer === goodAnswer) {
        resolve();
      }
      else {
        this.live--;
        reject();
      }
    });
  }
}

class Monster extends NPC {
  constructor(x = 0, y = 0, img = '', imgX = 0, imgY = 1, canWalkOnIt = false, name = 'Ennemi', isBoss = false) {
    super(x, y, img, imgX, imgY, canWalkOnIt, name);
    this.isBoss = isBoss;
    this.nbOperation = (this.isBoss)? 2 : 1;
    this.live = (this.isBoss)? 5 : 1;
  }
}