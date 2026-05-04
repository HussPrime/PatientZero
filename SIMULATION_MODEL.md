# Modele de donnees de simulation

Ce document explique la base logique ajoutee pour la tache: definition du modele de donnees et generation initiale de la population simulee.

## Objectif

La logique metier de la simulation est separee de React, p5.js et Chart.js. Elle se trouve dans `PatientZero/src/simulation/`, ce qui permet de la tester avec Vitest sans lancer l'interface.

## Etats sanitaires

Le fichier `PatientZero/src/constants/simulationStates.js` contient les trois etats possibles:

```js
export const INDIVIDUAL_STATES = {
  HEALTHY: "healthy",
  INFECTED: "infected",
  RECOVERED: "recovered",
};
```

L'interet est d'eviter de recopier les chaines `"healthy"`, `"infected"` et `"recovered"` partout dans le code. Si une valeur doit changer plus tard, elle est modifiee a un seul endroit.

## Classe Individual

Le fichier `PatientZero/src/simulation/Individual.js` contient la classe `Individual`. Elle represente une personne dans la zone de simulation.

Chaque individu possede:

- `id`: identifiant unique.
- `x` et `y`: position dans la zone de simulation.
- `vx` et `vy`: vitesse horizontale et verticale pour un futur deplacement.
- `state`: etat sanitaire actuel.
- `infectionTime`: temps ecoule depuis l'infection, ou `null` si l'individu n'est pas infecte.

Les methodes importantes sont:

- `isHealthy()`, `isInfected()` et `isRecovered()`: verifient l'etat de l'individu.
- `infect()`: passe l'individu en etat infecte et met `infectionTime` a `0`.
- `recover()`: passe l'individu en etat gueri.
- `move(width, height)`: deplace l'individu et le fait rebondir sur les bords.
- `toJSON()`: retourne une version simple de l'objet, pratique pour les tests ou l'affichage.

Point important: `infect()` ne modifie pas un individu deja gueri. Cela respecte la regle de base: un individu `recovered` ne redevient pas `infected` pour l'instant.

## Classe Population

Le fichier `PatientZero/src/simulation/Population.js` contient la classe `Population`. Elle gere un tableau d'individus et les parametres de generation.

Les parametres par defaut sont dans `PatientZero/src/constants/defaultSettings.js`:

- `populationSize`: nombre total d'individus.
- `initialInfected`: nombre de patients zero.
- `simulationWidth` et `simulationHeight`: dimensions de la zone.
- `minInitialSpeed` et `maxInitialSpeed`: bornes pour les vitesses initiales.

La methode `generate()` fait quatre choses:

1. Elle cree exactement `populationSize` individus.
2. Elle choisit aleatoirement exactement `initialInfected` identifiants.
3. Elle infecte uniquement ces patients zero.
4. Elle laisse tous les autres individus en etat `healthy`.

Aucun individu `recovered` n'est cree au depart.

La methode `getStats()` calcule les compteurs:

```js
{ healthy: 15, infected: 5, recovered: 0, total: 20 }
```

Ces statistiques pourront ensuite etre utilisees par React pour les panneaux de compteurs et par Chart.js pour l'historique.

## Pourquoi il n'y a pas encore de SimulationEngine

La classe `SimulationEngine` n'a pas ete ajoutee pour cette etape. Pour l'instant, `Individual` et `Population` suffisent a couvrir la generation initiale. Ajouter un moteur complet maintenant aurait cree de la structure inutile avant d'implementer la propagation, les ticks et les controles start/pause/reset.

## Tests ajoutes

Deux fichiers de tests ont ete ajoutes:

- `PatientZero/src/simulation/Individual.test.js`
- `PatientZero/src/simulation/Population.test.js`

Ils verifient notamment:

- un individu commence sain par defaut;
- `infect()` met bien l'etat a `infected` et `infectionTime` a `0`;
- un individu gueri ne redevient pas infecte;
- la population genere le bon nombre d'individus;
- le nombre initial d'infectes est exact;
- aucun individu gueri n'existe au depart;
- une configuration impossible est refusee.

