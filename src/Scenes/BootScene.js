import * as PHASER from '../phaser.min.js';

export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  preload () {
    this.load.image('logo', 'src/assets/logo.png');
  }

  create () {
    this.scene.start('Preloader');
  }
};