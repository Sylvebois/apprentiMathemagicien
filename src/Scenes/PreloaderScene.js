import PHASER from 'phaser';

import '../assets/logo.png';
import '../assets/menu.mp3';

import '../assets/ui/blue_boxCheckmark.png';
import '../assets/ui/grey_box.png';
import '../assets/ui/scroll.png';

import '../assets/game/tileset.png';
import '../assets/game/forest.mp3';
import '../assets/game/desert.mp3';
import '../assets/game/city.mp3';
import '../assets/game/swamp.mp3';
import '../assets/game/battle.mp3';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // display progress bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    // add logo image
    let logo = this.add.image(0, 0, 'logo');
    logo.setPosition(width / 2, loadingText.y - logo.height);

    // update progress bar
    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', (file) => {
      assetText.setText('Loading asset: ' + file.key);
    });

    // remove progress bar when complete
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.ready();
    });

    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);

    // load assets needed in our game
    this.load.image('titleButton', require('../assets/ui/button_magic01.png'));
    this.load.image('box', require('../assets/ui/grey_box.png'));
    this.load.image('checkedBox', require('../assets/ui/blue_boxCheckmark.png'));
    this.load.image('bgScroll', require('../assets/ui/scroll.png'));
    this.load.spritesheet('tileset', require('../assets/game/tileset.png'), {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.audio('homeMusic', require('../assets/menu.mp3'));
    this.load.audio('forestMusic', require('../assets/game/forest.mp3'));
    this.load.audio('desertMusic', require('../assets/game/desert.mp3'));
    this.load.audio('cityMusic', require('../assets/game/city.mp3'));
    this.load.audio('swampMusic', require('../assets/game/swamp.mp3'));
    this.load.audio('battleMusic', require('../assets/game/battle.mp3'));
    this.load.audio('roar', require('../assets/game/creature_roar_02.ogg'));
  }

  ready() {
    this.scene.start('Title');
    this.readyCount++;
    if (this.readyCount === 2) {
      this.scene.start('Title');
    }
  }
};
