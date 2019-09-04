import * as PHASER from '../phaser.min.js';
import config from '../Config/config.js';

export default class TitleScene extends Phaser.Scene {
  constructor(level = 0) {
    super('Story');

    this.level = level;
    this.intro = `
Il était une fois dans une contrée lointaine,
très lointaine ...


Un royaume gouverné par un bon roi qui savait
calculer et pouvait compter sur son mage.
Il avait ramené l'ordre dans le royaume mais,
un jour, des problèmes apparurent et le chaos
commença à se répandre.

Après de si nombreuses années de paix, le roi
fit appel à son vieux mathémagicien pour ramener
les gens à la raison.

Ce dernier, trop vieux pour régler ce genre de
chose, choisit un apprenti pour l'aider ...`;

    this.chapter1 = `
Chapitre 1 : La croisée des chemins

Le roi a récemment ouvert une nouvelle route
pour relier deux grandes villes de son royaume.
Malheureusement, depuis quelques temps,
les voyageurs se font attaquer par des bandits.

Il est donc temps pour vous de faire vos preuves
et de croiser le fer avec ces brigands ...`;
  }

  create() {
    // Background
    this.add.image(config.width / 2, config.height / 2, 'bgScroll');

    if (this.level === 0) {
      this.introText = this.add.text(120, 100, this.intro, { fontSize: '20px', fill: '#fff' });
      this.chapter1Text = this.add.text(120, 100, this.chapter1, { fontSize: '20px', fill: '#fff' });

      this.chapter1Text.alpha = 0;
    }

    this.introTween = this.tweens.add({
      targets: this.introText,
      alpha: 0,
      ease: 'Power1',
      duration: 750,
      paused: true,
      onComplete: function () {
        this.destroy;
        this.chapter1Tween.play();
      }.bind(this)
    });

    this.chapter1Tween = this.tweens.add({
      targets: this.chapter1Text,
      alpha: 1,
      ease: 'Power1',
      duration: 750,
      paused: true,
      onComplete: function () {
        this.destroy;
      }.bind(this)
    });

    this.input.on('pointerdown', function () {
      if(this.level === 0 && this.introText.alpha === 1) {
        this.introTween.play();
      }
      else {
        this.scene.start('Game');
      }
    }.bind(this));
  }
}
