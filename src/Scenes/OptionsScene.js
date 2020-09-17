import PHASER from 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

import { interfaceText } from '../text.js';

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('Options');
  }

  create() {
    this.model = this.game.globals.model;
    this.language = this.game.globals.language;

    // Background
    this.add.image(config.width / 2, config.height / 2, 'bgScroll');

    // Title
    let title = this.add.text(0, 0, interfaceText.buttons.fr[2], { fontSize: '40px' });
    title.setPosition(config.width / 2 - title.width / 2, title.height * 3);

    // Music
    this.musicButton = this.add.image(200, 200, 'checkedBox').setInteractive();
    this.musicText = this.add.text(this.musicButton.x + this.musicButton.width + 20, this.musicButton.y - 10, interfaceText.buttons[this.language][4], { fontSize: '24px' });

    // Sound
    this.soundButton = this.add.image(200, 275, 'checkedBox').setInteractive();
    this.soundText = this.add.text(this.soundButton.x + this.soundButton.width + 20, this.soundButton.y - 10, interfaceText.buttons[this.language][5], { fontSize: '24px' });

    // Language selection
    let frText = this.add.text(0, 0, 'FRA', { fontSize: '24px' });
    frText.setPosition(config.width / 2 - frText.width - 5, 350);

    let enText = this.add.text(0, 0, 'ENG', { fontSize: '24px' });
    enText.setPosition(config.width / 2 + enText.width + 5, 350);

    let languageText = this.add.text(150, 400, interfaceText.buttons[this.language][6], { fontSize: '24px' });

    this.frButton = this.add.image(frText.x + frText.width / 2, languageText.y + 10, (this.game.globals.language === 'fr') ? 'checkedBox' : 'box').setInteractive();
    this.enButton = this.add.image(enText.x + enText.width / 2, languageText.y + 10, (this.game.globals.language === 'en') ? 'checkedBox' : 'box').setInteractive();

    // Back button
    this.menuButton = new Button(this, config.width / 2, config.height - 100, 'titleButton', interfaceText.buttons[this.language][7], 'Title');

    // Interactivity
    this.musicButton.on('pointerdown', () => {
      this.model.musicOn = !this.model.musicOn;
      this.updateAudio();
    });

    this.soundButton.on('pointerdown', () => {
      this.model.soundOn = !this.model.soundOn;
      this.updateAudio();
    });

    this.frButton.on('pointerdown', () => {
      if (this.game.globals.language !== 'fr') {
        this.game.globals.language = 'fr';
        this.frButton.setTexture('checkedBox');
        this.enButton.setTexture('box');
        this.scene.restart();
      }
    });

    this.enButton.on('pointerdown', () => {
      if (this.game.globals.language !== 'en') {
        this.game.globals.language = 'en';
        this.enButton.setTexture('checkedBox');
        this.frButton.setTexture('box');
        this.scene.restart();
      }
    });

    this.updateAudio();
  }

  updateAudio() {
    if (this.model.musicOn === false) {
      this.musicButton.setTexture('box');
      this.sys.game.globals.bgMusic.stop();
      this.model.bgMusicPlaying = false;
    }
    else {
      this.musicButton.setTexture('checkedBox');
      if (this.model.bgMusicPlaying === false) {
        this.sys.game.globals.bgMusic.play();
        this.model.bgMusicPlaying = true;
      }
    }

    if (this.model.soundOn === false) {
      this.soundButton.setTexture('box');
    }
    else {
      this.soundButton.setTexture('checkedBox');
    }
  }
};
