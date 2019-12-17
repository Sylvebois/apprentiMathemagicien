import * as PHASER from '../phaser.min.js';
import config from '../Config/config.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.dungeon = this.make.tilemap({
      tileWidth: this.game.globals.tilesize,
      tileHeight: this.game.globals.tilesize,
      width: Math.floor(config.width / this.game.globals.tilesize),
      height: Math.floor(config.height / this.game.globals.tilesize)
    });

    // A FAIRE : grouper toutes les images sur un seul tileset
    let tiles = this.dungeon.addTilesetImage('tileset');

    this.groundLayer = this.dungeon.createBlankDynamicLayer('Ground Layer', tiles);
    this.playerLayer = this.dungeon.createBlankDynamicLayer('Player Layer', tiles);

    // Layers initialization
    this.createDungeonMap();

    // Player initialization
    this.player = this.physics.add.sprite(0, Math.floor(this.dungeon.heightInPixels / 2), 'tileset', 51);
    this.player.setCollideWorldBounds(true);

    // Enemies initialization
    this.enemies = this.physics.add.staticGroup({ classType: Phaser.GameObjects.Zone });
    this.randomizeEnemies();

    // Checking collision with obstacles (non -1 index on the layer) and ennemies
    this.physics.add.collider(this.player, this.playerLayer);
    this.physics.add.overlap(this.player, this.enemies, this.onMeetEnemy, false, this);

    // Checking for input (keyboard and mouse)
    this.touchTriangles = {
      'top': new Phaser.Geom.Triangle(0, 0, config.width, 0, config.width / 2, config.height / 2),
      'left': new Phaser.Geom.Triangle(0, 0, 0, config.height, config.width / 2, config.height / 2),
      'bottom': new Phaser.Geom.Triangle(0, config.height, config.width, config.height, config.width / 2, config.height / 2),
      'right': new Phaser.Geom.Triangle(config.width, 0, config.width, config.height, config.width / 2, config.height / 2),
    };

    this.pointer = this.input.activePointer;
    this.cursors = this.keysToWatch();

    this.events.on('resume', this.resumeAfterFight, this);
  }

  update() {
    this.player.body.setVelocity(0);

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

  onMeetEnemy(player, enemy) {
    this.input.keyboard.enabled = false;

    for (let elem in this.cursors) {
      this.cursors[elem].isDown = false;
    }

    let worldX = enemy.x - this.dungeon.tileWidth / 2;
    let worldY = enemy.y - this.dungeon.tileHeight / 2;

    this.lastEnemyPos = { x: worldX, y: worldY };

    enemy.destroy();

    this.cameras.main.shake(1000, 0.05, false, (cam, evo) => {
      if (evo === 1) {
        let enemyTile = this.playerLayer.getTileAtWorldXY(worldX, worldY);
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

    if(!this.enemies.children.entries.length) {
      this.game.globals.level++;
      this.scene.restart();
    }
  }

  keysToWatch() {
    let arrowKeys = this.input.keyboard.createCursorKeys();
    let otherKeys = this.input.keyboard.addKeys({
      'numTwo': Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO,
      'numFour': Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR,
      'numSix': Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX,
      'numEight': Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT,
    });

    return Object.assign(otherKeys, arrowKeys);
  }

  createDungeonMap() {
    let lvlTileLine = 17 * Math.floor(this.game.globals.level/10);

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

    if (this.game.globals.level % 10 === 0) {
      this.groundLayer.fill(1 + lvlTileLine, 0, middle - 1, this.dungeon.width, 1);
      this.groundLayer.fill(0 + lvlTileLine, 0, middle, this.dungeon.width, 1);
      this.groundLayer.fill(2 + lvlTileLine, 0, middle + 1, this.dungeon.width, 1);

      this.playerLayer.fill(-1, 0, middle - 1, this.dungeon.width, 3);
    }
    else {
      this.groundLayer.fill(3 + lvlTileLine, 0, middle - 1, 1, 3);
      this.playerLayer.fill(-1, 0, middle - 1, 1, 3);
    }

    // Every tiles with an index of -1 won't use the collision system
    this.playerLayer.setCollisionByExclusion([-1]);
  }

  randomizeEnemies() {
    let lvlTileLine = 17 * Math.floor(this.game.globals.level/10);

    while (this.enemies.getLength() < 10) {
      let x = Phaser.Math.Between(1, this.dungeon.width - 1);
      let y = Phaser.Math.Between(1, this.dungeon.height - 1);

      if (!this.playerLayer.getTileAt(x, y)) {
        let worldX = this.dungeon.tileToWorldX(x) + this.dungeon.tileWidth / 2;
        let worldY = this.dungeon.tileToWorldY(y) + this.dungeon.tileHeight / 2;

        this.playerLayer.fill(Phaser.Math.Between(10, 12) + lvlTileLine, x, y, 1, 1);
        this.enemies.create(worldX, worldY, this.dungeon.tileWidth, this.dungeon.tileHeight);
      }
    }
  }
};
