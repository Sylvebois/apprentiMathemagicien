let interfaceText = {};
interfaceText.buttons = {};
interfaceText.buttons.fr = ['Commencer', 'Continuer', 'Options', 'Crédits', 'Musique', 'Son', 'Langue', 'Retour'];
interfaceText.buttons.en = ['Start', 'Continue', 'Options', 'Credits', 'Music', 'Sound', 'Language', 'Back'];

let dialogs = {};
dialogs.chapter1 = {};
dialogs.chapter2 = {};
dialogs.chapter3 = {};
dialogs.chapter4 = {};
dialogs.chapter5 = {};
dialogs.chapter6 = {};

dialogs.chapter1.fr = [`
Bonjour jeune apprenti !

Le roi nous a demandé de sécuriser cette route. Il va
donc falloir que quelqu'un élimine tous ces bandits
et animaux sauvages ...

Déplace toi en utilisant les flèches ou en touchant
un des bords de l'écran.
Lors d'un combat, tu dois résoudre l'équation en
tapant le résultat (et en validant avec ENTER) ou en
touchant les chiffres correspondants.

Bon, au travail ! Montre moi ce que tu sais faire,
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

dialogs.chapter1.en = [`
Hello young apprentice !

The king asked us to secure this road. So,
somebody's gonna have to take out all these bandits
and wild animals ...

Move around using the arrow keys or by touching one
of the edge of the screen.
During combats, you have to solve the equation by
typing the result (and confirm with ENTER) or by
touching the corresponding numbers.

All right, let's go to work ! Show me what you got,
young apprentice ...`,
`
Looks like you're doing well. Keep it up and we'll
certainly find the leader of these bandits.

In the meantime, I must absolutely pick up these
Taraxacum officinale for my next potion ...`,
`
Ahahah, the man in black was right, that road is
full of people with deep pockets !
I'm gonna get rich !

What ? Intruders ? You won't get my gold !

ATTACK !!!
`
];

dialogs.chapter2.fr = [``, ``, ``];
dialogs.chapter2.en = [``, ``, ``];

dialogs.chapter3.fr = [``, ``, ``];
dialogs.chapter3.en = [``, ``, ``];

dialogs.chapter4.fr = [``, ``, ``];
dialogs.chapter4.en = [``, ``, ``];
dialogs.chapter5.fr = [``, ``, ``];
dialogs.chapter5.en = [``, ``, ``];
dialogs.chapter6.fr = [``, ``, ``];
dialogs.chapter6.en = [``, ``, ``];


let story = {};
story.intro = {};
story.chapter1 = {};
story.chapter2 = {};
story.chapter3 = {};
story.chapter4 = {};
story.chapter5 = {};
story.chapter6 = {};

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
story.intro.en = `
One upon a time in a country far, far away ...


A kingdom ruled by a good king who knew
calculating and could count on his wizard.
He had brought order back to the kingdom but,
one day, problems arose and the chaos began to
spread.

After so many years of peace, the king asked
his old mathemagician to bring people to their
senses.

Too old to deal with this kind of trouble,
the magician chooses an apprentice to help him ...
`;

story.chapter1.fr =`
Chapitre 1 : La croisée des chemins

Le roi a récemment ouvert une nouvelle route
pour relier deux grandes villes de son royaume.
Malheureusement, depuis quelques temps,
les voyageurs se font attaquer par des bandits.

Il est donc temps pour vous de faire vos preuves
et de croiser le fer avec ces brigands ...`;
story.chapter1.en =``;

story.chapter2.fr =`
Chapitre 2 : Le désert retiré

Près de la frontière du royaume, une ville s'est
installée en brodure d'un désert. Cette ville
est prospère mais, depuis quelques temps,
certains habitants sont enlevés par des monstres
de roche et emmené dans le désert.

Le roi vous demande d'enquêter et de découvrir
ce qu'il se passe ...`;
story.chapter2.fr =``;

story.chapter3.fr =``;
story.chapter3.en =``;

story.chapter4.fr =``;
story.chapter4.en =``;

story.chapter5.fr =``;
story.chapter5.en =``;

story.chapter6.fr =``;
story.chapter6.en =``;

let credits =
`Auteur :
Sylvebois

Remerciements :
Open Game Art
http://opengameart.org
Dungeon Crawl Stone Soup
http://crawl.develz.org
Tomasz Kucza / magory.games
http://magory.net`;

export {interfaceText, story, dialogs, credits};