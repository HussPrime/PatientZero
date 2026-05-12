# Correction de la hauteur de `dashboard__visuals`

## Bug constate

Lors du redimensionnement de la fenetre, la zone `dashboard__visuals` pouvait augmenter de hauteur. Cette zone contient la simulation p5.js et le graphique Chart.js.

Le probleme venait principalement de deux choix CSS combines :

- `.simulation-canvas` utilisait `height: clamp(320px, 38vw, 520px)`, donc sa hauteur dependait de la largeur de la fenetre.
- `.dashboard__visuals` alignait ses enfants avec `align-items: stretch`, ce qui permettait aux panneaux de s'etirer verticalement selon la hauteur du plus grand contenu.

Avec Chart.js et p5.js, ces variations de taille peuvent donner l'impression que le conteneur grandit pendant les redimensionnements.

## Resolution

Une variable CSS commune `--visual-panel-body-height` definit maintenant la hauteur de contenu des deux panneaux visuels.

Les deux zones utilisent cette hauteur stable :

- `.simulation-canvas`
- `.chart-frame`

Comme `.simulation-canvas` possede une marge verticale de `12px` en haut et en bas, `.chart-frame` utilise `--visual-chart-frame-height`, calculee avec `24px` de plus que `--visual-panel-body-height`. Cela permet au panneau "Evolution dans le temps" d'avoir la meme hauteur totale que le panneau "Zone de simulation" en affichage desktop.

Le sous-texte de l'en-tete du graphique est aussi force sur une seule ligne avec une ellipse si l'espace manque. Sans cette regle, le texte pouvait passer sur deux lignes a cote de la legende et rendre le panneau du graphique plus haut que celui de la simulation.

La grille `.dashboard__visuals` utilise maintenant `align-items: start` pour eviter l'etirement vertical automatique des panneaux.

Des valeurs adaptees sont definies aux breakpoints responsive :

- `520px` sur desktop
- `420px` sous `1240px`
- `340px` sous `768px`

Ainsi, la hauteur ne varie plus continuellement pendant un redimensionnement horizontal. Elle change seulement aux breakpoints prevus pour conserver une interface lisible sur les ecrans plus petits.
