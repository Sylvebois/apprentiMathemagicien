import * as PHASER from './phaser.min.js';
import config from './Config/config.js';
import BootScene from './Scenes/BootScene.js';
import PreloaderScene from './Scenes/PreloaderScene.js';
import TitleScene from './Scenes/TitleScene.js';
import OptionsScene from './Scenes/OptionsScene.js';
import CreditsScene from './Scenes/CreditsScene.js';
import StoryScene from './Scenes/StoryScene.js';
import GameScene from './Scenes/GameScene.js';
import BattleScene from './Scenes/BattleScene.js';
import Model from './Model.js';

/* template from : https://phasertutorials.com/creating-a-phaser-3-template-part-1/ */

class Game extends Phaser.Game {
  constructor() {
    super(config);
    const model = new Model();
    this.globals = {
      model,
      bgMusic: null,
      tilesize: 32,
      level: localStorage.getItem('level') | 0
    };
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Credits', CreditsScene);
    this.scene.add('Story', StoryScene);
    this.scene.add('Game', GameScene);
    this.scene.add('Battle', BattleScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();
window.focus();

resize();
window.addEventListener("resize", resize, false);

function resize() {
  let canvas = document.querySelector("canvas");
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let windowRatio = windowWidth / windowHeight;
  let gameRatio = config.width / config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  }
  else {
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}