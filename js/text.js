let interfaceText = {};
interfaceText.buttons = {};
interfaceText.buttons.fr = ['Commencer', 'Continuer', 'Options', 'Crédits'];

let dialogs = {};
dialogs.chapter1 = {};
dialogs.chapter1.fr = [`
Bonjour jeune apprenti !

Le roi nous a demandé de sécuriser cette route. Il va
donc falloir que quelqu'un élimine tous ces bandits
et animaux sauvages ...

Déplace toi en utilisant les flèches ou en touchant
un des bords de l'écran.
Lors d'un combat, il faut résoudre l'équation en
tapant le résultat (et en validant avec ENTER) ou en
touchant les chiffres correspondants.

Bon, au travail, montre moi ce que tu sais faire,
jeune apprenti ...`,
`
Tu te débrouilles bien on dirait. Continue comme ça
et on trouvera certainement le chef de ces bandits.

En attendant, je dois absolument cueillir ces
Taraxacum officinale pour ma prochaine potion ...

Bonne continuation jeune apprenti !`,
`
Ahahah, l'homme en noir avait raison, cette route
est pleine de gens aux poches bien remplies !
Je vais devenir riche !

Quoi ? Des intrus ? Vous n'aurez pas mon or !

A L'ATTAQUE !!!
`
];

let story = {};
story.intro = {};
story.chapter1 = {};
story.chapter2 = {};
story.chapter3 = {};

story.intro.fr = `
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

story.chapter1.fr =`
Chapitre 1 : La croisée des chemins

Le roi a récemment ouvert une nouvelle route
pour relier deux grandes villes de son royaume.
Malheureusement, depuis quelques temps,
les voyageurs se font attaquer par des bandits.

Il est donc temps pour vous de faire vos preuves
et de croiser le fer avec ces brigands ...`;

story.chapter2.fr =`
Chapitre 2 : Le désert retiré

Près de la frontière du royaume, une ville s'est
installée en brodure d'un désert. Cette ville
est prospère mais, depuis quelques temps,
certains habitants sont enlevés par des monstres
de roche et emmené dans le désert.

Le roi vous demande d'enquêter et de découvrir
ce qu'il se passe ...`;

let credits =
`Auteur :
Sylvebois

Remerciements :
Open Game Art
http://opengameart.org
Dungeon Crawl Stone Soup
http://crawl.develz.org
Francisco Hodge (virtual keyboard)
https://franciscohodge.com`;

export {interfaceText, story, dialogs, credits};