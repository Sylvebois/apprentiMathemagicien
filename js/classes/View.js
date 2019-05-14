export default class View {
  constructor(canvasesMap, ratio, tilesize = 32) {
    this.tilesize = tilesize;
    this.ratio = ratio;
    this.tileDrawSize = Math.ceil(this.tilesize * this.ratio);
    this.canMap = canvasesMap;
    this.keyboard = document.getElementsByClassName('simple-keyboard')[0];
    this.images = {};

    this.loadImages();
    this.drawHomeScreen();
  }
  loadImages() {
    let imgList = ['crossRoad.png', 'heart.png', 'hero.png', 'mathemagician.png'];

    imgList.map(name => {
      let paramName = name.split('.')[0];
      let url = 'images/' + name;

      this.images[paramName] = new Image();
      this.images[paramName].src = url;
    });
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
    let titleFontSize = 45 * this.ratio;
    let fontSize = 35 * this.ratio;
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
    let fontSize = 35 * this.ratio;
    let fontPosY = fontSize * 3;
    let middle = this.canMap.get('ui')[0].getAttribute('width')/2;

    this.canMap.get('ui')[1].font = `${fontSize}px Arial`;
    this.canMap.get('ui')[1].textAlign = 'center';
    this.canMap.get('ui')[1].fillStyle = '#FFFFFF';

    //Draw text and name
    this.canMap.get('ui')[1].fillText(text, middle, fontPosY);
    this.canMap.get('ui')[1].fillText(name, middle, fontPosY + fontSize * 3);
  }
  drawStoryScreen(text = '') {
    this.clearCanvases();
    this.drawInterfaceBox();

    let fontSize = 20 * this.ratio;
    let storyList = this.splitText(text, fontSize, 10);
    let align = 'left';

    return this.animateTextBottomToTop(storyList, fontSize, align)
  }
  drawCreditsScreen(credits = '') {
    this.clearCanvases();
    this.drawInterfaceBox();

    let fontSize = 30 * this.ratio;
    let creditsList = this.splitText(credits, fontSize, 10);

    return this.animateTextBottomToTop(creditsList, fontSize);
  }
  drawLoosing() {

  }
  drawGame(dungeon) {
    this.clearCanvases();

    this.canMap.get('ui')[1].fillStyle = '#000000';
    this.canMap.get('ui')[1].fillRect(0, 0, this.canMap.get('ui')[0].getAttribute('width'), this.canMap.get('ui')[0].getAttribute('height'));

    dungeon.map(lines => {
      lines.map(tile => {
        this.canMap.get('back')[1].drawImage(
          this.images[tile.backPart.img],
          tile.backPart.imgX * this.tilesize, tile.backPart.imgY * this.tilesize,
          this.tilesize, this.tilesize,
          tile.backPart.x * this.tileDrawSize, tile.backPart.y * this.tileDrawSize,
          this.tileDrawSize, this.tileDrawSize
        );

        if(tile.frontPart) {
          this.canMap.get('front')[1].drawImage(
            this.images[tile.frontPart.img],
            tile.frontPart.imgX * this.tilesize, tile.frontPart.imgY * this.tilesize,
            this.tilesize, this.tilesize,
            tile.frontPart.x * this.tileDrawSize, tile.frontPart.y * this.tileDrawSize,
            this.tileDrawSize, this.tileDrawSize
          );

          if(tile.frontPart.isHero) {
            let middle = this.canMap.get('ui')[0].getAttribute('width')/2;
            this.canMap.get('ui')[1].fillStyle = '#FFFFFF';
            this.canMap.get('ui')[1].font = `${this.tileDrawSize}px Arial`;
            this.canMap.get('ui')[1].fillText(tile.frontPart.name, 0, this.tileDrawSize - 3);
            this.canMap.get('ui')[1].fillText(tile.frontPart.live, middle, this.tileDrawSize - 3);

            let liveSize = this.canMap.get('ui')[1].measureText(tile.frontPart.live).width;
            this.canMap.get('ui')[1].drawImage(this.images['heart'], middle + liveSize, 0, this.tileDrawSize, this.tileDrawSize);
          }
        }
      });
    });
  }
  drawFight(userAnswer, equation, hero, enemy) {
    this.clearCanvases();
    this.drawInterfaceBox();

    let width = this.canMap.get('front')[0].getAttribute('width');
    let height = this.canMap.get('front')[0].getAttribute('height');
    let middle = width / 2;

    this.canMap.get('front')[1].fillStyle = '#FFFFFF';
    this.canMap.get('front')[1].font = `${this.tileDrawSize}px Arial`;

    let middleEq = middle - this.canMap.get('front')[1].measureText(equation.problem).width / 2;
    this.canMap.get('front')[1].fillText(equation.problem, middleEq, this.tileDrawSize * 2);

    if(userAnswer !== null) {
      this.canMap.get('front')[1].fillStyle = '#FF0000';
      this.canMap.get('front')[1].font = `${this.tileDrawSize * 2}px Arial`;

      let middleAn = middle - this.canMap.get('front')[1].measureText(userAnswer).width / 2;
      this.canMap.get('front')[1].fillText(userAnswer, middleAn, this.tileDrawSize * 8);
    }

    this.canMap.get('front')[1].drawImage(
      this.images[hero.img],
      hero.imgX * this.tilesize, hero.imgY * this.tilesize,
      this.tilesize, this.tilesize,
      this.tileDrawSize, height - (this.tileDrawSize * 3),
      this.tileDrawSize * 2, this.tileDrawSize * 2
    );

    this.canMap.get('front')[1].drawImage(
      this.images[enemy.img],
      enemy.imgX * this.tilesize, enemy.imgY * this.tilesize,
      this.tilesize, this.tilesize,
      width - (this.tileDrawSize * 3), height - (this.tileDrawSize * 3),
      this.tileDrawSize * 2, this.tileDrawSize * 2
    );
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
    let bottom = parseInt(ui[0].getAttribute('height'));
    let canHeight = bottom;
    let canWidth = parseInt(ui[0].getAttribute('width'));

    ui[1].font = `${fontSize}px Arial`;
    ui[1].textAlign = align;
    ui[1].fillStyle = '#FFFFFF';

    function drawingStep(posY, resolve) {
      return function() {
        ui[1].clearRect(0, 0, canWidth, canHeight);

        let fontPosX = (align === 'center')? canWidth/2 : 10;
        let fontPosY = bottom;

        //Draw text
        textList.forEach(text => {
          ui[1].fillText(text, fontPosX, fontPosY);
          fontPosY += fontSize * (text.startsWith('http') ? 2.5 : 1.5);
        });

        bottom -= 0.75;

        if(parseInt(fontPosY) > 0) {
          requestAnimationFrame(drawingStep(posY, resolve));
        }
        else {
          resolve();
        }
      }
    }

    return new Promise(resolve => requestAnimationFrame(drawingStep(bottom, resolve)));
  }
  splitText(text, fontsize, border) {
    let result = [];

    let textLength = this.canMap.get('ui')[1].measureText(text).width;
    let canWidth = parseInt(this.canMap.get('ui')[0].getAttribute('width'));

    if(textLength > canWidth) {
      let tmpText = '';

      while (text.length > 0) {
        let char = text.substring(0, 1);

        tmpText += char;
        text = text.substring(1);

        let tmpTextLength = this.canMap.get('ui')[1].measureText(tmpText).width;

        if(char === '\n') {
          result.push(tmpText);
          tmpText = '';
        }
        else if(tmpTextLength > 1.5 * canWidth || text.length === 0) {
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
  updateValues(ratio) {
    this.ratio = ratio;
    this.tileDrawSize = this.tilesize * this.ratio;
  }
}