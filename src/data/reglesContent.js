export const BONNES_HABITUDES = {
  titre: 'Bonnes habitudes',
  sections: [
    {
      sous_titre: 'Le sommeil',
      texte: "Vise 8 à 9h de sommeil par nuit, surtout les nuits avant un match ou un entraînement intense. Le sommeil est essentiel à la récupération musculaire et à la concentration sur le terrain.",
    },
    {
      sous_titre: 'Avant l\'entraînement',
      texte: "Mange un repas léger et riche en glucides 2 à 3h avant (pâtes, riz, banane...). Évite les aliments gras ou trop lourds juste avant de jouer, qui ralentissent la digestion et pèsent pendant l'effort. Bois de l'eau régulièrement dans les heures qui précèdent.",
    },
    {
      sous_titre: 'Pourquoi s\'échauffer',
      texte: "L'échauffement augmente la température musculaire et la fréquence cardiaque progressivement, ce qui réduit fortement le risque de blessure (déchirure, entorse) et améliore la qualité des premiers gestes.",
    },
    {
      sous_titre: 'Quand s\'étirer',
      texte: "Privilégie des étirements dynamiques (mouvements contrôlés) avant l'effort, et des étirements statiques (maintenus) après l'entraînement, une fois les muscles chauds, pour favoriser la récupération et la souplesse.",
    },
    {
      sous_titre: 'Après l\'entraînement',
      texte: "Mange dans l'heure qui suit un repas avec des protéines (pour la récupération musculaire) et des glucides (pour reconstituer l'énergie). Reste hydraté dans les heures qui suivent.",
    },
  ],
};

export const REGLES_IMPORTANTES = {
  rotations: {
    titre: 'Rotations',
    sections: [
      {
        sous_titre: 'Le principe',
        texte: "Les 6 joueurs sur le terrain tournent dans le sens des aiguilles d'une montre à chaque fois que l'équipe qui était en train de recevoir le service gagne l'échange et récupère le service. On ne tourne jamais quand on garde le service.",
      },
      {
        sous_titre: 'Faute de position',
        texte: "Avant que le serveur ne frappe le ballon, chaque joueur doit être correctement placé par rapport à ses voisins immédiats (devant/derrière, gauche/droite), selon l'ordre de rotation. Si ce n'est pas le cas, l'arbitre siffle une faute de rotation : l'équipe perd le point, et l'adversaire reçoit le service.",
      },
      {
        sous_titre: 'Le geste de l\'arbitre',
        texte: 'Pour signaler une faute de rotation, l\'arbitre trace un petit cercle avec son index pointé vers le bas.',
      },
    ],
  },
  remplacements: {
    titre: 'Remplacements',
    sections: [
      {
        sous_titre: 'Le nombre autorisé',
        texte: "Chaque équipe a droit à 6 remplacements par set. Un remplacement, c'est un joueur qui sort et un autre qui entre à sa place.",
      },
      {
        sous_titre: 'La règle du retour',
        texte: "Un joueur qui a été remplacé ne peut revenir sur le terrain qu'à la même position dans l'ordre de rotation, et seulement à la place du joueur qui l'a remplacé lors du set en cours.",
      },
      {
        sous_titre: 'Les serveurs désignés',
        texte: "Une équipe peut désigner un joueur remplaçant qui ne rentre que pour servir (souvent un joueur avec un bon service), avant de ressortir immédiatement après. C'est un remplacement classique, mais utilisé de façon stratégique.",
      },
    ],
  },
  format: {
    titre: 'Format du match',
    sections: [
      {
        sous_titre: 'Le terrain et les équipes',
        texte: "Le terrain fait 18 mètres sur 9, séparé en deux camps de 9x9m par un filet. Chaque équipe joue à 6 joueurs sur le terrain.",
      },
      {
        sous_titre: 'Le déroulement d\'un échange',
        texte: "Une équipe a droit à 3 touches maximum (en plus du contre) pour renvoyer le ballon dans le camp adverse. Un même joueur ne peut pas toucher le ballon deux fois de suite (sauf après un contre).",
      },
      {
        sous_titre: 'Les sets',
        texte: "Un set se joue en 25 points, avec 2 points d'écart minimum pour gagner. S'il y a égalité à 24-24, on continue jusqu'à ce qu'une équipe ait 2 points d'avance. Un match se joue généralement en 3 sets gagnants sur 5 (le 5e set, s'il a lieu, se joue en 15 points).",
      },
      {
        sous_titre: 'Le service',
        texte: "Le serveur a 8 secondes pour servir après le coup de sifflet de l'arbitre.",
      },
      {
        sous_titre: 'Les temps morts',
        texte: "Chaque équipe dispose de 2 temps morts de 30 secondes par set. Des temps morts techniques sont aussi accordés automatiquement quand une équipe atteint 8 puis 16 points (selon les compétitions).",
      },
      {
        sous_titre: 'Le rôle du capitaine',
        texte: "Seul le capitaine a le droit de s'adresser à l'arbitre pour demander une clarification sur une décision. Les autres joueurs ne peuvent pas interpeller librement l'arbitre.",
      },
    ],
  },
};

