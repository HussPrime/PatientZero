# Correction du bug de temps de simulation

## Contexte

Le projet `Patient Zero` contient une simulation visuelle avec p5.js et une logique epidemiologique qui depend du temps. Certains parametres, comme la duree d'infection, sont exprimes en secondes simulees. Par exemple, si la duree d'infection vaut `4 s`, un individu infecte doit rester infecte environ 4 secondes simulees avant de guerir. Avec une vitesse `x1`, cela correspond a environ 4 secondes reelles. Avec une vitesse `x5`, ces 4 secondes simulees correspondent a environ 0.8 seconde reelle.

Le bug concernait le temps affiche et le temps utilise par la simulation. En pratique, les secondes de simulation ne correspondaient pas aux vraies secondes qui passaient dans le navigateur.

## Symptomes observes

Au depart, la simulation semblait trop rapide. La vitesse de base donnait une impression d'acceleration excessive.

Ensuite, apres un premier ajustement, le temps affiche en secondes restait incoherent avec le temps reel. Une duree configuree a `4 s` ne durait pas réellement 4 secondes.

Le symptome le plus clair mesure ensuite etait :

```text
2 secondes reelles environ -> 9 secondes affichees dans la simulation, meme en x1
```

Cela montrait que le probleme n'etait pas seulement un mauvais coefficient de vitesse. Le temps semblait etre ajoute plusieurs fois ou calcule depuis une mauvaise source.

## Causes du probleme

### 1. Le temps etait base sur une hypothese fixe de FPS

La simulation utilisait d'abord une approximation :

```js
const FRAME_DURATION_SECONDS = 1 / 30;
```

Cela signifie que chaque frame etait consideree comme valant exactement `1 / 30` seconde.

Cette hypothese est fragile, car un navigateur ne rend pas toujours exactement 30 frames par seconde. Selon la machine, l'onglet, la charge CPU, le hot reload, ou le comportement de p5.js, la frequence reelle peut varier.

Quand on veut qu'une duree de `4 s` dure réellement 4 secondes, il faut utiliser le temps reel ecoule entre deux frames, pas une valeur theorique.

### 2. Clarification du role de `simulationSpeed`

Le premier calcul du temps faisait :

```js
timeStepSeconds = frameDurationSeconds * simulationSpeed;
```

Cela rend les secondes de simulation proportionnelles a la vitesse. Par exemple, a `x5`, une infection de `4 s` dure environ `0.8 s` en temps reel.

Ce comportement est maintenant le comportement souhaite. Le besoin final est :

- la duree epidemiologique, comme `4 s`, est exprimee en secondes simulees ;
- en vitesse `x1`, 1 seconde reelle vaut 1 seconde simulee ;
- en vitesse `x5`, 1 seconde reelle vaut 5 secondes simulees ;
- le compteur affiche les secondes simulees ;
- les infections et les guerisons suivent ces secondes simulees.

La correction conserve donc la proportionnalite entre `simulationSpeed` et le temps simule, tout en evitant les doubles increments causes par React ou p5.js.

### 3. Le compteur React faisait des effets secondaires dans un updater d'etat

Un autre probleme important venait de la maniere dont le temps etait mis a jour dans `App.jsx`.

Le code utilisait un updater React du type :

```js
setSimulationTimeSeconds((currentTimeSeconds) => {
  // calcul du temps
  // console.log
  // setFrameCount
  // setChartHistory
  return nextTimeSeconds;
});
```

Ce genre d'updater doit rester pur autant que possible. Or il contenait plusieurs effets secondaires :

- ecriture dans la console ;
- modification de refs ;
- declenchement d'autres `setState` ;
- ajout de points dans l'historique du graphique.

En developpement, React `StrictMode` peut appeler certaines fonctions plus d'une fois pour detecter les effets de bord. Le projet utilise justement `StrictMode` dans `PatientZero/src/main.jsx`.

Cela pouvait provoquer une avance artificielle du temps : une seule frame p5 pouvait entrainer plusieurs additions cote React. C'est coherent avec le symptome observe, ou environ 2 secondes reelles devenaient environ 9 secondes de simulation.

### 4. Risque de double boucle p5.js pendant le developpement

