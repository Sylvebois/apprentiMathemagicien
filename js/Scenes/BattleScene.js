import * as PHASER from '../phaser.min.js';
import config from '../Config/config.js';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  init(data) {
    this.enemyInfo = data;
  }
  create() {
    this.tilesize = this.game.globals.tilesize;

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(3, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);

    this.graphics.fillRect(0, 0, config.width, config.height);
    this.graphics.strokeRect(3, 3, config.width - 6, config.height - 6);

    this.player = this.physics.add.sprite(0, 0, 'player');
    this.player.setPosition(3 * this.tilesize, config.height / 2 + this.player.height);
    this.player.setScale(3);

    this.enemy = this.physics.add.sprite(0, 0, 'crossRoad', this.enemyInfo.index);
    this.enemy.setPosition(config.width - 3 * this.tilesize, config.height / 2 + this.player.height);
    this.enemy.setScale(3);

    this.virtualkb = this.physics.add.staticGroup({ classType: Phaser.GameObjects.Zone });
    this.createVKB();

    // Checking for input (keyboard and mouse)
    this.cursors = this.keysToWatch();
    this.input.on('pointerdown', this.mouseAction, this);
  }

  update() {

  }

  mouseAction() {

  }

  keysToWatch() {
    return this.input.keyboard.addKeys({
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
  }

  createVKB() {
    let radius = 5;

    this.graphics.lineStyle(3, 0x00aa00);
    this.graphics.fillStyle(0x000000, 1);

    for(let i = 0 ; i < 12; i++) {
      let x = 1.5 * this.tilesize + i * 2 * this.tilesize;
      let y = config.height - 2 * this.tilesize;

      this.graphics.beginPath();

      this.graphics.moveTo(x - this.tilesize, config.height);
      this.graphics.lineTo(x - this.tilesize, y - 2 * this.tilesize + radius);
      this.graphics.arc(x - this.tilesize + radius, y - 2 * this.tilesize + radius, radius, Math.PI, 3 * Math.PI / 2);

      this.graphics.lineTo(x + this.tilesize - radius, y - 2 * this.tilesize);
      this.graphics.arc(x + this.tilesize - radius, y - 2 * this.tilesize + radius, radius, 3 * Math.PI / 2, 0);

      this.graphics.lineTo(x + this.tilesize, config.height);
      this.graphics.lineTo(x - this.tilesize, config.height);

      this.graphics.closePath();
      this.graphics.fillPath();
      this.graphics.strokePath();

      let button = this.virtualkb.create(x, y, 2 * this.tilesize, 4 * this.tilesize);
      let text;

      if(i === 0) {
        text = this.add.text(0, 0, 'V', { fontSize: '64px' , fontFamily: 'sans-serif', color: 'green'});
      }
      else if (i === 11) {
        text = this.add.text(0, 0, 'X', { fontSize: '64px', fontFamily: 'sans-serif', color: 'red'});
      }
      else {
        text = this.add.text(0, 0, i - 1, { fontSize: '64px', fontFamily: 'sans-serif', color: 'white'});
      }

      Phaser.Display.Align.In.Center(text, button);
    }
  }
}