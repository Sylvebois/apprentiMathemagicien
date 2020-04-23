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

    this.player = this.physics.add.sprite(0, 0, 'tileset', 51);
    this.player.setPosition(3 * this.tilesize, config.height / 2 + this.player.height);
    this.player.setScale(3);

    this.playerShot = this.add.sprite(this.player.x, this.player.y, 'tileset', 54);
    this.playerShot.setScale(3);
    this.playerShot.alpha = 0;

    this.playerLifeImg = this.add.image(0, 0, 'tileset', 53);
    this.playerLifeImg.setPosition(this.player.x, this.player.y + this.player.height + this.playerLifeImg.height + 5);
    this.playerLifeText = this.add.text(0, 0, this.remainingTries, { fontSize: '32px' });
    this.playerLifeText.setPosition(this.playerLifeImg.x + this.playerLifeImg.width / 2 + 5, this.playerLifeImg.y - this.playerLifeText.height / 2);

    this.enemy = this.physics.add.sprite(0, 0, 'tileset', this.enemyInfo.index);
    this.enemy.setPosition(config.width - 3 * this.tilesize, config.height / 2 + this.player.height);
    this.enemy.setScale(3);

    this.enemyShot = this.add.sprite(this.enemy.x, this.enemy.y, 'tileset', this.enemyInfo.index + 4);
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

    if (level < 10) {
      // Add
      a = Phaser.Math.Between(0, 10 * ((level)? level : 1));
      b = Phaser.Math.Between(0, 10 * ((level)? level : 1));
      c = (level === 9) ? Phaser.Math.Between(0, 100) : null;

      result = a + b + ((level === 9) ? c : 0);
      text = `${a} + ${b} ${(level === 9) ? '+ ' + c : ''}`;
    }
    else if (level >= 10 && level < 20) {
      // Substract
      a = Phaser.Math.Between(0, 10 + (level % 10));
      b = Phaser.Math.Between(0, a);
      c = (level === 19) ? Phaser.Math.Between(0, a - b) : null;

      result = a - b - ((level === 19) ? c : 0);
      text = `${a} - ${b} ${(level === 19) ? '- ' + c : ''}`;
    }
    else if (level >= 20 && level < 30) {
      // Multiply
      a = Phaser.Math.Between(0, 10 + (level % 10));
      b = Phaser.Math.Between(1, 10 + (level % 10));
      c = (level === 9) ? Phaser.Math.Between(1, 10) : null;

      result = a * b * ((level === 9) ? c : 1);
      text = `${a} x ${b} ${(level === 9) ? 'x ' + c : ''}`;
    }
    else if (level >= 30 && level < 40) {
      // Divide
      a = Phaser.Math.Between(2, 100 * (1 + level % 10));
      b = Array.from(this.decomposeNumber(a));
      let indexB = Phaser.Math.Between(0, b.length - 1);
      c = (level === 9) ? Array.from(this.decomposeNumber(a / b[indexB])) : [];
      let indexC = Phaser.Math.Between(0, c.length - 1);


      result = a / b[indexB] / ((level === 9) ? c[indexC] : 1);
      text = `${a} / ${b[indexB]} ${(level === 9) ? '/ ' + c[indexC] : ''}`;
    }
    else if (level >= 40 && level < 50) {
      // Exponant
    }
    else if (level >= 50 && level < 60) {
      // Square root
    }

    result = result.toString();

    return { result, text };
  }

  decomposeNumber(n) {
    if (n < 2) {
      return [n];
    }
    else {
      let f = new Set();

      for (let i = 2; i <= n; i++) {
        while (n % i === 0) {
          f.add(i);
          n /= i;
        }
      }
      return f.values();
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
      onStart: () => { this.playerShot.alpha = 1 },
      onComplete: () => { this.playerShotTween.play() },
      paused: true
    });

    this.playerShotTween = this.tweens.add({
      targets: this.playerShot,
      duration: 500,
      rotation: 10,
      x: this.enemy.x,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.playerShot.alpha = 0;
        this.enemyGetsHitTween.play();
      },
      paused: true
    });

    this.enemyGetsHitTween = this.tweens.add({
      targets: this.enemy,
      duration: 500,
      rotation: 10,
      scale: 0,
      ease: 'Power1',
      onComplete: () => { this.scene.resume('Game').stop('Battle') },
      paused: true
    });

    this.enemyAttacksTween = this.tweens.add({
      targets: this.enemy,
      duration: 500,
      repeat: 1,
      rotation: -0.5,
      ease: 'Sine.easeInOut',
      yoyo: true,
      onComplete: () => this.enemyShotTween.play(),
      paused: true
    });

    this.enemyShotTween = this.tweens.add({
      targets: this.enemyShot,
      duration: 500,
      rotation: 10,
      x: this.player.x,
      ease: 'Sine.easeInOut',
      onStart: () => this.enemyShot.alpha = 1,
      onComplete: () => {
        this.enemyShot.alpha = 0;
        (this.remainingTries) ? this.playerGetsHitTween.play() : this.playerDiesTween.play();
      },
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
      onComplete: () => this.gameOverTween.play(),
      paused: true,
    });

    this.gameOverTween = this.tweens.add({
      targets: this.gameOverText,
      duration: 1000,
      alpha: 1,
      scale: 1,
      ease: 'Sine.easeInOut',
      paused: true,
      onComplete: () => {
        let delay = new Promise((res, rej) => setTimeout(res, 2000));
        delay.then(() => {
          localStorage.clear();
          this.game.globals.level = 0;
          this.scene.stop('Game').stop('Battle').start('Title');
        });
      }
    });
  }
}