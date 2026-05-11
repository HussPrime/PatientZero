# CODEX.md — Instructions de développement pour **Patient Zero**

## 1. Contexte du projet

**Patient Zero** est une application web interactive de simulation d’épidémie réalisée dans le cadre d’un TPI d’informaticien.

L’application doit permettre à l’utilisateur de configurer une population, lancer une simulation de propagation, observer visuellement les individus et suivre l’évolution des états au cours du temps.

États principaux des individus :

- `healthy` : sain
- `infected` : infecté
- `recovered` : guéri

Technologies retenues :

- **React** : interface utilisateur, état global, composants
- **p5.js** : rendu graphique dynamique de la population
- **Chart.js** : graphique d’évolution des états
- **Vite** : environnement de développement
- **Vitest** : tests unitaires
- **CSS** : mise en page et charte graphique

---

## 2. Objectifs fonctionnels principaux

L’application doit permettre de :

1. Configurer les paramètres initiaux avant le lancement.
2. Générer une population d’individus.
3. Afficher les individus dans une zone de simulation.
4. Distinguer visuellement les états sain, infecté et guéri.
5. Simuler la propagation selon la proximité et une probabilité de transmission.
6. Gérer la durée d’infection et le passage à l’état guéri.
7. Contrôler la simulation : démarrer, pause, reprendre, arrêter, réinitialiser.
8. Modifier certains paramètres pendant la simulation, uniquement si cela reste cohérent.
9. Afficher des compteurs : sains, infectés, guéris.
10. Afficher un graphique d’évolution avec Chart.js.
11. Fonctionner correctement dans un navigateur moderne.

---

## 3. Priorités de développement

### Priorité 1 — Obligatoire

- Fenêtre de configuration initiale.
- Génération de population.
- Affichage p5.js des individus.
- États sain / infecté / guéri.
- Propagation fonctionnelle.
- Contrôles start / pause / reset.
- Compteurs.
- Tests unitaires de la logique de simulation.

### Priorité 2 — Important

- Graphique Chart.js.
- Paramètres modifiables.
- Interface propre et lisible.
- Validation des valeurs utilisateur.
- Optimisation minimale des performances.

### Priorité 3 — Bonus

- Déplacement aléatoire des individus.
- Amélioration visuelle.
- Historique plus détaillé.
- Rembobinage de la simulation si le temps le permet.

Ne jamais sacrifier les priorités 1 pour développer un bonus.

---

## 4. Structure recommandée du projet

```txt
patient-zero/
├── public/
│   └── logo.png
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── SetupModal.jsx
│   │   ├── SimulationCanvas.jsx
│   │   ├── ControlsPanel.jsx
│   │   ├── StatsPanel.jsx
│   │   └── EvolutionChart.jsx
│   ├── simulation/
│   │   ├── createPopulation.js
│   │   ├── updateSimulation.js
│   │   ├── infectionRules.js
│   │   └── simulationStats.js
│   ├── constants/
│   │   ├── colors.js
│   │   └── defaultSettings.js
│   ├── styles/
│   │   ├── global.css
│   │   ├── layout.css
│   │   └── components.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

---

## 5. Responsabilités des dossiers

### `components/`

Contient uniquement les composants React de l’interface.

- `SetupModal.jsx` : fenêtre de configuration initiale.
- `SimulationCanvas.jsx` : intégration de p5.js.
- `ControlsPanel.jsx` : boutons et contrôles.
- `StatsPanel.jsx` : affichage des statistiques.
- `EvolutionChart.jsx` : graphique Chart.js.

### `simulation/`

Contient la logique métier pure.  
Ce dossier doit être testable avec Vitest sans dépendre de React, p5.js ou Chart.js.

- `createPopulation.js` : génération initiale.
- `updateSimulation.js` : évolution d’un tick de simulation.
- `infectionRules.js` : règles de transmission et guérison.
- `simulationStats.js` : calcul des compteurs.

### `constants/`

Contient les valeurs globales et configurables.

Exemple :

```js
export const DEFAULT_SETTINGS = {
  populationSize: 200,
  initialInfected: 5,
  infectionRate: 0.25,
  infectionDuration: 8,
  simulationSpeed: 1,
  infectionRadius: 20
};
```

```js
export const STATE_COLORS = {
  healthy: "#43A047",
  infected: "#E53935",
  recovered: "#1E88E5"
};
```

---

## 6. Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Composants React | PascalCase | `SimulationCanvas.jsx` |
| Fonctions | camelCase | `createPopulation()` |
| Variables | camelCase | `infectionRate` |
| Constantes | UPPER_CASE | `DEFAULT_SETTINGS` |
| Dossiers | minuscules | `simulation`, `components` |
| États internes | anglais simple | `healthy`, `infected`, `recovered` |
| Fichiers de test | `*.test.js` | `infectionRules.test.js` |

Le rapport peut être rédigé en français, mais le code doit rester en anglais pour respecter les conventions courantes de développement.

Le texte afficher sur le site web doit être en français et tout ce qui concerne le code et qui n'est pas affiché en anglais

---

## 7. Règles d’architecture importantes

### React

React doit gérer :

- l’interface ;
- les paramètres ;
- les contrôles ;
- l’état global ;
- les statistiques ;
- l’historique pour le graphique.

### p5.js

p5.js doit gérer uniquement :

- le rendu graphique ;
- le dessin des individus ;
- éventuellement l’animation visuelle.

p5.js ne doit pas contenir toute la logique métier.  
La logique métier doit rester dans `src/simulation/`.

### Chart.js

Chart.js doit uniquement afficher les données d’historique.  
Il ne doit pas calculer la simulation.

---

## 8. Règles spécifiques React + p5.js

L’intégration de p5.js dans React doit respecter les règles suivantes :

1. p5.js doit être isolé dans `SimulationCanvas.jsx`.
2. Utiliser le **mode instance** de p5.js.
3. Initialiser le sketch une seule fois avec `useEffect`.
4. Stocker l’instance p5 avec `useRef`.
5. Nettoyer l’instance avec `remove()` au démontage du composant.
6. Ne pas recréer le canvas à chaque changement de state.
7. Ne pas appeler `setState` à chaque frame dans `draw()`.
8. Utiliser `useRef` pour transmettre les données courantes au sketch.
9. React doit rester maître des paramètres et contrôles.
10. p5.js doit rester responsable du rendu.

Exemple de principe :

```jsx
const dataRef = useRef({ individuals, isRunning, speed });

