import CanvasManager from './classes/CanvasManager';

let can = new CanvasManager();
can.canvases.get('ui')[0].setAttribute('height', 100);

can.canvases.get('ui')[0].addEventListener('click', e => {
  if(can.state === 'game') {
    let size = (e.target.getAttribute('height') < can.size)? can.size : 100;
    e.target.setAttribute('height', size);
  }
});
