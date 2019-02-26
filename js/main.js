import CanvasManager from './classes/CanvasManager.js';
import View from './classes/View.js';

const TILESIZE = 32;
let can = new CanvasManager();
let view = new View(can.canvases, can.ratio);

can.canvases.get('ui')[0].onclick = e => {
  if (can.state === 'start') {
    let beginMenuPos = view.menuTextPos.get('Commencer');
    let continueMenuPos = view.menuTextPos.get('Continuer');
    let creditMenuPos = view.menuTextPos.get('Crédits');

    if (e.clientX >= beginMenuPos[0] && e.clientX <= beginMenuPos[1] && e.clientY >= beginMenuPos[2] && e.clientY <= beginMenuPos[3]) {
      can.state = 'story';
    }
    else if (continueMenuPos && e.clientX >= continueMenuPos[0] && e.clientX <= continueMenuPos[1] && e.clientY >= continueMenuPos[2] && e.clientY <= continueMenuPos[3]) {
      can.state = 'load';
    }
    else if (e.clientX >= creditMenuPos[0] && e.clientX <= creditMenuPos[1] && e.clientY >= creditMenuPos[2] && e.clientY <= creditMenuPos[3]) {
      can.state = 'credits';
    }
  }
  else if (can.state === 'credits') {
    can.state = 'start';
    view.drawHomeScreen();
  }
  else if (can.state === 'story') {
    can.state = 'game';
  }
  else if (can.state === 'game') {
    let size = (e.target.getAttribute('height') < can.size)? can.size : TILESIZE * can.ratio;
    e.target.setAttribute('height', size);
  }
};

window.onresize = e => {
  let uiSize = can.canvases.get('ui')[0].getAttribute('height');
  can.setSize();

  if (can.state === 'start') {
    view.ratio = can.ratio;
    view.drawHomeScreen();
  }
  else if (can.state === 'game') {
    can.canvases.get('ui')[0].setAttribute('height', uiSize);
  }
};
