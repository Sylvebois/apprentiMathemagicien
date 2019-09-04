import * as PHASER from '../phaser.min.js';
import config from '../Config/config.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    //Checking for input (keyboard and mouse)
    this.input.on('pointerdown', this.action, this);
    this.cursors = this.keysToWatch();
  }

  update() {

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
      'zero' : Phaser.Input.Keyboard.KeyCodes.ZERO,
      'one' : Phaser.Input.Keyboard.KeyCodes.ONE,
      'two' : Phaser.Input.Keyboard.KeyCodes.TWO,
      'three' : Phaser.Input.Keyboard.KeyCodes.THREE,
      'four' : Phaser.Input.Keyboard.KeyCodes.FOUR,
      'five' : Phaser.Input.Keyboard.KeyCodes.FIVE,
      'six' : Phaser.Input.Keyboard.KeyCodes.SIX,
      'seven' : Phaser.Input.Keyboard.KeyCodes.SEVEN,
      'eight' : Phaser.Input.Keyboard.KeyCodes.EIGHT,
      'nine' : Phaser.Input.Keyboard.KeyCodes.NINE,
      'numZero' : Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO,
      'numOne' : Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE,
      'numTwo' : Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO,
      'numThree' : Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE,
      'numFour' : Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR,
      'numFive' : Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE,
      'numSix' : Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX,
      'numSeven' : Phaser.Input.Keyboard.KeyCodes.NUMPAD_SEVEN,
      'numEight' : Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT,
      'numNine' : Phaser.Input.Keyboard.KeyCodes.NUMPAD_NINE,
      'backspace' : Phaser.Input.Keyboard.KeyCodes.BACKSPACE
    });

    return Object.assign(otherKeys, arrowKeys);
  }
};
