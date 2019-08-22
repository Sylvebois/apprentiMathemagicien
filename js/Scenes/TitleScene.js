import * as PHASER from '../phaser.min.js';
import config from '../Config/config.js';
import Button from '../Objects/Button.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    // Background
    this.add.image(config.width / 2, config.height / 2, 'bgScroll');

    // Title
    let title = this.add.text(0, 0, 'L\'apprenti mathémagicien', { fontSize: '40px' });
    title.setPosition(config.width / 2 - title.width / 2, title.height * 3);

    let titleUnderline = this.add.text(0, 0, '/+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*+-*/', { fontsize: '40px', fill: '#000' });
    titleUnderline.setOrigin(0.5, 0);
    titleUnderline.setPosition(config.width / 2, title.y + title.height + 5);

    // Game
    this.gameButton = new Button(this, config.width / 2, config.height / 2 - 100, 'titleButton', 'Commencer', 'Game');

    // Options
    this.optionsButton = new Button(this, config.width / 2, config.height / 2, 'titleButton', 'Options', 'Options');

    // Credits
    this.creditsButton = new Button(this, config.width / 2, config.height / 2 + 100, 'titleButton', 'Crédits', 'Credits');

    /*
      this.model = this.sys.game.globals.model;
      if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
        this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
        this.bgMusic.play();
        this.model.bgMusicPlaying = true;
        this.sys.game.globals.bgMusic = this.bgMusic;
      }
    */
  }
};