Le composant `SimulationCanvas` cree une instance p5.js. En developpement, avec React `StrictMode` et le hot reload de Vite, un composant peut etre monte, demonte, puis remonte rapidement.

Si une ancienne boucle p5 continue de tourner apres le demontage, la simulation peut etre mise a jour plusieurs fois en parallele.

Cela peut aussi expliquer une acceleration anormale du temps ou du mouvement.

## Corrections appliquees

### 1. Utilisation de `p.deltaTime`

Dans `PatientZero/src/components/SimulationCanvas.jsx`, la simulation utilise maintenant le vrai temps ecoule entre deux frames fourni par p5.js :

```js
const frameDurationSeconds = Number.isFinite(p.deltaTime)
  ? p.deltaTime / 1000
  : TARGET_FRAME_DURATION_SECONDS;
```

`p.deltaTime` est exprime en millisecondes. Il est donc converti en secondes avec `/ 1000`.

Si jamais `p.deltaTime` n'est pas disponible ou n'est pas valide, le code revient a une valeur de secours :

```js
const TARGET_FRAME_DURATION_SECONDS = 1 / 30;
```

Cette valeur n'est plus la source principale du temps. Elle sert seulement de fallback.

### 2. Temps simule proportionnel a la vitesse de simulation

Dans `PatientZero/src/simulation/updateSimulation.js`, la fonction :

```js
export function getSimulationTimeStepSeconds(settings = {}) {
  const nextSettings = { ...DEFAULT_UPDATE_SETTINGS, ...settings };

  return nextSettings.frameDurationSeconds * nextSettings.simulationSpeed;
}
```

retourne maintenant la duree reelle de la frame multipliee par la vitesse de simulation.

La source de temps reste `p.deltaTime`, donc le calcul part toujours du temps reel ecoule entre deux frames. La difference est que ce temps reel est converti en temps simule avec le multiplicateur choisi.

Consequence :

- a `x1`, `4 s` simulees durent environ 4 vraies secondes ;
- a `x2`, `4 s` simulees durent environ 2 vraies secondes ;
- a `x5`, `4 s` simulees durent environ 0.8 vraie seconde ;
- la vitesse influence le mouvement et le temps simule.

### 3. Conservation de la vitesse pour le mouvement visuel

La vitesse reste utilisee pour deplacer les individus plus vite ou plus lentement.

Dans `SimulationCanvas.jsx`, le multiplicateur de mouvement prend en compte :

- la vitesse choisie par l'utilisateur ;
- le vrai temps ecoule entre deux frames.

Le principe est :

```js
const movementMultiplier = currentSpeed * (frameDurationSeconds / TARGET_FRAME_DURATION_SECONDS);
```

Cela permet de garder un mouvement fluide et coherent meme si les FPS changent.

Si une frame dure plus longtemps, le mouvement compense cette duree. Si une frame est plus courte, le mouvement avance moins.

### 4. Passage du pas de temps reel a React

La boucle p5 calcule maintenant :

```js
const timeStepSeconds = getSimulationTimeStepSeconds(nextParameters);
```

puis transmet ce pas de temps a `App.jsx` :

```js
currentOnSimulationFrame?.(timeStepSeconds);
```

Cela evite que React recalcule le temps avec une hypothese differente. p5.js est la source du temps reel, et React ne fait que recevoir la valeur calculee.

### 5. Deplacement de l'horloge dans des refs React

Dans `PatientZero/src/App.jsx`, l'horloge utilise maintenant des refs :

```js
const simulationTimeRef = useRef(0);
const frameCountRef = useRef(0);
const lastLoggedSecondRef = useRef(0);
```

Ces refs permettent de garder une valeur stable sans dependre des updaters React pour calculer le temps.

La fonction `handleSimulationFrame` fait maintenant les operations dans un ordre plus direct :

1. recevoir `timeStepSeconds` depuis p5.js ;
2. calculer le prochain temps ;
3. logger chaque seconde entiere passee ;
4. mettre a jour les refs ;
5. synchroniser l'affichage React avec `setSimulationTimeSeconds` ;
6. mettre a jour la population ;
7. ajouter un point dans le graphique si necessaire.

