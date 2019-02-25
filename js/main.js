import CanvasManager from './classes/CanvasManager.js';

let can = new CanvasManager();
can.canvases.get('ui')[0].setAttribute('height', 100);

can.canvases.get('ui')[0].onclick = e => {
  if(can.state === 'game') {
    let size = (e.target.getAttribute('height') < can.size)? can.size : 100;
    e.target.setAttribute('height', size);
  }
};

window.onresize = e => {
  let uiSize = can.canvases.get('ui')[0].getAttribute('height');
  can.setSize();
  can.canvases.get('ui')[0].setAttribute('height', uiSize);
};
