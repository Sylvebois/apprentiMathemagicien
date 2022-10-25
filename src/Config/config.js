export default {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  backgroundColor: 0x3f3f3f,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