useEffect(() => {
  dataRef.current = { individuals, isRunning, speed };
}, [individuals, isRunning, speed]);

useEffect(() => {
  const sketch = (p) => {
    p.setup = () => {
      p.createCanvas(800, 500);
      p.frameRate(30);
    };

    p.draw = () => {
      p.background(15, 23, 42);
      // draw individuals from dataRef.current
    };
  };

  const instance = new p5(sketch, containerRef.current);

  return () => {
    instance.remove();
  };
}, []);
```

---

## 9. Règles de simulation

Un individu doit contenir au minimum :

```js
{
  id: 1,
  x: 120,
  y: 80,
  state: "healthy",
  infectionTime: 0
}
```

Règles minimales :

- Un individu infecté peut infecter un individu sain s’il est assez proche.
- La transmission dépend de `infectionRate`.
- Un individu infecté devient guéri après `infectionDuration`.
- Un individu guéri ne redevient pas infecté dans la version de base.
- Les valeurs utilisateur doivent être validées avant le lancement.

Éviter les calculs trop coûteux avec de grandes populations.  
La population maximale doit rester raisonnable pour garantir la fluidité.

---

## 10. Gestion des performances

Règles importantes :

1. Éviter les `setState` dans la boucle p5.js `draw()`.
2. Mettre à jour les statistiques à intervalle raisonnable.
3. Limiter la population maximale.
4. Commencer avec 100 à 300 individus.
5. Éviter une comparaison exhaustive trop fréquente si la population augmente fortement.
6. Réduire la fréquence d’ajout de points au graphique si nécessaire.
7. Utiliser `p.frameRate(30)` pour stabiliser le rendu.

Objectif réaliste :

- simulation fluide pour environ 100 à 500 individus ;
- interface réactive ;
- graphique lisible.

---

## 11. Chart.js

Le graphique doit afficher trois courbes :

- Sains
- Infectés
- Guéris

Règles :

1. Les données du graphique viennent de React.
2. Le graphique ne doit pas recalculer la simulation.
3. Limiter l’historique si le nombre de points devient trop grand.
4. Utiliser des couleurs cohérentes avec les états :
   - sain : vert ;
   - infecté : rouge ;
   - guéri : bleu.

---

## 12. Charte graphique

Palette recommandée :

| Usage | Couleur | Hex |
|---|---|---|
| Sain | Vert | `#43A047` |
| Infecté | Rouge | `#E53935` |
| Guéri | Bleu | `#1E88E5` |
| Fond principal | Bleu nuit | `#0F172A` |
| Surface / cartes | Gris bleu | `#1E293B` |
| Texte principal | Blanc cassé | `#F5F5F5` |
| Texte secondaire | Gris clair | `#B0B0B0` |
| Alerte | Jaune | `#FDD835` |

L’interface doit rester lisible, cohérente et pas trop chargée.

---

## 13. Tests unitaires avec Vitest

Vitest doit être utilisé pour tester la logique métier.

### Script recommandé

Dans `package.json` :

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

### À tester en priorité

Tester les fonctions pures dans `src/simulation/` :

- `createPopulation()`
- `updateSimulation()`
- `shouldInfect()`
- `recoverIndividual()`
- `calculateStats()`

### À ne pas tester en priorité

Ne pas perdre trop de temps à tester :

