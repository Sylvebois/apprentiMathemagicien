export default class GameManager {
  constructor() {
    this.lvl = 0;
  }
  generateLevel() {
    let dungeonLvl = this.lvl % 10;

    if (this.lvl >= 0 && this.lvl < 10) {
      this.generateLevelRoad(dungeonLvl);
    }
    else if (this.lvl >= 10 && this.lvl < 20) {
      this.generateLevelDesert(dungeonLvl);
    }
    else if (this.lvl >= 20 && this.lvl < 30) {
      this.generateLevelForest(dungeonLvl);
    }
    else if (this.lvl >= 30 && this.lvl < 40) {
      this.generateLevelValley(dungeonLvl);
    }
    else if (this.lvl >= 40 && this.lvl < 50) {
      this.generateLevelDungeon(dungeonLvl);
    }
    else if (this.lvl >= 50 && this.lvl < 60) {
      this.generateLevelWorld(dungeonLvl);
    }
  }
  generateLevelRoad(level) {
    let imgTileset = '../../images/crossRoad.png';
    console.log('La croisée des chemins');
  }
  generateLevelDesert(level) {
    let imgTileset = '../../images/farDesert.png';
    console.log('Le désert retiré');
  }
  generateLevelForest(level) {
    let imgTileset = '../../images/multiplicatedWoods.png';
    console.log('La forêt multipliée');
  }
  generateLevelValley(level) {
    let imgTileset = '../../images/dividedValley.png';
    console.log('La vallée divisée');
  }
  generateLevelDungeon(level) {
    let imgTileset = '../../images/dungeonOfPower.png';
    console.log('Le donjon de puissance');
  }
  generateLevelWorld(level) {
    let imgTileset = '../../images/rootOfTheWorld.png';
    console.log('Les racines du monde');
  }
}

class Tile {
  constructor(x = 0, y = 0, img = '', canWalkOnIt = true) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.canWalkOnIt = canWalkOnIt;
  }
}

class Hero extends Tile {
  constructor(x = 0, y = 0) {
    super(x, y, '../../images/hero.png', false);
    this.live = 3;
  }
  fight(enemy) {

  }
}

class Monster extends Hero {
  constructor(x = 0, y = 0, img = '', isBoss = false) {
    super(x, y, img, false);
    this.isBoss = isBoss;
    this.nbOperation = (this.isBoss)? 2 : 1;
    this.live = (this.isBoss)? 5 : 1;
  }
}