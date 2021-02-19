import PHASER from 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

import { interfaceText } from '../text.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    this.language = this.game.globals.language;

    // Background
    this.add.image(config.width / 2, config.height / 2, 'bgScroll');

    // Title
    let title = this.add.text(0, 0, 'L\'apprenti mathémagicien', { fontFamily: 'Arial, sans-serif', fontSize: '40px', fontStyle: 'bold' });
    title.setPosition(config.width / 2 - title.width / 2, title.height * 3);

    let titleUnderline = this.add.text(0, 0, '/+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*/', { fontsize: '40px', fill: '#000' });
    titleUnderline.setOrigin(0.5, 0);
    titleUnderline.setPosition(config.width / 2, title.y + title.height + 5);

    // Game
    if (localStorage.getItem('chapter')) {
      this.gameButton = new Button(this, config.width / 2, config.height / 2 - 100, 'titleButton', interfaceText.buttons[this.language][1], 'Game');
    }
    else {
      this.gameButton = new Button(this, config.width / 2, config.height / 2 - 100, 'titleButton', interfaceText.buttons[this.language][0], 'Story');
    }

    // Options
    this.optionsButton = new Button(this, config.width / 2, config.height / 2, 'titleButton', interfaceText.buttons[this.language][2], 'Options');

    // Credits
    this.creditsButton = new Button(this, config.width / 2, config.height / 2 + 100, 'titleButton', interfaceText.buttons[this.language][3], 'Credits');


    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('homeMusic', { volume: 0.1, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }

  }
};
