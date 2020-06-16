import * as PHASER from '../phaser.min.js';

export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, buttonImage, text, targetScene) {
    super(scene);
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.button = this.scene.add.sprite(0, 0, buttonImage).setInteractive();
    this.button.alpha = 0.5;
    this.text = this.scene.add.text(0, 0, text, { fontSize: '32px', fill: '#fff' });
    Phaser.Display.Align.In.Center(this.text, this.button);

    this.add(this.button);
    this.add(this.text);

    this.button.on('pointerdown', () => { this.scene.scene.start(targetScene) });
    this.button.on('pointerover', () => { this.button.alpha = 1 });
    this.button.on('pointerout', () => { this.button.alpha = 0.5 });

    this.scene.add.existing(this);
  }
}