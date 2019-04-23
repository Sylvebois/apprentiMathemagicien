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
      this.imgTileset = '../../images/crossRoad.png';
      this.enemySet = [
        { name: 'Loup', imgX: 6 },
        { name: 'Mouche géante', imgX: 7 },
        { name: 'Bandit', imgX: 8 },
        { name: 'Chef des bandits', imgX: 9 }
      ]

      console.log('La croisée des chemins');
    }
    else if (this.lvl >= 10 && this.lvl < 20) {
      this.imgTileset = '../../images/farDesert.png';
      console.log('Le désert retiré');
    }
    else if (this.lvl >= 20 && this.lvl < 30) {
      this.imgTileset = '../../images/multiplicatedWoods.png';
      console.log('La forêt multipliée');
    }
    else if (this.lvl >= 30 && this.lvl < 40) {
      this.imgTileset = '../../images/dividedValley.png';
      console.log('La vallée divisée');
    }
    else if (this.lvl >= 40 && this.lvl < 50) {
      this.imgTileset = '../../images/dungeonOfPower.png';
      console.log('Le donjon de puissance');
    }
    else if (this.lvl >= 50 && this.lvl < 60) {
      this.imgTileset = '../../images/rootOfTheWorld.png';
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
          ground: new Tile(i, j, this.imgTileset),
          character: null
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
  constructor(x = 0, y = 0, imgPath = '', imgX = 0, imgY = 0, canWalkOnIt = true) {
    this.x = x;
    this.y = y;
    this.img = imgPath;
    this.canWalkOnIt = canWalkOnIt;
  }
}

class Hero extends Tile {
  constructor(x = 0, y = 0, imgPath = '../../images/hero.png', imgX = 0, imgY = 0, canWalkOnIt = false, name = 'John Doe') {
    super(x, y, imgPath, imgX, imgY, canWalkOnIt);
    this.live = 3;
    this.name = name;
  }
  fight(enemy) {

  }
}

class Monster extends Hero {
  constructor(x = 0, y = 0, imgPath = '', imgX = 0, imgY = 1, canWalkOnIt = false, name = 'Ennemi', isBoss = false) {
    super(x, y, imgPath, imgX = 0, imgY = 0, canWalkOnIt, name);
    this.isBoss = isBoss;
    this.nbOperation = (this.isBoss)? 2 : 1;
    this.live = (this.isBoss)? 5 : 1;
  }
}