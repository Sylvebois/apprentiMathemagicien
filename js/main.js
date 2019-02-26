import CanvasManager from './classes/CanvasManager.js';
import View from './classes/View.js';

let can = new CanvasManager();
let view = new View(can.canvases, can.ratio);

can.canvases.get('ui')[0].onclick = e => {
  if (can.state === 'start') {

  }
  else if (can.state === 'game') {
    let size = (e.target.getAttribute('height') < can.size)? can.size : 100;
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
