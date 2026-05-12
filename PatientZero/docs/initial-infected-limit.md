# Limite des patients zéro par rapport à la population

## Problème

Le paramètre `Patients zéro` ne doit jamais être supérieur à la taille totale de la population.

Exemple de situation incorrecte :

- Population : `50`
- Patients zéro : `100`

Dans ce cas, l'application essaierait de créer plus d'individus infectés au départ qu'il n'existe d'individus dans la population.

Cela peut provoquer :

- une configuration incohérente ;
- des statistiques difficiles à interpréter ;
- un comportement incorrect lors de la génération de population ;
- un risque d'erreur si la logique de simulation suppose que `initialInfected <= populationSize`.

## Fichiers modifiés

- `src/components/SetupPanel.jsx`
- `src/App.jsx`

## Solution dans l'interface

Dans `SetupPanel.jsx`, le maximum du slider `Patients zéro` dépend maintenant de la taille de population actuelle.

La limite utilisée est :

```js
const initialInfectedMax = Math.min(values.populationSize, 100);
```

Cela signifie :

- si la population est inférieure à `100`, le maximum devient la population ;
- si la population est supérieure ou égale à `100`, le maximum reste `100`.

La valeur affichée est aussi sécurisée :

```js
const initialInfectedValue = Math.min(values.initialInfected, initialInfectedMax);
```

Le slider ne peut donc pas afficher une valeur plus grande que la limite autorisée.

## Solution dans l'état React

Limiter seulement l'affichage du slider ne suffit pas.

Le state React pouvait encore contenir une ancienne valeur trop élevée si l'utilisateur réduisait la population après avoir choisi un grand nombre de patients zéro.

La fonction `updateParameter` dans `App.jsx` corrige donc aussi la donnée réelle.

Quand `populationSize` change :

```js
nextParameters.initialInfected = Math.min(nextParameters.initialInfected, value);
```

Quand `initialInfected` change :

```js
nextParameters.initialInfected = Math.min(value, nextParameters.populationSize);
```

Cela garantit que l'invariant suivant reste toujours vrai :

```txt
initialInfected <= populationSize
```

## Pourquoi la validation est faite à deux endroits

La validation est volontairement faite dans deux endroits différents :

- `SetupPanel.jsx` protège l'expérience utilisateur et évite d'afficher un choix impossible.
- `App.jsx` protège la donnée métier utilisée ensuite par la simulation.

Cette double protection évite qu'une valeur invalide reste en mémoire même si l'interface semble correcte.

## Vérifications effectuées

Les commandes suivantes ont été exécutées après la modification :

```bash
npm run lint
npm run test:run
npm run build
```

Résultat :

- le lint passe ;
- les tests existants passent ;
- le build fonctionne.

Vite affiche uniquement l'avertissement connu sur la taille du bundle.

## Notes pour la suite

Si d'autres paramètres dépendent les uns des autres, appliquer le même principe :

1. bloquer la valeur impossible dans le composant d'interface ;
2. sécuriser aussi la valeur dans l'état React central ;
3. garder une règle claire et testable.