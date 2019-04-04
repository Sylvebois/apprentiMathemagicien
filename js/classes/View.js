export default class View {
  constructor(canvasesMap, ratio) {
    this.ratio = ratio;
    this.canMap = canvasesMap;
    this.keyboard = document.getElementsByClassName('simple-keyboard')[0];
    this.drawHomeScreen();
  }
  clearCanvases() {
    this.canMap.forEach(canvas => canvas[1].clearRect(0, 0, canvas[0].getAttribute('width'), canvas[0].getAttribute('height')));
  }
  drawHomeScreen() {
    this.clearCanvases();
    this.drawInterfaceBox();

    //Text
    let title = 'L\'apprenti mathémagicien';
    let menus = (localStorage.getItem('hero'))? ['Commencer', 'Continuer', 'Crédits'] : ['Commencer', 'Crédits'];

    //Size and position
    let titleFontSize = 50 * this.ratio;
    let fontSize = 40 * this.ratio;
    let fontPosY = titleFontSize * 1.5;
    let middle = this.canMap.get('ui')[0].getAttribute('width')/2;
    this.menuTextPos = new Map();

    this.canMap.get('ui')[1].textAlign = 'center';
    this.canMap.get('ui')[1].fillStyle = '#FFFFFF';

    //Draw Title
    this.canMap.get('ui')[1].font = `${titleFontSize}px Arial`;
    this.canMap.get('ui')[1].fillText(title, middle, fontPosY);
    fontPosY += titleFontSize * 4;

    //Draw Menus
    this.canMap.get('ui')[1].font = `${fontSize}px Arial`;

    menus.forEach(text => {
      this.menuTextPos.set(text, [
        middle - this.canMap.get('ui')[1].measureText(text).width/2,  //startX
        middle + this.canMap.get('ui')[1].measureText(text).width/2,  //endX
        fontPosY - fontSize,                                          //startY
        fontPosY                                                      //endY
      ]);

      this.canMap.get('ui')[1].fillText(text, middle, fontPosY);
      fontPosY += fontSize * 3;
    });
  }
  drawNewGameScreen(name = '', touchscreen = false) {
    this.clearCanvases();
    this.drawInterfaceBox();

    //Display keyboard
    if(touchscreen) {
      this.keyboard.style.display = 'inline-block';
    }

    //Text
    let text = 'Quel est ton nom jeune apprenti ?';

    //Size and position
    let fontSize = 40 * this.ratio;
    let fontPosY = fontSize * 3;
    let middle = this.canMap.get('ui')[0].getAttribute('width')/2;

    this.canMap.get('ui')[1].font = `${fontSize}px Arial`;
    this.canMap.get('ui')[1].textAlign = 'center';
    this.canMap.get('ui')[1].fillStyle = '#FFFFFF';

    //Draw text and name
    this.canMap.get('ui')[1].fillText(text, middle, fontPosY);
    this.canMap.get('ui')[1].fillText(name, middle, fontPosY + fontSize * 3);
  }
  drawCreditsScreen() {
    this.clearCanvases();
    this.drawInterfaceBox();

    let credits = [
      'Auteur :',
      'Sylvebois',
      ' ',
      'Remerciements :',
      'Open Game Art',
      'http://opengameart.org',
      'Dungeon Crawl Stone Soup',
      'http://crawl.develz.org',
      'Francisco Hodge (virtual keyboard)',
      'https://franciscohodge.com'
    ];
    let fontSize = 40 * this.ratio;

    this.animateTextBottomToTop(credits, fontSize);
  }
  drawInterfaceBox() {
    this.canMap.get('back')[1].clearRect(0, 0, this.canMap.get('back')[0].getAttribute('width'), this.canMap.get('back')[0].getAttribute('height'));

    this.canMap.get('back')[1].fillStyle = '#1B52EF';
    this.canMap.get('back')[1].fillRect(0, 0, this.canMap.get('back')[0].getAttribute('width'), this.canMap.get('back')[0].getAttribute('height'));

    this.canMap.get('back')[1].beginPath();
    this.canMap.get('back')[1].lineWidth = '12';
    this.canMap.get('back')[1].strokeStyle = '#C0C0C0';
    this.canMap.get('back')[1].rect(0, 0, this.canMap.get('back')[0].getAttribute('width'), this.canMap.get('back')[0].getAttribute('height'));
    this.canMap.get('back')[1].stroke();
  }
  animateTextBottomToTop(textList, fontSize, align = 'center') {
    let ui = this.canMap.get('ui');
    let bottom = ui[0].getAttribute('height');

    function draw() {
      ui[1].clearRect(0, 0, ui[0].getAttribute('width'), ui[0].getAttribute('height'));

      let fontPosX = (align === 'center')? ui[0].getAttribute('width')/2 : 10;
      let fontPosY = bottom;

      ui[1].font = `${fontSize}px Arial`;
      ui[1].textAlign = align;
      ui[1].fillStyle = '#FFFFFF';

      //Draw text
      textList.forEach(text => {
        ui[1].fillText(text, fontPosX, fontPosY);
        fontPosY += fontSize * (text.startsWith('http') ? 2 : 1.5);
      });

      bottom--;

      if(parseInt(fontPosY) > 0) {
        requestAnimationFrame(draw);
      }
    }

    requestAnimationFrame(draw);
  }
}