export default class GameManager {
  constructor() {
    this.nbTilesPerLine = 20;
    this.lvl = 0;
    this.nbEnemies = 10;
    this.hero = new Hero();
  }
  generateLevel() {
    let dungeonLvl = this.lvl % 10;
    let bossLvl = (dungeonLvl === 9)? true : false;

    if (this.lvl >= 0 && this.lvl < 10) {
      this.imgTileset = 'crossRoad.png';
      this.enemySet = [
        { name: 'Loup', imgX: 6 },
        { name: 'Mouche géante', imgX: 7 },
        { name: 'Bandit', imgX: 8 },
        { name: 'Chef des bandits', imgX: 9 }
      ]

      console.log('La croisée des chemins');
    }
    else if (this.lvl >= 10 && this.lvl < 20) {
      this.imgTileset = 'farDesert.png';
      console.log('Le désert retiré');
    }
    else if (this.lvl >= 20 && this.lvl < 30) {
      this.imgTileset = 'multiplicatedWoods.png';
      console.log('La forêt multipliée');
    }
    else if (this.lvl >= 30 && this.lvl < 40) {
      this.imgTileset = 'dividedValley.png';
      console.log('La vallée divisée');
    }
    else if (this.lvl >= 40 && this.lvl < 50) {
      this.imgTileset = 'dungeonOfPower.png';
      console.log('Le donjon de puissance');
    }
    else if (this.lvl >= 50 && this.lvl < 60) {
      this.imgTileset = 'rootOfTheWorld.png';
      console.log('Les racines du monde');
    }

    if(dungeonLvl === 0) {
      return this.generateFirstLevel();
    }
  }
  generateFirstLevel() {
    let lvlMap = [];

    for(let i = 0 ; i < this.nbTilesPerLine; i++) {
      lvlMap[i] = [];

      for(let j = 0; j < this.nbTilesPerLine; j++) {
        lvlMap[i][j] = {
          backPart: new Tile(i, j, this.imgTileset),
          frontPart: null
        };
      }
    }
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
  constructor(x = 0, y = 0, img = 'hero.png', imgX = 0, imgY = 0, canWalkOnIt = false, name = 'John Doe') {
    super(x, y, img, imgX, imgY, canWalkOnIt);
    this.live = 3;
    this.name = name;
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