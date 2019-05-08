import CanvasManager from './classes/CanvasManager.js';
import GameManager from './classes/GameManager.js';
import View from './classes/View.js';
import * as Keyboard from './classes/SimpleKeyboard.js';
import * as GameText from './text.js';

const TILESIZE = 32;
const NBTILESPERLINE = 20;

let touchscreen = false;
let playerName = '';
let level = 0;

let can = new CanvasManager(TILESIZE, NBTILESPERLINE);
let view = new View(can.canvases, can.ratio);
let game = new GameManager(NBTILESPERLINE);
let currentDungeon;

can.canvases.get('ui')[0].onclick = e => {
  if (can.state === 'start') {
    let beginMenuPos = view.menuTextPos.get('Commencer');
    let continueMenuPos = view.menuTextPos.get('Continuer');
    let creditMenuPos = view.menuTextPos.get('Crédits');

    if (e.clientX >= beginMenuPos[0] && e.clientX <= beginMenuPos[1] && e.clientY >= beginMenuPos[2] && e.clientY <= beginMenuPos[3]) {
      can.state = 'name';
      playerName = '';
      view.drawNewGameScreen('', touchscreen);
    }
    else if (continueMenuPos && e.clientX >= continueMenuPos[0] && e.clientX <= continueMenuPos[1] && e.clientY >= continueMenuPos[2] && e.clientY <= continueMenuPos[3]) {
      can.state = 'load';
    }
    else if (e.clientX >= creditMenuPos[0] && e.clientX <= creditMenuPos[1] && e.clientY >= creditMenuPos[2] && e.clientY <= creditMenuPos[3]) {
      can.state = 'credits';
      view.drawCreditsScreen(GameText.credits).then(finished => {
        can.state = 'start';
        view.drawHomeScreen();
      });
    }
  }
  else if(can.state === 'name') {
    startingGame(e);
  }
  else if (can.state === 'game') {
    let size = (e.target.getAttribute('height') < can.size)? can.size : TILESIZE * can.ratio;
    e.target.setAttribute('height', size);
  }
};

document.onkeydown = e => {
  e.preventDefault;

  if (can.state === 'name') {
    let regex = new RegExp(/\w/);

    if (e.key.length === 1 && regex.test(e.key) && playerName.length < 30) {
      playerName += e.key;
      view.drawNewGameScreen(playerName, touchscreen);
    }
    else if (e.keyCode === 8 && playerName.length > 0) { //backspace
      playerName = playerName.slice(0, -1);
      view.drawNewGameScreen(playerName, touchscreen);
    }
    else if (e.keyCode === 13) { //return
      startingGame(e);
    }
  }
  else if (can.state === 'game') {

  }

  return false;
}

document.ontouchstart = e => {
  touchscreen = true;
}

window.onresize = e => {
  let uiSize = can.canvases.get('ui')[0].getAttribute('height');
  can.setSize();
  view.ratio = can.ratio;

  if (can.state === 'start') {
    view.drawHomeScreen();
  }
  else if (can.state === 'name') {
    view.drawNewGameScreen(playerName, touchscreen);
  }
  else if (can.state === 'credits') {
    view.drawCreditsScreen();
  }
  else if (can.state === 'game') {
    can.canvases.get('ui')[0].setAttribute('height', uiSize);
  }
};

function startingGame(event) {
  can.state = 'story';
  game.hero.name = playerName;
  view.drawStoryScreen(GameText.story.chapter1).then(finished => {
    can.state = 'game';
    can.canvases.get('ui')[0].setAttribute('height', TILESIZE * can.ratio);
    currentDungeon = game.generateLevel(level);
    view.drawGame(currentDungeon, TILESIZE);
  });
}