export const POSTES = {
  passeur: {
    titre: 'Passeur',
    regles: "Le passeur organise le jeu offensif de l'équipe. C'est lui qui touche généralement le 2e ballon pour distribuer aux attaquants. Il doit être rapide et précis, et anticiper les meilleures options d'attaque selon le placement du bloc adverse.",
    joueurs_forts: ["Micah Christenson (USA)", "Bruninho (Brésil)", "Ricardo Lucarelli (Brésil)"],
    competences: ['Technique de passe', 'Intelligence de jeu', 'Rapidité', 'Communication'],
    conseils: "Travaille la précision de tes passes sur cible (paniers de basket ou zones marquées au sol), et regarde des matchs pour étudier comment les meilleurs passeurs lisent le jeu adverse avant de faire leur choix.",
  },
  central: {
    titre: 'Central',
    regles: "Le central joue au centre du filet. Il est la pièce maîtresse du bloc (notamment sur les attaques rapides adverses) et attaque souvent vite au centre. Contrer le service est interdit ; après un contre, l'équipe a de nouveau droit à 3 touches, la première pouvant être faite par le joueur qui vient de contrer.",
    joueurs_forts: ["Robertlandy Simón (Cuba)", "Flavio Gualberto (Brésil)"],
    competences: ['Détente', 'Contre', 'Rapidité de déplacement', 'Timing'],
    conseils: "Travaille les déplacements latéraux rapides le long du filet, et le timing de saut au contre. La lecture du jeu adverse (où va partir l'attaque) est essentielle à ce poste.",
  },
  receptionneur: {
    titre: 'Réceptionneur-attaquant',
    regles: "Joueur polyvalent qui réceptionne le service adverse et attaque sur les ailes du terrain. Il touche beaucoup de ballons dans le match, à la fois en défense et en attaque.",
    joueurs_forts: ["Wilfredo León (Pologne)", "Earvin Ngapeth (France)"],
    competences: ['Réception', 'Attaque', 'Endurance', 'Régularité'],
    conseils: "Multiplie les répétitions de réception avec des services variés (flottant, sauté), et travaille l'enchaînement réception-déplacement-attaque.",
  },
  pointu: {
    titre: 'Pointu',
    regles: "Attaquant qui joue principalement au poste 2 (près du poteau), souvent en oppposition avec le passeur dans la rotation. Il attaque beaucoup et doit être capable de varier ses frappes.",
    joueurs_forts: ["Yuki Ishikawa (Japon)", "Aleksandar Atanasijević (Serbie)"],
    competences: ['Force de frappe', 'Variété d\'attaque', 'Détente'],
    conseils: "Travaille différents types d'attaque (ligne, croisé, feinte) pour devenir imprévisible, et renforce la puissance de frappe avec des exercices de préparation physique ciblés.",
  },
  libero: {
    titre: 'Libéro',
    regles: "Spécialiste défensif, reconnaissable à son maillot de couleur différente. Il peut remplacer librement n'importe quel joueur arrière sans que cela compte comme un remplacement classique. Il ne peut ni servir, ni attaquer au-dessus du filet, ni faire une passe au-dessus du filet en zone avant s'il est en position avant.",
    joueurs_forts: ["Sérgio Santos (Brésil)", "Fabio Balaso (Italie)"],
    competences: ['Réception', 'Défense', 'Réflexes', 'Lecture du jeu'],
    conseils: "Travaille les déplacements bas et rapides, les plongeons contrôlés, et surtout la lecture des trajectoires d'attaque adverses pour anticiper où défendre.",
  },
};

// Index à plat utilisé par la barre de recherche : une entrée par phrase/section
export function construireIndexRecherche() {
  const index = [];

  Object.entries(REGLES_IMPORTANTES).forEach(([id, regle]) => {
    regle.sections.forEach((s) => {
      index.push({ route: `/regles/${id}`, titre: regle.titre, sousTitre: s.sous_titre, texte: s.texte });
    });
  });

  Object.entries(POSTES).forEach(([id, poste]) => {
    index.push({ route: `/postes/${id}`, titre: poste.titre, sousTitre: 'Règles du poste', texte: poste.regles });
    index.push({ route: `/postes/${id}`, titre: poste.titre, sousTitre: 'Conseils', texte: poste.conseils });
  });

  BONNES_HABITUDES.sections.forEach((s) => {
    index.push({ route: '/bonnes-habitudes', titre: BONNES_HABITUDES.titre, sousTitre: s.sous_titre, texte: s.texte });
  });

  return index;
}
