export default class GameManager {
  constructor(tilesPerLine) {
    this.nbTilesPerLine = tilesPerLine;
    this.lvl = 0;
    this.nbEnemies = 10;
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
        lvlMap[i][j] = {
          backPart: new Tile(i, j, this.imgTileset, this.random(0, 2), 1, true),
          frontPart: null
        };
      }
    }

    for(let i = 0 ; i < this.nbTilesPerLine; i++) {
      lvlMap[i][middle].backPart.imgX = 0;
      lvlMap[i][middle].backPart.imgY = 0;

      lvlMap[i][middle - 1].backPart.imgX = 1;
      lvlMap[i][middle - 1].backPart.imgY = 0;

      lvlMap[i][middle + 1].backPart.imgX = 2;
      lvlMap[i][middle + 1].backPart.imgY = 0;
    }

    lvlMap[0][middle].frontPart = new Tile(0, middle, 'mathemagician', 0, 0, false);
    lvlMap[1][middle].frontPart = this.hero;

    return lvlMap;
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

class Hero extends Tile {
  constructor(x = 0, y = 0, img = 'hero', imgX = 0, imgY = 0, canWalkOnIt = false, name = 'John Doe') {
    super(x, y, img, imgX, imgY, canWalkOnIt);
    this.live = 3;
    this.name = name;
    this.isHero = true;
  }
  fight(enemy) {

  }
}

class Monster extends Hero {
  constructor(x = 0, y = 0, img = '', imgX = 0, imgY = 1, canWalkOnIt = false, name = 'Ennemi', isBoss = false) {
    super(x, y, img, imgX = 0, imgY = 0, canWalkOnIt, name);
    this.isBoss = isBoss;
    this.nbOperation = (this.isBoss)? 2 : 1;
    this.live = (this.isBoss)? 5 : 1;
  }
}