# Modèle de probabilité de contamination

Ce document décrit le modèle utilisé pour calculer la probabilité qu'un individu infecté contamine un individu sain dans Patient Zero.

## Formule utilisée

La formule étudiée est :

```txt
probabilite_contamination =
1 - (1 - facteur_transmission / (distance / distance_type)^2)^(duree_contact / duree_type)
```

Dans le code, cette logique est implémentée par la fonction pure `calculateInfectionProbability()` dans `src/simulation/infectionRules.js`.

## Signification des variables

- `facteur_transmission` : risque de base de transmission.
- `distance` : distance entre deux individus, calculée avec leurs coordonnées `x` et `y`.
- `distance_type` : distance de référence à partir de laquelle le risque est comparé.
- `duree_contact` : durée pendant laquelle les deux individus sont considérés en contact.
- `duree_type` : durée de référence pour normaliser le contact.
- `probabilite_contamination` : résultat final entre `0` et `1`.

## Correspondance avec Patient Zero

- `facteur_transmission` correspond à `transmissionRate` dans l'application. Le slider affiche une valeur en pourcentage, puis la logique métier la convertit en probabilité entre `0` et `1`.
- `distance_type` correspond à `infectionRadius`.
- `distance` est calculée par `calculateDistance(individualA, individualB)`.
- `duree_contact` correspond à la constante interne `contactDuration`.
- `duree_type` correspond à la constante interne `referenceContactDuration`.
- `probabilite_contamination` est calculée par `calculateInfectionProbability()`.

## Variables déjà présentes

- `populationSize` : taille de la population, sans lien direct avec la formule.
- `initialInfected` : nombre de patients zéro, sans lien direct avec la formule.
- `infectionDuration` : durée d'infection avant guérison, sans lien avec la durée de contact.
- `movementSpeed` : vitesse de déplacement des individus. Elle influence indirectement les contacts, mais elle n'entre pas directement dans la formule.
- `transmissionRate` : facteur de transmission affiché dans l'interface.
- `recoveryRate` : conservé dans l'interface, mais la guérison actuelle dépend surtout de `infectionDuration`.
- `infectionRadius` : rayon maximal et distance de référence de contamination.

## Variables internes ajoutées

La première version garde deux valeurs internes dans `updateSimulation.js` :

- `contactDuration = 1`
- `referenceContactDuration = 1`

Elles ne sont pas affichées dans l'interface afin de garder le panneau de configuration simple pour le TPI.

## Simplification de la durée de contact

Pour l'instant, Patient Zero ne mémorise pas la durée de contact entre chaque paire d'individus. La simulation considère donc qu'un contact valide dure `1 tick` logique.

Cette simplification permet de garder un modèle compréhensible, testable et suffisamment réaliste pour une première version.

## Rôle de infectionRadius

`infectionRadius` sert à deux choses :

- il empêche toute contamination si la distance est supérieure au rayon ;
- il sert de `distance_type` dans la formule.

Ainsi, un individu proche a un risque plus élevé, tandis qu'un individu proche de la limite du rayon a un risque plus faible.

## Différence avec infectionDuration

`infectionDuration` ne représente pas la durée de contact. Cette variable sert uniquement à décider quand un individu infecté devient guéri.

La durée de contact concerne une rencontre entre deux individus. La durée d'infection concerne l'état interne d'un individu déjà infecté.

## Sécurité numérique

La fonction évite les cas incohérents :

- si `distance > infectionRadius`, elle retourne `0`;
- si `distance` vaut `0`, elle utilise une distance minimale de `1`;
- si `infectionRadius <= 0`, elle lance une erreur explicite;
- si `referenceContactDuration <= 0`, elle lance une erreur explicite;
- si `contactDuration < 0`, elle lance une erreur explicite;
- si `transmissionProbability` est hors de `0` à `1`, elle lance une erreur explicite.

La probabilité finale est limitée entre `0` et `1`, et le risque de base est aussi limité entre `0` et `1`.

## Utilisation dans la propagation

À chaque mise à jour logique :

1. la simulation parcourt les individus infectés;
2. elle compare chaque infecté avec les individus sains;
3. elle calcule la distance;
4. si la distance dépasse `infectionRadius`, aucune infection n'est possible;
5. sinon, elle calcule la probabilité de contamination;
6. elle tire un nombre aléatoire;
7. si le tirage est inférieur à la probabilité, l'individu sain devient infecté.

Un individu `recovered` ne redevient pas infecté dans cette version.

## Limites actuelles

Le modèle reste volontairement simple :

- la durée réelle de contact entre deux individus n'est pas mémorisée;
- le calcul compare encore chaque infecté avec les individus sains, ce qui peut devenir coûteux avec une très grande population;
- `movementSpeed` influence les contacts seulement par le mouvement, pas directement dans la formule;
- `recoveryRate` n'est pas intégré à la contamination.

## Améliorations possibles

Plus tard, il serait possible d'ajouter :

- une mémoire de contact par paire d'individus;
- une grille spatiale pour accélérer la recherche des voisins;
- un modèle de guérison combinant `infectionDuration` et `recoveryRate`;
- un historique plus précis pour alimenter le graphique Chart.js;
- des paramètres avancés masqués dans une section optionnelle.

## Vérifications

Les commandes suivantes ont été exécutées après l'implémentation :

```bash
npm run lint
npm run test:run
npm run build
```

Elles doivent rester vertes avant de considérer cette partie comme terminée.
