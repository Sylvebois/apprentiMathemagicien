import PHASER from 'phaser';
import EasyStar from 'easystarjs';
import config from '../Config/config';

import { dialogs } from '../text.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.level = this.game.globals.level;
    this.chapter = this.game.globals.chapter;
    this.lvlTileLine = 18 * (this.chapter - 1);

    this.loadLevel = (this.chapter == localStorage.getItem('chapter') && this.level == localStorage.getItem('level')) ? true : false;

    this.showTextBox = (this.level === 1 || this.level === 3 || this.level === 5) ? true : false;
  }

  create() {
    // Music initialization
    this.sys.game.globals.bgMusic.stop();
    this.sys.game.globals.model.bgMusicPlaying = false;

    if (this.sys.game.globals.model.musicOn) {
      let musicToPlay = '';

      switch (this.chapter) {
        case 1:
          musicToPlay = 'forestMusic';
          break;
        case 2:
          musicToPlay = 'desertMusic';
          break;
        case 3:
          musicToPlay = 'cityMusic';
          break;
        case 4:
          musicToPlay = 'swampMusic';
          break;
        case 5:
          musicToPlay = 'fortressMusic';
          break;
        case 6:
          musicToPlay = 'rootMusic';
          break;
      }

      this.music = this.sound.add(musicToPlay, { volume: 0.2, loop: true });
      this.music.play();
    }

    // Sounds initialization
    this.enemyRoar = this.sound.add('roar');

    this.language = this.game.globals.language;

    this.dungeon = this.make.tilemap({
      tileWidth: this.game.globals.tilesize,
      tileHeight: this.game.globals.tilesize,
      width: Math.floor(config.width / this.game.globals.tilesize),
      height: Math.floor(config.height / this.game.globals.tilesize),
    });

    let tiles = this.dungeon.addTilesetImage('tileset');

    this.finder = new EasyStar.js();
    this.finder.enableDiagonals();

    // Layers initialization
    this.groundLayer = this.dungeon.createBlankLayer('Ground Layer', tiles);
    this.playerLayer = this.dungeon.createBlankLayer('Player Layer', tiles);
    this.createDungeonMap();

    // Player initialization
    this.player = this.physics.add.sprite(0, Math.floor(this.dungeon.heightInPixels / 2), 'tileset', 54);
    this.player.setCollideWorldBounds(true);

    // Enemies initialization
    this.enemies = this.physics.add.staticGroup({ classType: Phaser.GameObjects.Zone });
    this.createEnemies();

    // Show a textbox on some levels
    if (this.showTextBox) {
      this.createTextBox();
    }

    // Setting camera view
    //this.cameras.main.zoom = 2;
    this.cameras.main.setBounds(0, 0, this.dungeon.widthInPixels, this.dungeon.heightInPixels)
    this.cameras.main.startFollow(this.player, true);

    // Checking collision with obstacles (non -1 index on the layer) and ennemies
    this.physics.add.overlap(this.player, this.enemies, this.onMeetEnemy, false, this);
    this.physics.add.collider(this.player, this.playerLayer);

    // Checking for input
    this.pointer = new Object();
    this.cursors = this.createKeyboardController();

    this.events.on('resume', this.resumeAfterFight, this);
    this.input.on('pointerup', this.handleClick, this);

    this.autosave();
  }

  update() {
    this.player.body.setVelocity(0);

    if (this.showTextBox && this.input.keyboard.keys.some(elem => elem.isDown)) {
      this.hideTextBox();
    }

    if (this.input.keyboard.enabled) {
      // Horizontal movement
      if (this.cursors.left.isDown || this.cursors.numFour.isDown) {
        this.player.body.setVelocityX(-160);
      }
      else if (this.cursors.right.isDown || this.cursors.numSix.isDown) {
        this.player.body.setVelocityX(160);
      }

      // Vertical movement
      if (this.cursors.up.isDown || this.cursors.numEight.isDown) {
        this.player.body.setVelocityY(-160);
      }
      else if (this.cursors.down.isDown || this.cursors.numTwo.isDown) {
        this.player.body.setVelocityY(160);
      }
    }
    else {
      this.player.body.setVelocity(0, 0);
    }
  }

  hideTextBox() {
    this.showTextBox = false;
    this.graphics.alpha = 0;
    this.pnj.destroy();
    this.dialogText.destroy();
  }

  handleClick(pointer) {
    // Delaying the closing of the dialog window
    if (this.showTextBox) {
      let delay = new Promise((res, rej) => setTimeout(res, 5000)).then(() => this.hideTextBox());
    }
    else {
      let toX = Math.floor(pointer.worldX / this.dungeon.tileWidth);
      let toY = Math.floor(pointer.worldY / this.dungeon.tileHeight);
      let fromX = Math.floor(this.player.x / this.dungeon.tileWidth);
      let fromY = Math.floor(this.player.y / this.dungeon.tileHeight);

      this.finder.findPath(fromX, fromY, toX, toY, (path) => {
        if (path !== null) {
          this.moveHeroTo(path);
        }
      });
      this.finder.calculate();
    }
  }

  moveHeroTo(path) {
    let tweens = [];

    for (let i = 0; i < path.length - 1; i++) {
      let ex = path[i + 1].x;
      let ey = path[i + 1].y;

      tweens.push({
        targets: this.player,
        x: { value: ex * this.dungeon.tileWidth, duration: 200 },
        y: { value: ey * this.dungeon.tileHeight, duration: 200 }
      });
    }

    this.tweens.timeline({ tweens: tweens });
  }

  createMouseController() {
    this.touchTriangles = {
      'top': new Phaser.Geom.Triangle(0, 0, config.width, 0, config.width / 2, config.height / 2),
      'left': new Phaser.Geom.Triangle(0, 0, 0, config.height, config.width / 2, config.height / 2),
      'bottom': new Phaser.Geom.Triangle(0, config.height, config.width, config.height, config.width / 2, config.height / 2),
      'right': new Phaser.Geom.Triangle(config.width, 0, config.width, config.height, config.width / 2, config.height / 2),
    };

    // Delaying the pointer event listener so the dialog window stay on screen
    let delay = new Promise((res, rej) => setTimeout(res, 500)).then(() => this.pointer = this.input.activePointer);
  }

  createKeyboardController() {
    let arrowKeys = this.input.keyboard.createCursorKeys();
    let otherKeys = this.input.keyboard.addKeys({
      'numTwo': Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO,
      'numFour': Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR,
      'numSix': Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX,
      'numEight': Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT,
    });

    return Object.assign(otherKeys, arrowKeys);
  }

  createTextBox() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(3, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);

    this.graphics.fillRect(0, 0, config.width, config.height / 2);
    this.graphics.strokeRect(3, 3, config.width - 6, config.height / 2 - 6);
    this.graphics.strokeRect(3, 3, this.game.globals.tilesize * 4 + 3, this.game.globals.tilesize * 4 + 6);

    this.pnj = this.add.image(6, 6, 'tileset', (this.level === 5) ? this.lvlTileLine + 13 : 55);
    this.pnj.setOrigin(0, 0);
    this.pnj.setScale(4);

    let textPosX = this.pnj.width * this.pnj._scaleX + this.pnj.x + 6;
    let textNum = (this.level === 1) ? 0 : (this.level === 3) ? 1 : 2;

    this.dialogText = this.add.text(textPosX, 0, dialogs[`chapter${this.chapter}`][this.language][textNum], this.game.globals.defaultTextParams);
  }

  createDungeonMap() {
    if (this.loadLevel) {
      let groundLayerArray = JSON.parse(localStorage.getItem('groundLayer'));
      let playerLayerArray = JSON.parse(localStorage.getItem('playerLayer'));

      for (let groundLayerTile of groundLayerArray) {
        this.groundLayer.fill(groundLayerTile.index, groundLayerTile.x, groundLayerTile.y);
      }

      for (let playerLayerTile of playerLayerArray) {
        this.playerLayer.fill(playerLayerTile.index, playerLayerTile.x, playerLayerTile.y);
      }
    }
    else {
      let middle = Math.floor(this.dungeon.height / 2);

      // Fill the floor with random ground tiles
      this.groundLayer.weightedRandomize([
        { index: 3 + this.lvlTileLine, weight: 1 },
        { index: 4 + this.lvlTileLine, weight: 1 },
        { index: 5 + this.lvlTileLine, weight: 1 },
        { index: 6 + this.lvlTileLine, weight: 1 }
      ], 0, 0, this.dungeon.width, this.dungeon.height);

      if (this.level === 1) {
        this.generateFirstLevel();
      }
      else if (this.level !== 5) {
        let start = [0, middle];
        let goal = [this.dungeon.width - 1, middle];

        switch (this.chapter) {
          case 1:
            this.generateRandomPath(start, goal);
            break;
          case 2:
            this.generateRandomDesert(start, goal);
            break;
          case 3:
            this.generateRandomCity(start, goal);
            break;
          case 4:
            this.generateRandomSwamp(start, goal);
            break;
          case 5:
            this.generateRandomFortress(start, goal);
            break;
          case 6:
            this.generateRandomRootWorld(start, goal);
            break;
        }
      }
      else {
        this.generateLastLevel()
      }
    }

    // Every tiles with an index of -1 won't use the collision system
    this.playerLayer.setCollisionByExclusion([-1]);

    // Used for the pathfinding
    let grid = [];
    for (let y = 0; y < this.dungeon.height; y++) {
      let col = [];
      for (let x = 0; x < this.dungeon.width; x++) {
        let tile = this.playerLayer.getTileAt(x, y);
        col.push((tile === null) ? -1 : tile.index);
      }
      grid.push(col);
    }
    let acceptableTiles = [-1];
    for (let i = this.lvlTileLine + 10; i <= this.lvlTileLine + 13; i++) {
      acceptableTiles.push(i);
    }

    this.finder.setGrid(grid);
    this.finder.setAcceptableTiles(acceptableTiles);
  }

  generateFirstLevel() {
    let middle = Math.floor(this.dungeon.height / 2);

    // Border of the scene
    this.playerLayer.fill(9 + this.lvlTileLine, 0, 0, this.dungeon.width, 1);
    this.playerLayer.fill(9 + this.lvlTileLine, 0, this.dungeon.height - 1, this.dungeon.width, 1);
    this.playerLayer.fill(9 + this.lvlTileLine, 0, 0, 1, this.dungeon.height);
    this.playerLayer.fill(9 + this.lvlTileLine, this.dungeon.width - 1, 0, 1, this.dungeon.height);

    // Fill the floor of the map with random, weighted obstacles
    this.playerLayer.weightedRandomize([
      { index: -1, weight: 25 }, // Place an empty tile most of the tile
      { index: 7 + this.lvlTileLine, weight: 3 },
      { index: 8 + this.lvlTileLine, weight: 2 },
      { index: 9 + this.lvlTileLine, weight: 2 },
    ], 1, 1, this.dungeon.width - 2, this.dungeon.height - 2);

    // First level always get a path in the middle
    this.groundLayer.fill(1 + this.lvlTileLine, 0, middle - 1, this.dungeon.width, 1);
    this.groundLayer.fill(0 + this.lvlTileLine, 0, middle, this.dungeon.width, 1);
    this.groundLayer.fill(2 + this.lvlTileLine, 0, middle + 1, this.dungeon.width, 1);

    this.playerLayer.fill(-1, 0, middle - 1, this.dungeon.width, 3);
  }

  generateLastLevel() {
    let middle = Math.floor(this.dungeon.height / 2);

    // Fill half of the whole map with obstacles
    this.playerLayer.fill(9 + this.lvlTileLine, 0, 0, this.dungeon.width, this.dungeon.height);

    // Last level start with a path ...
    this.groundLayer.fill(4 + this.lvlTileLine, 0, middle - 1, middle, 3);
    this.playerLayer.fill(-1, 0, middle - 1, middle, 3);

    // Then a big room ...
    this.groundLayer.fill(4 + this.lvlTileLine, middle - 2, middle / 4, middle, middle * 1.5);
    this.playerLayer.fill(-1, middle - 2, middle / 4, middle, middle * 1.5);
  }

  generateRandomPath(start, goal) {
    let cmp = 0;
    let currentPos = start;

    // Fill the whole map with obstacles
    this.playerLayer.weightedRandomize([
      { index: 7 + this.lvlTileLine, weight: 3 },
      { index: 8 + this.lvlTileLine, weight: 2 },
      { index: 9 + this.lvlTileLine, weight: 2 },
    ], 0, 0, this.dungeon.width, this.dungeon.height);

    // Carving the path
    while (currentPos[0] !== goal[0] || currentPos[1] !== goal[1]) {
      let neighbors = [];

      // Check possible directions
      if (currentPos[0] + 1 < this.dungeon.width) {
        neighbors.push([currentPos[0] + 1, currentPos[1]]);
      }
      if (currentPos[1] - 1 > 0) {
        neighbors.push([currentPos[0], currentPos[1] - 1]);
      }
      if (currentPos[1] + 1 < this.dungeon.height - 1) {
        neighbors.push([currentPos[0], currentPos[1] + 1]);
      }

      let nearGoal = neighbors.findIndex(pos => (pos[0] === goal[0] && pos[1] === goal[1]))
      let direction = (nearGoal > -1) ? nearGoal : Phaser.Math.Between(0, neighbors.length - 1);

      currentPos = neighbors[direction];

      this.playerLayer.fill(-1, currentPos[0] - 1, currentPos[1], 1, 3);
      this.groundLayer.fill(0, currentPos[0] - 1, currentPos[1], 1, 3);

      cmp++;

      if (cmp >= 1000) {
        console.log("Took too long to find a path !!!");
        break;
      }
    }

    // Entrance and exit
    this.groundLayer.fill(0 + this.lvlTileLine, start[0], start[1] - 1, 1, 3);
    this.groundLayer.fill(0 + this.lvlTileLine, goal[0], goal[1] - 1, 1, 3);

    this.playerLayer.fill(-1, start[0], start[1] - 1, 1, 3);
    this.playerLayer.fill(-1, goal[0], goal[1] - 1, 1, 3);
  }

  generateRandomDesert(start, goal) {
    // Border of the scene
    this.playerLayer.fill(9 + this.lvlTileLine, 0, 0, this.dungeon.width, 1);
    this.playerLayer.fill(9 + this.lvlTileLine, 0, this.dungeon.height - 1, this.dungeon.width, 1);
    this.playerLayer.fill(9 + this.lvlTileLine, 0, 0, 1, this.dungeon.height);
    this.playerLayer.fill(9 + this.lvlTileLine, this.dungeon.width - 1, 0, 1, this.dungeon.height);

    // Fill the floor with random ground tiles
    this.groundLayer.weightedRandomize([
      { index: 3 + this.lvlTileLine, weight: 1 },
      { index: 4 + this.lvlTileLine, weight: 1 },
      { index: 5 + this.lvlTileLine, weight: 1 },
      { index: 6 + this.lvlTileLine, weight: 1 }
    ], 1, 1, this.dungeon.width - 2, this.dungeon.height - 2);

    // Fill the floor of the map with random, weighted obstacles
    this.playerLayer.weightedRandomize([
      { index: -1, weight: 25 }, // Place an empty tile most of the tile
      { index: 7 + this.lvlTileLine, weight: 3 },
      { index: 8 + this.lvlTileLine, weight: 2 },
      { index: 9 + this.lvlTileLine, weight: 2 },
    ], 1, 1, this.dungeon.width - 2, this.dungeon.height - 2);

    // Entrance and exit
    this.groundLayer.fill(0 + this.lvlTileLine, start[0], start[1] - 1, 1, 3);
    this.groundLayer.fill(0 + this.lvlTileLine, goal[0], goal[1] - 1, 1, 3);

    this.playerLayer.fill(-1, start[0], start[1] - 1, 1, 3);
    this.playerLayer.fill(-1, goal[0], goal[1] - 1, 1, 3);
  }

  generateRandomCity(start, goal) {

  }

  generateRandomSwamp(start, goal) {

  }

  generateRandomFortress(start, goal) {

  }

  generateRandomRootWorld(start, goal) {

  }

  createEnemies() {
    if (this.loadLevel) {
      let enemiesArray = JSON.parse(localStorage.getItem('enemies'));

      for (let enemy of enemiesArray) {
        this.enemies.create(enemy.x, enemy.y, enemy.width, enemy.height);
      }
    }
    else {
      while (this.enemies.getLength() < 10) {
        let x = Phaser.Math.Between(1, this.dungeon.width - 1);
        let y = Phaser.Math.Between(1, this.dungeon.height - 1);

        if (!this.playerLayer.getTileAt(x, y)) {
          let worldX = this.dungeon.tileToWorldX(x) + this.dungeon.tileWidth / 2;
          let worldY = this.dungeon.tileToWorldY(y) + this.dungeon.tileHeight / 2;

          // Add a boss at the end of the chapter
          if (this.level === 5 && this.enemies.getLength() === 9) {
            this.playerLayer.fill(13 + this.lvlTileLine, x, y, 1, 1);
          }
          else {
            this.playerLayer.fill(Phaser.Math.Between(10, 12) + this.lvlTileLine, x, y, 1, 1);
          }
          this.enemies.create(worldX, worldY, this.dungeon.tileWidth, this.dungeon.tileHeight);
        }
      }
    }
  }

  onMeetEnemy(player, enemy) {
    // Stops movements generated by click and keyboard
    this.tweens.killAll();
    this.input.keyboard.enabled = false;

    for (let elem in this.cursors) {
      this.cursors[elem].isDown = false;
    }

    let worldX = enemy.x - this.dungeon.tileWidth / 2;
    let worldY = enemy.y - this.dungeon.tileHeight / 2;

    this.lastEnemyPos = { x: worldX, y: worldY };

    let enemyTile = this.playerLayer.getTileAtWorldXY(worldX, worldY);
    enemyTile.setCollision(false);
    enemy.destroy();

    this.enemyRoar.play();

    this.cameras.main.shake(1000, 0.05, false, (camera, animationCompletion) => {
      this.music.pause();

      if (animationCompletion === 1) {
        this.input.keyboard.enabled = true;
        this.scene.pause('Game').launch('Battle', enemyTile);
      }
    });
  }

  resumeAfterFight() {
    this.cameras.main.fadeIn(500);
    this.input.keyboard.enabled = true;

    if (this.lastEnemyPos) {
      this.playerLayer.getTileAtWorldXY(this.lastEnemyPos.x, this.lastEnemyPos.y).index = -1;
      this.lastEnemyPos = null;
    }

    if (!this.enemies.children.entries.length) {
      if (this.game.globals.level === 5) {
        this.game.globals.level = 1;
        this.game.globals.chapter++;

        this.scene.start('Story').stop('Game');
      }
      else {
        this.game.globals.level++;

        this.scene.restart();

      }
    }
    else {
      this.music.play();
    }
  }

  autosave() {
    let groundLayerArray = [];
    let playerLayerArray = [];
    let enemiesArray = [];

    this.groundLayer.forEachTile(tile => groundLayerArray.push({
      x: tile.x,
      y: tile.y,
      index: tile.index
    }));

    this.playerLayer.forEachTile(tile => playerLayerArray.push({
      x: tile.x,
      y: tile.y,
      index: tile.index
    }));

    for (let enemy of this.enemies.children.entries) {
      enemiesArray.push({
        x: enemy.x,
        y: enemy.y,
        width: enemy.width,
        height: enemy.height,
      });
    }

    localStorage.setItem('chapter', this.game.globals.chapter);
    localStorage.setItem('level', this.game.globals.level);
    localStorage.setItem('groundLayer', JSON.stringify(groundLayerArray));
    localStorage.setItem('playerLayer', JSON.stringify(playerLayerArray));
    localStorage.setItem('enemies', JSON.stringify(enemiesArray));
  }

  randomPath(start, goal, mapSize) {
    let cmp = 0;
    let currentPos = start;
    let mapArray = new Array(mapSize[0]).fill(0)
      .map(() => new Array(mapSize[1]).fill(0));

    mapArray[start[0]][start[1]] = -1;
    mapArray[goal[0]][goal[1]] = -1;

    while (currentPos !== goal) {
      let neighbors = [];

      if (currentPos[0] + 1 < mapSize[0]) {
        neighbors.push([currentPos[0] + 1, currentPos[1]]);
      }
      if (currentPos[1] - 1 > 0) {
        neighbors.push([currentPos[0], currentPos[1] - 1]);
      }
      if (currentPos[1] + 1 < mapSize[1]) {
        neighbors.push([currentPos[0], currentPos[1] + 1]);
      }

      let nearGoal = neighbors.filter(pos => (pos[0] === goal[0] && pos[1] === goal[1])).length;

      if (nearGoal) {
        break;
      }
      else {
        let direction = Phaser.Math.Between(0, neighbors.length - 1);

        currentPos = neighbors[direction];
        mapArray[currentPos[0]][currentPos[1]] = -1;
      }

      cmp++;

      if (cmp >= 1000) {
        console.log("Took too long to find a path !!!");
        break;
      }
    }

    return mapArray;
  }
};