- le rendu p5.js ;
- les animations ;
- Chart.js ;
- le CSS ;
- les détails visuels des composants.

### Exemples de cas de test

- Génération du bon nombre d’individus.
- Le nombre initial d’infectés est correct.
- Une infection avec probabilité 1 se produit.
- Une infection avec probabilité 0 ne se produit pas.
- Un individu infecté devient guéri après la durée prévue.
- Les statistiques comptent correctement les états.

---

## 14. Linter et qualité du code

Avant de considérer une tâche comme terminée, exécuter :

```bash
npm run lint
npm run test:run
npm run build
```

Si le script `lint` n’existe pas encore, l’ajouter avec ESLint selon la configuration Vite/React du projet.

Règles de qualité :

- pas de code mort ;
- pas de `console.log` inutile dans la version finale ;
- pas de variables non utilisées ;
- pas de duplication excessive ;
- fonctions courtes et compréhensibles ;
- commentaires seulement quand ils apportent une vraie explication.

---

## 15. Sécurité et robustesse

Même si l’application est locale/front-end, respecter les règles suivantes :

1. Ne jamais stocker de secrets dans le code.
2. Ne jamais mettre de token GitHub ou clé API dans le dépôt.
3. Valider toutes les valeurs saisies par l’utilisateur.
4. Empêcher les valeurs absurdes :
   - population négative ;
   - probabilité hors de 0 à 100 % ;
   - durée d’infection négative ;
   - infectés initiaux supérieurs à la population.
5. Prévoir des valeurs par défaut.
6. Éviter les dépendances inutiles.
7. Ne pas ajouter de bibliothèque sans justification.
8. Ne pas utiliser `dangerouslySetInnerHTML`.
9. Ne pas faire d’appel réseau inutile.
10. Garder l’application compatible navigateur moderne.

---

## 16. Accessibilité minimale

L’application doit rester utilisable et compréhensible :

- boutons avec textes clairs ;
- labels pour les sliders ;
- contraste suffisant ;
- pas seulement la couleur pour comprendre les états si possible ;
- interface lisible sur écran standard ;
- messages d’erreur simples pour valeurs invalides.
- si possible responsive pour tout les types d'écrans

---

## 17. Documentation attendue dans le code

Fais en sorte que le code sois facilement documentable avec jsdoc.

Ne pas commenter des évidences.

Bon commentaire :

```js
// La propagation est calculée uniquement à chaque tick logique,
// pas à chaque frame, afin de limiter le coût des calculs.
```

Mauvais commentaire :

```js
// Incrémente i
i++;
```

---

## 18. Définition de terminé pour une tâche

Une tâche est considérée terminée si :

1. La fonctionnalité fonctionne dans le navigateur.
2. Le code est clair et rangé au bon endroit.
3. Les valeurs utilisateur sont validées si nécessaire.
4. Les tests unitaires concernés passent.
5. Le build fonctionne.
6. Il n’y a pas d’erreur console bloquante.
7. La fonctionnalité est documentable dans le rapport TPI.

Commande finale :

```bash
npm run lint
npm run test:run
npm run build
```

---

## 19. Bonnes pratiques pour Codex

Lors d’une demande de modification :

1. Lire le contexte avant de modifier.
2. Ne pas refactoriser tout le projet sans demande explicite.
3. Faire des modifications petites et ciblées.
4. Préserver la structure existante.
5. Ne pas changer les choix technologiques sans validation.
6. Ajouter ou adapter les tests si la logique métier change.
7. Expliquer brièvement ce qui a été modifié.
8. Signaler les risques ou hypothèses.
9. Ne pas supprimer une fonctionnalité existante sans raison.
10. Garder le projet simple : priorité à la réussite du TPI.
11. A la fin de chaque actions, vérifier que tout fonctionne encore
12. Ne modifier que ce que je demande et ce qu'il faut pour le bon fonctionnement (ne change pas ce qu'il n'y a pas besoin)
13. Tu peux créer un fichier .md au même niveau que le fichier CODEX.md pour toute modification que tu fais que tout les développeur doivent savoir (dont toi). Par exemple un changement dans la charte graphique.
14. Pas d'emoji dans le code
15. Une fois que t'as finis de coder, génère les tests (des tests simple)
16. Pour les parties de code pas implémenter, ajoute des commentaire "TODO" en expliquant ce qu'il reste à faire
17. Ajoute des commentaire pour expliquer l'utilité de chaque fichiers et fonctions que tu créer et modifie.

---

## 20. Résumé technique à respecter

- **React** = interface, paramètres, contrôles, statistiques.
- **p5.js** = rendu graphique de la population.
- **Chart.js** = graphique d’évolution.
- **Vitest** = tests unitaires de la logique métier.
- **CSS** = design et layout.
- **Aucune logique métier importante ne doit être cachée dans p5.js.**
- **Éviter les mises à jour React à chaque frame.**
- **Tester les fonctions de simulation.**
- **Garder le code lisible et documentable.**
