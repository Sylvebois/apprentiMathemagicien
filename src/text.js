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

Le roi nous a demandé de sécuriser cette route. Il va donc falloir 
que quelqu'un élimine tous ces bandits et animaux sauvages ...

Déplace toi en utilisant les flèches ou en touchant ta destination 
sur l'écran.
Lors d'un combat, tu dois résoudre l'équation en tapant le résultat 
(et en validant avec ENTER) ou en touchant les chiffres correspondants.

Bon, au travail ! Montre moi ce que tu sais faire,jeune apprenti ...`,
`
Tu te débrouilles bien on dirait. Continue comme ça et on trouvera 
certainement le chef de ces bandits.

En attendant, je dois absolument cueillir ces Taraxacum officinale 
pour ma prochaine potion ...

Bonne continuation jeune apprenti !`,
`
Ahahah, l'homme en noir avait raison, cette route est pleine de gens 
aux poches bien remplies !

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

dialogs.chapter2.fr = [`
Pffiou !!! Enfin, nous sommes arrivés.

A mon âge, on ne devrait pas faire de si long voyage,
c'est mauvais pour mon dos.

Bon, je suppose que nous devons trouver et 
"interroger" ces hommes de pierre ...

Va les chercher dans le désert, je te rejoins dès que
mon dos ira mieux.
`, 
`
Alors jeune apprenti, as-tu trouvé des indices ? 
Leur chef est par là ? Et bien, allons lui rendre une
petite ...

Mais c'est une Datura wrightii ! C'est très rare de 
tomber sur une telle plante. 

Il faut absolument que je l'étudie ! Pars devant, 
j'ai à faire ...
`, 
`
Crrrrack ... Crrrrack ... Homme en noir mentir ...
Crrrrack ... Humains pas utiles ... Crrrrack ... 
Contre rhumatismes ... Crrrrack ... Peut-être que 
ceux en robe plus efficaces ? ... Crrrrack ...

VENEZ ICI !
`];
dialogs.chapter2.en = [`
Pffiou !!! At least, we are here.

At my age, we should not make such a long trip,
it's bad for my back.

Well, I guess we have to find and "interrogate" 
these stone men...

Go look for them in the desert, I'll join you as 
soon as my back gets better.
`, 
`
So young apprentice, did you find any clues ? 
Their boss is this way ? Let's pay him a little ...

But wait, it is a Datura wrightii ! It's very rare to 
come across such a plant. 

It is absolutely necessary that I study it ! 
Go ahead, I have to do ...
`, 
`
Crrrrack ... Crrrrack ... Man in black lied ...
Crrrrack ... Humans useless ... Crrrrack ...
Against rheumatisms ... Crrrrack ... Perhaps those
in a dress are more effective ? ... Crrrrack ...

COME HERE !
`];

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
et de croiser le fer avec ces brigands ...
`;
story.chapter1.en =`
Chapter 1 : The Crossroads

The king has recently opened a new road to link
two great cities in his kingdom.
Unfortunately, for some time now, the travelers
are being attacked by bandits.

So it's time for you to prove yourself and
to cross swords with these brigands...
`;

story.chapter2.fr =`
Chapitre 2 : Le désert retiré

Près de la frontière du royaume, une ville s'est
installée en bordure d'un désert. Cette ville
est prospère mais, depuis quelques temps,
certains habitants sont enlevés par des monstres
de roche et emmené dans le désert.

Le roi vous demande d'enquêter et de découvrir
ce qu'il se passe ...
`;
story.chapter2.en =`
Chapter 2 : The Recluded Desert

Near the border of the kingdom, a city has
settled on the edge of a desert. This city is
prosperous but, for some time, some inhabitants
have been kidnapped by rock monsters and taken
to the desert.

The king asks you to investigate and find out
what is going on...
`;

story.chapter3.fr =`
Chapitre 3 : Les troubles multipliés

Après votre aventure dans le désert, vous retournez
au palais pour faire votre rapport au roi. 
Mais tout ne se passe pas comme prévu :
bizarrement, les gardes vous barrent la route 
et semblent prêts à en découdre ...

Il va falloir forcer le passage pour voir le roi ...
`;
story.chapter3.en =`
Chapter 3 : The multiplicated troubles

After your adventure into the desert, you return
to the palace to report to the king.
But not everything is going as planned :
oddly, guards block your way and seem ready 
to fight ...

You will have to force the way to see the king ...
`;

story.chapter4.fr =`
Chapitre 4 : Le marais divisé
`;
story.chapter4.en =`
Chapter 4 : The divided swamp
`;

story.chapter5.fr =`
Chapitre 5 : La forteresse de puissance
`;
story.chapter5.en =`
Chapter 5 : The Fortress of power
`;

story.chapter6.fr =`
Chapitre 6 : Les racines du monde
`;
story.chapter6.en =`
Chapter 6 : The roots of the world
`;

let credits =
`Auteur :
Sylvebois

Remerciements :
Open Game Art
http://opengameart.org
Dungeon Crawl Stone Soup
http://crawl.develz.org
Tomasz Kucza / magory.games
http://magory.net
The Cynic Project
http://cynicmusic.com`;

export {interfaceText, story, dialogs, credits};