L'important est que le temps n'est plus incremente dans un updater React contenant des effets secondaires imbriques.

### 6. Nettoyage explicite de la boucle p5.js

Dans `SimulationCanvas.jsx`, un drapeau d'arret a ete ajoute :

```js
let isDisposed = false;
```

Au debut de `p.draw`, le code verifie :

```js
if (isDisposed) {
  return;
}
```

Au demontage du composant, le code fait :

```js
isDisposed = true;
instance.noLoop();
resizeObserver.disconnect();
instance.remove();
```

Cela reduit fortement le risque qu'une ancienne instance p5.js continue de tourner apres un remount, un hot reload ou un comportement lie a `StrictMode`.

## Fichiers modifies

### `PatientZero/src/simulation/updateSimulation.js`

Role du fichier :

- applique les regles epidemiologiques a chaque frame logique ;
- incremente `infectionTime` ;
- declenche la guerison quand la duree d'infection est atteinte ;
- calcule le pas de temps epidemiologique.

Correction principale :

- `getSimulationTimeStepSeconds` retourne maintenant `frameDurationSeconds * simulationSpeed`.

### `PatientZero/src/components/SimulationCanvas.jsx`

Role du fichier :

- gere le canvas p5.js ;
- dessine les individus ;
- deplace les individus ;
- appelle `updateSimulation` ;
- transmet le pas de temps a React.

Corrections principales :

- utilisation de `p.deltaTime` ;
- calcul d'un `frameDurationSeconds` reel ;
- conservation de `simulationSpeed` pour le mouvement ;
- passage de `timeStepSeconds` a `onSimulationFrame` ;
- ajout d'un nettoyage explicite de la boucle p5 avec `isDisposed` et `noLoop()`.

### `PatientZero/src/App.jsx`

Role du fichier :

- possede l'etat principal de l'application ;
- gere le statut de la simulation ;
- affiche le temps ;
- alimente le graphique ;
- synchronise la population apres chaque frame.

Corrections principales :

- ajout de `simulationTimeRef` ;
- ajout de `frameCountRef` ;
- ajout de `lastLoggedSecondRef` ;
- suppression de l'incrementation du temps dans un updater React impur ;
- log de chaque seconde simulee dans la console ;
- reset propre du temps, du compteur de frames et des logs lors des changements de population ou du reset.

### `PatientZero/src/components/Header.jsx`

Role du fichier :

- affiche l'identite de l'application ;
- affiche le statut ;
- affiche le temps courant.

Correction principale :

- affichage du temps en secondes formatees plutot que d'un tick brut.

### `PatientZero/src/components/EvolutionChart.jsx`

Role du fichier :

- affiche l'historique des etats de la population.

Correction principale :

- les labels du graphique utilisent maintenant un temps en secondes (`timeSeconds`) plutot qu'un tick interne.

### `PatientZero/src/simulation/chartHistory.js`

Role du fichier :

- cree les points d'historique pour le graphique ;
- formate les secondes pour l'affichage.

Correction principale :

- les points stockent `timeSeconds` au lieu de `tick`.

### `PatientZero/src/simulation/updateSimulation.test.js`

Role du fichier :

- teste la logique de propagation et de duree d'infection.

Corrections principales :

- ajout d'un test qui verifie que `1 s` reelle en `x5` donne `5 s` simulees ;
- mise a jour du test qui verifie qu'une vitesse elevee accelere proportionnellement `infectionTime`.

## Comportement attendu apres correction

### En vitesse x1

Si la duree d'infection est `4 s`, un individu infecte doit rester infecte environ 4 secondes reelles, car `x1` signifie :

```text
1 seconde reelle = 1 seconde simulee
```

La console doit afficher approximativement :

```text
Temps simule: 1 s
Temps simule: 2 s
Temps simule: 3 s
Temps simule: 4 s
```

Ces logs doivent apparaitre au rythme d'environ une ligne par seconde reelle.

### En vitesse x2, x3, x4 ou x5

Le mouvement des individus est plus rapide et le temps simule avance plus vite.

Exemples :

