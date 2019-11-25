import * as PHASER from '../phaser.min.js';
import config from '../Config/config.js';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  init(data) {
    this.enemyInfo = data;
    this.answer = this.generateEquation();
    this.remainingTries = 3;
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

    this.playerShot = this.add.sprite(this.player.x, this.player.y, 'playerShot');
    this.playerShot.setScale(3);
    this.playerShot.alpha = 0;

    this.playerLifeImg = this.add.image(0, 0, 'heart');
    this.playerLifeImg.setPosition(this.player.x, this.player.y + this.player.height + this.playerLifeImg.height + 5);
    this.playerLifeText = this.add.text(0, 0, this.remainingTries, { fontSize: '32px' });
    this.playerLifeText.setPosition(this.playerLifeImg.x + this.playerLifeImg.width/2 + 5, this.playerLifeImg.y - this.playerLifeText.height / 2);

    this.enemy = this.physics.add.sprite(0, 0, 'crossRoad', this.enemyInfo.index);
    this.enemy.setPosition(config.width - 3 * this.tilesize, config.height / 2 + this.player.height);
    this.enemy.setScale(3);

    this.enemyShot = this.add.sprite(this.enemy.x, this.enemy.y, 'playerShot');
    this.enemyShot.setScale(3);
    this.enemyShot.alpha = 0;

    this.gameOverText = this.add.text(0, 0, 'GAME OVER', { fontSize: '100px', fontFamily: 'sans-serif' });
    this.gameOverText.alpha = 0;
    this.gameOverText.setScale(0);
    this.gameOverText.setPosition(config.width / 2 - this.gameOverText.width / 2, config.height / 2);

    let answerText = this.add.text(0, 0, this.answer.text, { fontSize: '60px' });
    answerText.setPosition(config.width / 2 - answerText.width / 2, 120);

    // Virtual Keyboard
    this.virtualkb = this.physics.add.staticGroup({ classType: Phaser.GameObjects.Zone });

    this.createVKB();
    this.createAnims();

    // Checking for input (keyboard and mouse)
    this.cursors = this.keysToWatch();
    this.input.on('gameobjectdown', this.mouseAction);

    this.userAnswer = '';
    this.userAnswerText = this.add.text(0, 0, this.userAnswer, { fontSize: '80px', fill: '#f00' });
  }

  update() {
    for (let elem in this.cursors) {
      if (this.remainingTries) {
        if (Phaser.Input.Keyboard.JustDown(this.cursors[elem])) {
          if (this.cursors[elem].keyCode === 13) {
            this.validateAnswer();
          }
          else {
            this.updateAnswer(this.cursors[elem].keyCode);
          }
        }
      }
      else {
        this.game.globals.level = 0;
      }
    }
    this.userAnswerText.setText(this.userAnswer);
    this.userAnswerText.setPosition(config.width / 2 - this.userAnswerText.width / 2, 240);
  }

  generateEquation() {
    let level = this.game.globals.level
    let a = 0;
    let b = 0;
    let c = null;
    let result = 0;
    let text = '';

    if (level < 3) {
      a = Phaser.Math.Between(0, 5);
      b = Phaser.Math.Between(0, 5);
      c = (level === 9) ? Phaser.Math.Between(0, 10) : null;

      result = a + b + ((level === 9) ? c : 0);
      text = `${a} + ${b} ${(level === 9) ? '+ ' + c : ''}`;
    }

    result = result.toString();

    return { result, text };
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

  validateAnswer() {
    if (this.userAnswer === this.answer.result) {
      this.playerAttacksTween.play();
    }
    else if (this.userAnswer !== '') {
      this.enemyAttacksTween.play();
      this.userAnswer = '';
      this.remainingTries--;
      this.playerLifeText.setText(this.remainingTries);
    }
  }

  mouseAction(pointer, virtualKey) {
    let thisScene = pointer.manager.game.scene.keys.Battle;

    if (thisScene.remainingTries) {
      if (virtualKey.textValue === 'V') {
        thisScene.validateAnswer();
      }
      else if (virtualKey.textValue === 'X') {
        thisScene.userAnswer = '';
      }
      else {
        thisScene.userAnswer += virtualKey.textValue.toString();
      }
    }
    else {
      thisScene.game.globals.level = 0;
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

  createAnims() {
    this.playerAttacksTween = this.tweens.add({
      targets: this.player,
      duration: 500,
      repeat: 1,
      rotation: 0.5,
      ease: 'Sine.easeInOut',
      yoyo: true,
      onStart: function () { this.playerShot.alpha = 1 }.bind(this),
      onComplete: function () { this.playerShotTween.play() }.bind(this),
      paused: true
    });

    this.playerShotTween = this.tweens.add({
      targets: this.playerShot,
      duration: 500,
      rotation: 10,
      x: this.enemy.x,
      ease: 'Sine.easeInOut',
      onComplete: function () {
        this.playerShot.alpha = 0;
        this.enemyGetsHitTween.play();
      }.bind(this),
      paused: true
    });

    this.enemyGetsHitTween = this.tweens.add({
      targets: this.enemy,
      duration: 500,
      rotation: 10,
      scale: 0,
      ease: 'Power1',
      onComplete: function () { this.scene.resume('Game').stop('Battle') }.bind(this),
      paused: true
    });

    this.enemyAttacksTween = this.tweens.add({
      targets: this.enemy,
      duration: 500,
      repeat: 1,
      rotation: -0.5,
      ease: 'Sine.easeInOut',
      yoyo: true,
      onComplete: function () { this.enemyShotTween.play() }.bind(this),
      paused: true
    });

    this.enemyShotTween = this.tweens.add({
      targets: this.enemyShot,
      duration: 500,
      rotation: 10,
      x: this.player.x,
      ease: 'Sine.easeInOut',
      onStart: function () { this.enemyShot.alpha = 1 }.bind(this),
      onComplete: function () {
        this.enemyShot.alpha = 0;
        (this.remainingTries) ? this.playerGetsHitTween.play() : this.playerDiesTween.play();
      }.bind(this),
      paused: true
    });

    this.playerGetsHitTween = this.tweens.add({
      targets: this.player,
      duration: 500,
      rotation: 6.3,
      ease: 'Power1',
      paused: true
    });

    this.playerDiesTween = this.tweens.add({
      targets: this.player,
      duration: 500,
      rotation: 10,
      scale: 0,
      ease: 'Power1',
      onComplete: function () { this.gameOverTween.play() }.bind(this),
      paused: true,
    });

    this.gameOverTween = this.tweens.add({
      targets: this.gameOverText,
      duration: 1000,
      alpha: 1,
      scale: 1,
      ease: 'Sine.easeInOut',
      paused: true,
    });
  }
}