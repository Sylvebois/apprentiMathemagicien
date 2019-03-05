import CanvasManager from './classes/CanvasManager.js';
import View from './classes/View.js';

const TILESIZE = 32;
let can = new CanvasManager();
let view = new View(can.canvases, can.ratio);
let playerName = '';

can.canvases.get('ui')[0].onclick = e => {
  if (can.state === 'start') {
    let beginMenuPos = view.menuTextPos.get('Commencer');
    let continueMenuPos = view.menuTextPos.get('Continuer');
    let creditMenuPos = view.menuTextPos.get('Crédits');

    if (e.clientX >= beginMenuPos[0] && e.clientX <= beginMenuPos[1] && e.clientY >= beginMenuPos[2] && e.clientY <= beginMenuPos[3]) {
      can.state = 'name';
      playerName = '';
      view.drawNewGameScreen();
    }
    else if (continueMenuPos && e.clientX >= continueMenuPos[0] && e.clientX <= continueMenuPos[1] && e.clientY >= continueMenuPos[2] && e.clientY <= continueMenuPos[3]) {
      can.state = 'load';
    }
    else if (e.clientX >= creditMenuPos[0] && e.clientX <= creditMenuPos[1] && e.clientY >= creditMenuPos[2] && e.clientY <= creditMenuPos[3]) {
      can.state = 'credits';
      view.drawCreditsScreen();
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

document.onkeydown = e => {
  e.preventDefault;

  if (can.state === 'name') {
    let regex = new RegExp(/\w/);

    if (e.key.length === 1 && regex.test(e.key) && playerName.length < 30) {
      playerName += e.key;
      view.drawNewGameScreen(playerName);
    }
    else if (e.keyCode === 8 && playerName.length > 0) { //backspace
      playerName = playerName.slice(0, -1);
      view.drawNewGameScreen(playerName);
    }
    else if (e.keyCode === 13) { //return
      can.state = 'game';
    }
  }
  else if (can.state === 'game') {

  }
  return false;
}

window.onresize = e => {
  let uiSize = can.canvases.get('ui')[0].getAttribute('height');
  can.setSize();
  view.ratio = can.ratio;

  if (can.state === 'start') {
    view.drawHomeScreen();
  }
  else if (can.state === 'name') {
    view.drawNewGameScreen(playerName);
  }
  else if (can.state === 'credits') {
    view.drawCreditsScreen();
  }
  else if (can.state === 'game') {
    can.canvases.get('ui')[0].setAttribute('height', uiSize);
  }
};

let Keyboard = window.SimpleKeyboard.default;

let keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  mergeDisplay: true,
  layoutName: "default",
  layout: {
    default: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "{shift} z x c v b n m {backspace}",
      "{numbers} {space} {ent}"
    ],
    shift: [
      "Q W E R T Y U I O P",
      "A S D F G H J K L",
      "{shift} Z X C V B N M {backspace}",
      "{numbers} {space} {ent}"
    ],
    numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"]
  },
  display: {
    "{numbers}": "123",
    "{ent}": "return",
    "{escape}": "esc ⎋",
    "{tab}": "tab ⇥",
    "{backspace}": "⌫",
    "{capslock}": "caps lock ⇪",
    "{shift}": "⇧",
    "{controlleft}": "ctrl ⌃",
    "{controlright}": "ctrl ⌃",
    "{altleft}": "alt ⌥",
    "{altright}": "alt ⌥",
    "{metaleft}": "cmd ⌘",
    "{metaright}": "cmd ⌘",
    "{abc}": "ABC"
  }
});

function onChange(input) {
  console.log("Input changed", input);
}

function onKeyPress(button) {
  console.log("Button pressed", button);

  /**
   * If you want to handle the shift and caps lock buttons
   */
  if (button === "{shift}" || button === "{lock}") handleShift();
  if (button === "{numbers}" || button === "{abc}") handleNumbers();
}

function handleShift() {
  let currentLayout = keyboard.options.layoutName;
  let shiftToggle = currentLayout === "default" ? "shift" : "default";

  keyboard.setOptions({
    layoutName: shiftToggle
  });
}

function handleNumbers() {
  let currentLayout = keyboard.options.layoutName;
  let numbersToggle = currentLayout !== "numbers" ? "numbers" : "default";

  keyboard.setOptions({
    layoutName: numbersToggle
  });
}
