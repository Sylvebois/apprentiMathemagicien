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
  drawStoryScreen() {
    this.clearCanvases();
    this.drawInterfaceBox();

    let story = 'Il était une fois dans une contrée lointaine, très lointaine, un royaume gouverné par un bon roi qui savait calculer. Mais un jour, un méchant sorcier entrepris de semer le chaos dans le royaume. Après de si nombreuses années de paix, le roi fit appel à son vieux mathémagicien. Trop vieux pour régler ce genre de chose, l\'homme se choisit un apprenti pour l\'aider ...';
    let fontSize = 20 * this.ratio;
    let storyList = this.splitText(story, fontSize, 10);
    let align = 'left';

    this.animateTextBottomToTop(storyList, fontSize, align);
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
  drawGame(dungeon, tilesize = 32) {
    this.clearCanvases();
console.log(dungeon);
    dungeon.map(lines => {
      lines.map(tile => {
        console.log(tile.backPart.img);
        this.canMap.get('back')[1].drawImage(
          tile.backPart.img,
          tile.backPart.imgX, tile.backPart.imgY,
          tilesize, tilesize,
          tile.backPart.x, tile.backPart.y,
          tilesize, tilesize
        );

        if(tile.frontPart) {
          this.canMap.get('front')[1].drawImage(
            tile.frontPart.img,
            tile.frontPart.imgX, tile.frontPart.imgY,
            tilesize, tilesize,
            tile.frontPart.x, tile.frontPart.y,
            tilesize, tilesize
          );

          if(tile.frontPart instanceof Hero) {
            let middle = this.canMap.get('ui')[0].getAttribute('width')/2;

            this.canMap.get('ui')[1].fillStyle = '#000000';
            this.canMap.get('ui')[1].fillRect(0, 0, this.canMap.get('ui')[0].getAttribute('width'), this.canMap.get('ui')[0].getAttribute('height'));

            this.canMap.get('ui')[1].fillStyle = '#FFFFFF';
            this.canMap.get('ui')[1].fillText(tile.frontPart.live, middle, tilesize);
          }
        }
      });
    });
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

      bottom -= 0.75;

      if(parseInt(fontPosY) > 0) {
        requestAnimationFrame(draw);
      }
    }

    requestAnimationFrame(draw);
  }
  splitText(text, border) {
    let result = [];

    let textLength = this.canMap.get('ui')[1].measureText(text).width;
    let canWidth = parseInt(this.canMap.get('ui')[0].getAttribute('width'));

    if(textLength > canWidth) {
      let tmpText = '';

      while (text.length > 0) {
        tmpText += text.substring(0, 1);
        let tmpTextLength = this.canMap.get('ui')[1].measureText(tmpText).width;
        text = text.substring(1);

        if(tmpTextLength > 2 * canWidth || text.length === 0) {
          //If we are in the middle of a word, go back to the beginning of it
          if(text.length !== 0 && !tmpText.endsWith(' ') && !text.startsWith(' ')) {
            while (!tmpText.endsWith(' ')) {
              text = tmpText.slice(-1) + text;
              tmpText = tmpText.slice(0, -1);
            }
          }

          result.push(tmpText);
          tmpText = '';
        }
      }
    }
    else {
      result.push(text);
    }

    return result;
  }
}