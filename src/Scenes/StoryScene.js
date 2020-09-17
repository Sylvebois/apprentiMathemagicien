import PHASER from 'phaser';
import config from '../Config/config';

import { story } from '../text.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Story');
  }

  create() {
    this.language = this.game.globals.language;

    // Background
    this.add.image(config.width / 2, config.height / 2, 'bgScroll');

    this.level = Math.floor(this.game.globals.level / 10);

    if (this.level === 0) {
      this.introText = this.add.text(120, 100, story.intro[this.language], { fontSize: '20px', fill: '#fff' });

      this.introTween = this.tweens.add({
        targets: this.introText,
        alpha: 0,
        ease: 'Power1',
        duration: 750,
        paused: true,
        onComplete: () => {
          this.destroy;
          this.chapterTween.play();
        }
      });
    }

    this.chapterText = this.add.text(120, 100, story[`chapter${this.level + 1}`][this.language], { fontSize: '20px', fill: '#fff' });
    this.chapterText.alpha = 0;

    this.chapterTween = this.tweens.add({
      targets: this.chapterText,
      alpha: 1,
      ease: 'Power1',
      duration: 750,
      paused: (this.level === 0) ? true : false,
      onComplete: () => { this.destroy }
    });

    this.input.on('pointerdown', () => {
      if (this.level === 0 && this.introText.alpha === 1) {
        this.introTween.play();
      }
      else {
        this.scene.start('Game');
      }
    });
  }
}