- en `x2`, 1 seconde reelle ajoute 2 secondes simulees ;
- en `x3`, 1 seconde reelle ajoute 3 secondes simulees ;
- en `x5`, 1 seconde reelle ajoute 5 secondes simulees.

Donc une duree d'infection de `4 s` dure environ :

- `4 s` reelles en `x1` ;
- `2 s` reelles en `x2` ;
- `0.8 s` reelle en `x5`.

## Pourquoi `StrictMode` a joue un role

React `StrictMode` est active dans `PatientZero/src/main.jsx` :

```jsx
<StrictMode>
  <App />
</StrictMode>
```

En developpement, `StrictMode` peut effectuer des appels supplementaires pour aider a detecter les effets de bord. Ce comportement est volontaire et ne se produit pas de la meme facon en production.

Le probleme n'etait pas `StrictMode` lui-meme. Le probleme etait que le code avait place des effets secondaires dans des fonctions que React peut rappeler.

La correction consiste donc a rendre la gestion du temps plus explicite, hors des updaters React sensibles a ces doubles appels.

## Pourquoi utiliser des refs

Les refs React sont adaptees ici car :

- le temps de simulation doit etre mis a jour tres souvent ;
- chaque frame p5.js peut declencher une mise a jour ;
- on a besoin d'une valeur immediate et stable ;
- on veut eviter que le calcul du temps depende du cycle de rendu React ;
- on veut garder `setState` uniquement pour synchroniser l'interface.

La ref est la source de verite interne pour l'horloge.

L'etat React `simulationTimeSeconds` sert surtout a afficher cette valeur dans l'interface.

## Pourquoi garder `setSimulationTimeSeconds`

Meme si le temps est stocke dans une ref, React a besoin d'un `state` pour re-render le header.

Le code fait donc :

```js
simulationTimeRef.current = nextTimeSeconds;
setSimulationTimeSeconds(nextTimeSeconds);
```

La ref garantit le calcul correct. Le state garantit l'affichage.

## Tests effectues

Les commandes suivantes ont ete executees apres les corrections :

```bash
npm run test:run
```

Resultat :

```text
5 fichiers de tests passes
37 tests passes
```

Puis :

```bash
npm run build
```

Resultat :

```text
Build Vite reussi
```

Un avertissement Vite subsiste sur la taille du bundle JavaScript. Cet avertissement existait dans le flux de build et n'est pas lie au bug de temps.

## Comment verifier manuellement

1. Lancer l'application avec le serveur Vite.
2. Ouvrir la console du navigateur.
3. Demarrer la simulation en vitesse `x1`.
4. Comparer les logs `Temps simule: X s` avec une vraie horloge.
5. Verifier qu'environ 1 seconde reelle passe entre chaque log.
6. Regler la duree d'infection a `4 s`.
7. Verifier qu'en `x1`, un individu infecte ne guerit pas en moins de 4 secondes reelles simplement a cause du compteur.
8. Changer la vitesse visuelle.
9. Verifier qu'en `x5`, les logs de secondes simulees avancent cinq fois plus vite que les secondes reelles.

## Points importants a retenir

- Le temps d'une simulation interactive ne doit pas dependre d'un FPS suppose.
- Pour une simulation basee sur le temps reel, il faut utiliser un delta time reel.
- `p.deltaTime` est la bonne source de temps cote p5.js.
- `simulationSpeed` doit etre applique au temps epidemiologique si les durees sont exprimees en secondes simulees.
- Les updaters React doivent eviter les effets secondaires.
- En developpement, `StrictMode` peut reveler ce genre de probleme en appelant certaines fonctions plusieurs fois.
- Les boucles externes a React, comme p5.js, doivent etre nettoyees explicitement au demontage.

## Etat final attendu

Le systeme de temps est maintenant organise ainsi :

```text
p5.js mesure le temps reel avec deltaTime
        |
        v
SimulationCanvas convertit deltaTime en secondes
        |
        v
updateSimulation utilise ces secondes pour infectionTime
        |
        v
App recoit le meme pas de temps pour l'affichage et le graphique
        |
        v
Header, console et chart affichent un temps coherent
```

Cette organisation evite d'avoir plusieurs sources de verite pour le temps.
