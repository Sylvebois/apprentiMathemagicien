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
    let tiles = this.dungeon.addTilesetImage('crossRoad');

    this.groundLayer = this.dungeon.createBlankDynamicLayer('Ground Layer', tiles);
    this.playerLayer = this.dungeon.createBlankDynamicLayer('Player Layer', tiles);
    this.playerLayer.setCollisionByExclusion([-1]);

    // Border of the scene
    this.groundLayer.fill(15, 0, 0, this.dungeon.width, 1);
    this.groundLayer.fill(15, 0, this.dungeon.height - 1, this.dungeon.width, 1);
    this.groundLayer.fill(15, 0, 0, 1, this.dungeon.height);
    this.groundLayer.fill(15, this.dungeon.width - 1, 0, 1, this.dungeon.height);

    this.randomizeMap(); // Initial randomization

    // First level always get a path in the middle
    if (this.game.globals.level % 10 === 0) {
      let middle = Math.floor(this.dungeon.height / 2);

      this.groundLayer.fill(1, 0, middle - 1, this.dungeon.width, 1);
      this.groundLayer.fill(0, 0, middle, this.dungeon.width, 1);
      this.groundLayer.fill(2, 0, middle + 1, this.dungeon.width, 1);

      this.playerLayer.fill(-1, 0, middle - 1, this.dungeon.width, 3);
    }

    this.player = this.physics.add.sprite(32, 400, 'player');
    this.physics.world.bounds.width = this.dungeon.widthInPixels;
    this.physics.world.bounds.height = this.dungeon.heightInPixels;
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.playerLayer);

    //Checking for input (keyboard and mouse)
    this.input.on('pointerdown', this.action, this);
    this.cursors = this.keysToWatch();
  }

  update() {
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
    }
    else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(80);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-80);
    }
    else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(80);
    }
  }

  action() {
    if (this.state === 'fight') {

    }
    else {

    }
  }

  keysToWatch() {
    let arrowKeys = this.input.keyboard.createCursorKeys();
    let otherKeys = this.input.keyboard.addKeys({
      'zero': Phaser.Input.Keyboard.KeyCodes.ZERO,
      'one': Phaser.Input.Keyboard.KeyCodes.ONE,
      'two': Phaser.Input.Keyboard.KeyCodes.TWO,
      'three': Phaser.Input.Keyboard.KeyCodes.THREE,
      'four': Phaser.Input.Keyboard.KeyCodes.FOUR,
      'five': Phaser.Input.Keyboard.KeyCodes.FIVE,
      'six': Phaser.Input.Keyboard.KeyCodes.SIX,
      'seven': Phaser.Input.Keyboard.KeyCodes.SEVEN,
      'eight': Phaser.Input.Keyboard.KeyCodes.EIGHT,
      'nine': Phaser.Input.Keyboard.KeyCodes.NINE,
      'numZero': Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO,
      'numOne': Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE,
      'numTwo': Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO,
      'numThree': Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE,
      'numFour': Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR,
      'numFive': Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE,
      'numSix': Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX,
      'numSeven': Phaser.Input.Keyboard.KeyCodes.NUMPAD_SEVEN,
      'numEight': Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT,
      'numNine': Phaser.Input.Keyboard.KeyCodes.NUMPAD_NINE,
      'backspace': Phaser.Input.Keyboard.KeyCodes.BACKSPACE,
      'enter': Phaser.Input.Keyboard.KeyCodes.ENTER
    });

    return Object.assign(otherKeys, arrowKeys);
  }

  randomizeMap() {
    // Fill the floor with random ground tiles
    this.groundLayer.weightedRandomize(1, 1, this.dungeon.width - 2, this.dungeon.height - 2, [
      { index: 9, weight: 1 },
      { index: 10, weight: 1 },
      { index: 11, weight: 1 },
      { index: 12, weight: 1 }
    ]);

    // Fill the floor of the map with random, weighted obstacles
    this.playerLayer.weightedRandomize(1, 1, this.dungeon.width - 2, this.dungeon.height - 2, [
      { index: -1, weight: 50 }, // Place an empty tile most of the tile
      { index: 13, weight: 3 },
      { index: 14, weight: 2 },
      { index: 15, weight: 2 },
    ]);
  }
};
