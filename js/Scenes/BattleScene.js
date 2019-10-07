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
    this.input.on('gameobjectdown',this.mouseAction);

    this.userAnswer = '';
  }

  update() {
    for (let elem in this.cursors) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors[elem])) {
        if (this.cursors[elem].keyCode === 13) {

        }
        else {
          this.updateAnswer(this.cursors[elem].keyCode);
        }
      }
    }

    for(let elem in this.virtualkb) {
    }
  }

  updateAnswer(keyCode) {
    if (keyCode >= 48 && keyCode <= 57) {
      this.userAnswer += String.fromCharCode(keyCode);
    }
    else if (keyCode >= 96 && keyCode <= 105) {
      this.userAnswer += String.fromCharCode(keyCode - 48);
    }
    else if (keyCode === 8) {
      this.userAnswer = this.userAnswer.substring(0, this.userAnswer.length - 1);
    }
  }

  mouseAction(pointer, virtualKey) {
    //this.scene.resume('Game').stop('Battle');
    if(virtualKey.textValue === 'V') {

    }
    else if(virtualKey.textValue === 'X') {
      this.userAnswer = '';
    }
    else {
      this.userAnswer += virtualKey.textValue.toString();
    }
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

    for (let i = 0; i < 12; i++) {
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
      button.setInteractive();

      if (i === 0) {
        button.textValue = 'V';
        button.textColor = 'green';
      }
      else if (i === 11) {
        button.textValue = 'X';
        button.textColor = 'red';
      }
      else {
        button.textValue = i - 1;
        button.textColor = 'white';
      }

      let text = this.add.text(0, 0, button.textValue, { fontSize: '64px', fontFamily: 'sans-serif', color: button.textColor });
      Phaser.Display.Align.In.Center(text, button);
    }
  }
}