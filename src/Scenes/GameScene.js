import * as PHASER from '../phaser.min.js';
import { dialogs } from '../text.js';
import config from '../Config/config.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.loadLevel = (this.game.globals.level == localStorage.getItem('level')) ? true : false;

    this.chapterProgress = this.game.globals.level % 10;
    this.chapter = Math.floor(this.game.globals.level / 10);

    this.showTextBox = (this.chapterProgress === 0 || this.chapterProgress === 4 || this.chapterProgress === 9) ? true : false;
  }

  create() {
    this.language = this.game.globals.language;

    this.dungeon = this.make.tilemap({
      tileWidth: this.game.globals.tilesize,
      tileHeight: this.game.globals.tilesize,
      width: Math.floor(config.width / this.game.globals.tilesize),
      height: Math.floor(config.height / this.game.globals.tilesize),
    });

    let tiles = this.dungeon.addTilesetImage('tileset');

    // Layers initialization
    this.groundLayer = this.dungeon.createBlankDynamicLayer('Ground Layer', tiles);
    this.playerLayer = this.dungeon.createBlankDynamicLayer('Player Layer', tiles);
    this.createDungeonMap();

    // Player initialization
    this.player = this.physics.add.sprite(0, Math.floor(this.dungeon.heightInPixels / 2), 'tileset', 51);
    this.player.setCollideWorldBounds(true);

    // Enemies initialization
    this.enemies = this.physics.add.staticGroup({ classType: Phaser.GameObjects.Zone });
    this.createEnemies();

    // Show a textbox on some levels
    if (this.showTextBox) {
      this.createTextBox();
    }

    // Checking collision with obstacles (non -1 index on the layer) and ennemies
    this.physics.add.collider(this.player, this.playerLayer);
    this.physics.add.overlap(this.player, this.enemies, this.onMeetEnemy, false, this);

    // Checking for input
    this.pointer = new Object();
    this.createMouseController();
    this.cursors = this.createKeyboardController();

    this.events.on('resume', this.resumeAfterFight, this);

    this.autosave();
  }

  update() {
    this.player.body.setVelocity(0);

    if (this.showTextBox && (this.input.keyboard.keys.some(elem => elem.isDown) || this.pointer.isDown)) {
      this.showTextBox = false;
      this.graphics.alpha = 0;
      this.pnj.destroy();
      this.dialogText.destroy();
    }

    if (this.input.keyboard.enabled) {
      // Horizontal movement
      if (this.cursors.left.isDown || this.cursors.numFour.isDown ||
        (this.pointer.isDown && this.touchTriangles.left.contains(this.pointer.x, this.pointer.y))) {
        this.player.body.setVelocityX(-160);
      }
      else if (this.cursors.right.isDown || this.cursors.numSix.isDown ||
        (this.pointer.isDown && this.touchTriangles.right.contains(this.pointer.x, this.pointer.y))) {
        this.player.body.setVelocityX(160);
      }

      // Vertical movement
      if (this.cursors.up.isDown || this.cursors.numEight.isDown ||
        (this.pointer.isDown && this.touchTriangles.top.contains(this.pointer.x, this.pointer.y))) {
        this.player.body.setVelocityY(-160);
      }
      else if (this.cursors.down.isDown || this.cursors.numTwo.isDown ||
        (this.pointer.isDown && this.touchTriangles.bottom.contains(this.pointer.x, this.pointer.y))) {
        this.player.body.setVelocityY(160);
      }
    }
    else {
      this.player.body.setVelocity(0, 0);
    }
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

    this.pnj = this.add.image(6, 6, 'tileset', (this.chapterProgress === 9) ? 17 * this.chapter + 13 : 52);
    this.pnj.setOrigin(0, 0);
    this.pnj.setScale(4);

    let textPosX = this.pnj.width * this.pnj._scaleX + this.pnj.x + 6;
    let textNum = (this.chapterProgress === 0) ? 0 : (this.chapterProgress === 4) ? 1 : 2;

    this.dialogText = this.add.text(textPosX, 0, dialogs[`chapter${this.chapter + 1}`][this.language][textNum], { fontSize: '20px', fill: '#fff' });
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
      let lvlTileLine = 17 * this.chapter;

      // Border of the scene
      this.playerLayer.fill(9 + lvlTileLine, 0, 0, this.dungeon.width, 1);
      this.playerLayer.fill(9 + lvlTileLine, 0, this.dungeon.height - 1, this.dungeon.width, 1);
      this.playerLayer.fill(9 + lvlTileLine, 0, 0, 1, this.dungeon.height);
      this.playerLayer.fill(9 + lvlTileLine, this.dungeon.width - 1, 0, 1, this.dungeon.height);

      // Fill the floor with random ground tiles
      this.groundLayer.weightedRandomize(1, 1, this.dungeon.width - 2, this.dungeon.height - 2, [
        { index: 3 + lvlTileLine, weight: 1 },
        { index: 4 + lvlTileLine, weight: 1 },
        { index: 5 + lvlTileLine, weight: 1 },
        { index: 6 + lvlTileLine, weight: 1 }
      ]);

      // Fill the floor of the map with random, weighted obstacles
      this.playerLayer.weightedRandomize(1, 1, this.dungeon.width - 2, this.dungeon.height - 2, [
        { index: -1, weight: 50 }, // Place an empty tile most of the tile
        { index: 7 + lvlTileLine, weight: 3 },
        { index: 8 + lvlTileLine, weight: 2 },
        { index: 9 + lvlTileLine, weight: 2 },
      ]);

      // First level always get a path in the middle
      let middle = Math.floor(this.dungeon.height / 2);

      if (this.chapterProgress === 0) {
        this.groundLayer.fill(1 + lvlTileLine, 0, middle - 1, this.dungeon.width, 1);
        this.groundLayer.fill(0 + lvlTileLine, 0, middle, this.dungeon.width, 1);
        this.groundLayer.fill(2 + lvlTileLine, 0, middle + 1, this.dungeon.width, 1);

        this.playerLayer.fill(-1, 0, middle - 1, this.dungeon.width, 3);
      }
      else {
        this.groundLayer.fill(3 + lvlTileLine, 0, middle - 1, 1, 3);
        this.playerLayer.fill(-1, 0, middle - 1, 1, 3);
      }
    }

    // Every tiles with an index of -1 won't use the collision system
    this.playerLayer.setCollisionByExclusion([-1]);
  }

  createEnemies() {
    if (this.loadLevel) {
      let enemiesArray = JSON.parse(localStorage.getItem('enemies'));

      for (let enemy of enemiesArray) {
        this.enemies.create(enemy.x, enemy.y, enemy.width, enemy.height);
      }
    }
    else {
      let lvlTileLine = 17 * this.chapter;

      while (this.enemies.getLength() < 10) {
        let x = Phaser.Math.Between(1, this.dungeon.width - 1);
        let y = Phaser.Math.Between(1, this.dungeon.height - 1);

        if (!this.playerLayer.getTileAt(x, y)) {
          let worldX = this.dungeon.tileToWorldX(x) + this.dungeon.tileWidth / 2;
          let worldY = this.dungeon.tileToWorldY(y) + this.dungeon.tileHeight / 2;

          // Add a boss at the end of the chapter
          if (this.chapterProgress === 9 && this.enemies.getLength() === 9) {
            this.playerLayer.fill(13 + lvlTileLine, x, y, 1, 1);
          }
          else {
            this.playerLayer.fill(Phaser.Math.Between(10, 12) + lvlTileLine, x, y, 1, 1);
          }
          this.enemies.create(worldX, worldY, this.dungeon.tileWidth, this.dungeon.tileHeight);
        }
      }
    }
  }

  onMeetEnemy(player, enemy) {
    this.input.keyboard.enabled = false;

    for (let elem in this.cursors) {
      this.cursors[elem].isDown = false;
    }

    let worldX = enemy.x - this.dungeon.tileWidth / 2;
    let worldY = enemy.y - this.dungeon.tileHeight / 2;

    this.lastEnemyPos = { x: worldX, y: worldY };

    enemy.destroy();

    this.cameras.main.shake(1000, 0.05, false, (camera, animationCompletion) => {
      if (animationCompletion === 1) {
        let enemyTile = this.playerLayer.getTileAtWorldXY(worldX, worldY);
        this.input.keyboard.enabled = true;
        this.scene.pause('Game').launch('Battle', enemyTile);
      }
    });
  }

  resumeAfterFight() {
    this.input.keyboard.enabled = true;

    if (this.lastEnemyPos) {
      this.playerLayer.getTileAtWorldXY(this.lastEnemyPos.x, this.lastEnemyPos.y).index = -1;
      this.lastEnemyPos = null;
    }

    if (!this.enemies.children.entries.length) {
      this.game.globals.level++;

      if (this.game.globals.level > 9 && this.chapterProgress === 0) {
        this.scene.start('Story').stop('Game');
      }
      else {
        this.scene.restart();
      }
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

    localStorage.setItem('level', this.game.globals.level);
    localStorage.setItem('groundLayer', JSON.stringify(groundLayerArray));
    localStorage.setItem('playerLayer', JSON.stringify(playerLayerArray));
    localStorage.setItem('enemies', JSON.stringify(enemiesArray));
  }
};
