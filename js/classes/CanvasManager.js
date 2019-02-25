//Loads and manage canvases
export default  class CanvasManager {
  constructor() {
    this.state = 'start';
    this.ratio = 1;
    this.canvases = new Map();

    let canList = document.getElementsByTagName('canvas');

    for(let canvas of canList) {
      this.canvases.set(canvas.id, [canvas, canvas.getContext('2d')]);
    }

    this.setSize();
  }
  setSize() {
    this.size = Math.min(window.innerWidth, window.innerHeight);
    this.ratio = this.size/720; //720 = default canvas size

    let container = document.getElementById('container');

    container.setAttribute('style', `width: ${this.size}px; height: ${this.size}px;`);

    this.canvases.forEach(data => {
      data[0].setAttribute('width',this.size);
      data[0].setAttribute('height',this.size);
    });
  }
  checkClickTriangle(p, a, b, c) {
    let vect0 = [c[0]-a[0], c[1]-a[1]];
    let vect1 = [b[0]-a[0], b[1]-a[1]];
    let vect2 = [p[0]-a[0], p[1]-a[1]];

    let dot00 = (vect0[0]*vect0[0]) + (vect0[1]*vect0[1]);
    let dot01 = (vect0[0]*vect1[0]) + (vect0[1]*vect1[1]);
    let dot02 = (vect0[0]*vect2[0]) + (vect0[1]*vect2[1]);
    let dot11 = (vect1[0]*vect1[0]) + (vect1[1]*vect1[1]);
    let dot12 = (vect1[0]*vect2[0]) + (vect1[1]*vect2[1]);

    let invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

    let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return ((u >= 0) && (v >= 0) && (u + v < 1));
  }
};