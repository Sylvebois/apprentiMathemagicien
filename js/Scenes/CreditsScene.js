import * as PHASER from '../phaser.min.js';
import config from '../Config/config.js';

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create() {
    // Background
    this.add.image(config.width / 2, config.height / 2, 'bgScroll');

    //Credits
    this.creditsText = this.add.text(0, 0, 'Credits', { fontSize: '32px', fill: '#fff' });
    this.madeByText = this.add.text(0, 0, 'Created By: Sylvebois', { fontSize: '26px', fill: '#fff' });
    this.otherThanksText = this.add.text(0, 0, 'Graphics and Sounds: Open Game Art\r\nEngine: Phaser 3', { fontSize: '26px', fill: '#fff' });

    this.madeByText.alpha = 0;
    this.otherThanksText.alpha = 0;

    this.zone = this.add.zone(config.width / 2, config.height / 2, config.width, config.height);

    Phaser.Display.Align.In.Center(this.creditsText, this.zone);
    Phaser.Display.Align.In.Center(this.madeByText, this.zone);
    Phaser.Display.Align.In.Center(this.otherThanksText, this.zone);

    this.creditsTween = this.tweens.add({
      targets: this.creditsText,
      y: 10,
      alpha: 0,
      ease: 'Power1',
      duration: 3000,
      delay: 1000,
      onComplete: function () {
        this.destroy;
        this.madeByText.alpha = 1;
        this.madeByTween.play();
      }.bind(this)
    });

    this.madeByTween = this.tweens.add({
      targets: this.madeByText,
      y: 10,
      alpha: 0,
      duration: 3000,
      delay: 500,
      paused: true,
      onComplete: function () {
        this.destroy;
        this.otherThanksText.alpha = 1;
        this.otherThanksTween.play();
      }.bind(this)
    });

    this.otherThanksTween = this.tweens.add({
      targets: this.otherThanksText,
      y: 10,
      alpha: 0,
      duration: 3000,
      delay: 500,
      paused: true,
      onComplete: function () {
        this.otherThanksTween.destroy;
        this.scene.start('Title');
      }.bind(this)
    });
  }
};