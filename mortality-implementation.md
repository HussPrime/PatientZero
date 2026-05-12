# Implémentation de la mortalité

## Changements réalisés

- Ajout de la probabilité de décès dans `infectionRules.js`.
- Utilisation de `cureRate` comme taux de guérison: la mortalité vaut `100 - cureRate`.
- Application de l'issue de fin d'infection dans `updateSimulation.js`: un individu infecté guérit ou meurt lorsque `infectionDuration` est atteinte.
- Ajout des méthodes `isDead()` et `die()` dans `Individual.js`.
- Empêche les individus morts d'être réinfectés et de continuer à se déplacer.
- Ajout du compteur `dead` dans les statistiques, les cartes de résumé, le canvas et l'historique du graphique.
- Ajout du réglage `Taux de guérison` dans les paramètres modifiables en direct.
- Ajout et adaptation des tests unitaires pour couvrir la mortalité.
- Ajustement visuel de l'état `dead` avec une couleur plus sombre.
- Amélioration de l'écran de fin: métriques alignées sur une grille plus large et ajout d'une croix pour masquer le résumé.
- Ajustement de l'état `Stop`: le bouton principal peut relancer directement une nouvelle simulation après un arrêt manuel.
- Alignement du clic sur la zone p5.js: après un arrêt ou une fin de simulation, cliquer le canvas relance aussi une nouvelle session.
- Remplacement des pastilles génériques dans les statistiques par des icônes distinctes pour les états sain, infecté et mort.
- Renforcement du survol des cartes de statistiques avec des effets néon propres à chaque catégorie.
- Ajustement de l'effet néon des statistiques: retrait du glow sur le texte et accent mis autour de la barre de pourcentage.
- Retrait du glow autour des libellés de statistiques afin que l'effet lumineux reste concentré sur les cartes et les barres.
- Ajout d'un halo néon au survol des sections principales, avec une couleur adaptée à chaque panneau.
- Remplacement de la barre de fin en dégradé par une barre segmentée: rouge pour infectés, bleu pour guéris, noir pour morts, proportionnelle aux compteurs.
- Ajout de dégradés dans chaque segment de la barre de fin tout en conservant les proportions par état.
- Correction de la barre de fin en vrai dégradé continu, calculé depuis les proportions infectés/guéris/morts.

## Problèmes rencontrés

- L'état `dead` existait déjà dans les constantes, la légende et une partie du CSS, mais il n'était pas encore branché dans la logique métier.
- Le taux de guérison était présent dans les paramètres initiaux, mais il n'était pas transmis à la règle de fin d'infection.
- Les statistiques et le graphique ne connaissaient que `healthy`, `infected` et `recovered`, ce qui aurait masqué les décès.

## Solutions apportées

- Centralisation du calcul dans `calculateDeathProbability({ cureRate })` pour garder une règle testable et documentable.
- Ajout de `shouldDie()` afin que `updateSimulation()` reste lisible.
- Conservation de `shouldRecover()` comme test de durée atteinte, puis choix entre `recover()` et `die()`.
- Extension des objets de statistiques et d'historique avec `dead`, en gardant une valeur par défaut à `0` pour éviter les anciens points incomplets.
- Ajout de tests simples sur `Individual`, `Population`, `infectionRules`, `updateSimulation` et `chartHistory`.

## Règle fonctionnelle

Quand un individu infecté atteint la durée d'infection configurée:

- `cureRate = 100`: il guérit toujours.
- `cureRate = 0`: il meurt toujours.
- `cureRate = 75`: il a 75 % de chances de guérir et 25 % de chances de mourir.
