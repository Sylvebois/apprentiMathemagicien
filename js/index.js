import * as PHASER from './phaser.min.js';
import config from './Config/config.js';
import BootScene from './Scenes/BootScene.js';
import PreloaderScene from './Scenes/PreloaderScene.js';
import TitleScene from './Scenes/TitleScene.js';
import OptionsScene from './Scenes/OptionsScene.js';
import CreditsScene from './Scenes/CreditsScene.js';
import GameScene from './Scenes/GameScene.js';
import Model from './Model.js';

/* template from : https://phasertutorials.com/creating-a-phaser-3-template-part-1/ */


/*
import CanvasManager from './classes/CanvasManager.js';
import GameManager from './classes/GameManager.js';
import View from './classes/View.js';
import * as GameText from './text.js';

const TILESIZE = 32;
const NBTILESPERLINE = 20;

let touchscreen = false;

let can = new CanvasManager(TILESIZE, NBTILESPERLINE);
let view = new View(can.canvases, can.ratio, TILESIZE);
let game = new GameManager(NBTILESPERLINE);

let playerName = '';
let level = 0;
let currentDungeon;
let equation = null;
let fightAnswer = null;

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
    let answer = null;

    switch(e.which) {
      case 37: //left
        answer = [game.hero.x - 1, game.hero.y];
        break;
      case 38: //up
        answer = [game.hero.x, game.hero.y - 1];
        break;
      case 39: //right
        answer = [game.hero.x + 1, game.hero.y];
        break;
      case 40: //down
        answer = [game.hero.x, game.hero.y + 1];
        break;
    }

    if(answer) {
      game.checkAccess(answer[0], answer[1], currentDungeon)
      .then(() => {
        game.moveHero(answer[0], answer[1], currentDungeon);
        view.drawGame(currentDungeon);
      })
      .catch(reason => {
        if(reason === 'Monster') {
          can.state = 'fight';
          equation = game.generateEquation(currentDungeon[answer[0]][answer[1]].frontPart);
          view.drawFight(fightAnswer, equation, game.hero, currentDungeon[equation.fightX][equation.fightY].frontPart);
        }
      });
    }
  }
  else if (can.state === 'fight') {
    let answer = null;

    switch(e.which) {
      case 48:
      case 96:
        answer = 0;
        break;
      case 49:
      case 97:
        answer = 1;
        break;
      case 50:
      case 98:
        answer = 2;
        break;
      case 51:
      case 99:
        answer = 3;
        break;
      case 52:
      case 100:
        answer = 4;
        break;
      case 53:
      case 101:
        answer = 5;
        break;
      case 54:
      case 102:
        answer = 6;
        break;
      case 55:
      case 103:
        answer = 7;
        break;
      case 56:
      case 104:
        answer = 8;
        break;
      case 57:
      case 105:
        answer = 9;
        break;
    }

    if(typeof(answer) === 'number') {
      fightAnswer = (fightAnswer === null)? answer : fightAnswer + '' + answer;
      view.drawFight(fightAnswer, equation, game.hero, currentDungeon[equation.fightX][equation.fightY].frontPart);
    }
    else if(e.which === 8 && fightAnswer !== null) {
      fightAnswer = fightAnswer.slice(0,-1);
      view.drawFight(fightAnswer, equation, game.hero, currentDungeon[equation.fightX][equation.fightY].frontPart);
    }
    else if(e.which === 13) {
      game.hero.fight(fightAnswer, equation.solution)
      .then(ok => {
        if (currentDungeon[equation.fightX][equation.fightY].frontPart.live - 1 === 0) {
          can.state = 'game';
          currentDungeon[equation.fightX][equation.fightY].frontPart = null;
          equation = null;
          fightAnswer = null;
          view.drawGame(currentDungeon);
        }
        else {
          currentDungeon[equation.fightX][equation.fightY].frontPart.live--;
          equation = game.generateEquation(currentDungeon[equation.fightX][equation.fightY].frontPart);
          fightAnswer = null;
          view.drawFight(fightAnswer, equation, game.hero, currentDungeon[equation.fightX][equation.fightY].frontPart);
        }
      })
      .catch(nok => {
        fightAnswer = null;

        if(game.hero.live !== 0) {
          view.drawFight(fightAnswer, equation, game.hero, currentDungeon[equation.fightX][equation.fightY].frontPart);
        }
        else {
          can.state = 'game over';
          view.drawLoosing();
          resetValues();
        }
      });
    }
  }

  return false;
}

document.ontouchstart = e => {
  touchscreen = true;
}

window.onresize = e => {
  let uiSize = can.canvases.get('ui')[0].getAttribute('height');
  can.setSize();
  view.updateValues(can.ratio);

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
    view.drawGame(currentDungeon);
  });
}

function resetValues() {
  playerName = '';
  level = 0;
  currentDungeon = null;
  equation = null;
  fightAnswer = null;
}
*/