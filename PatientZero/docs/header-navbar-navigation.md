# Header, navbar et navigation des sections

## Objectif

Cette modification ajoute une navigation principale dans le header de l'application Patient Zero.

Le but est de permettre a l'utilisateur de se déplacer rapidement entre les parties importantes de l'interface :

- Statistiques
- Simulation
- Graphique
- Contrôles
- Paramètres en direct
- Configuration de la simulation

La navigation doit rester lisible sur desktop, utilisable sur mobile, et donner un retour visuel clair lorsque l'utilisateur arrive sur une section.

## Fichiers modifiés

- `src/components/Header.jsx`
- `src/components/DashboardLayout.jsx`
- `src/components/StatsPanel.jsx`
- `src/styles/layout.css`
- `src/styles/global.css`
- `src/utils/sectionNavigation.js`

## Navbar du header

La navbar a été ajoutée dans `Header.jsx`.

Elle est basée sur une liste `NAVIGATION_ITEMS`, ce qui évite de dupliquer manuellement les liens dans le JSX.

Chaque entrée contient :

- `href` : l'ancre de la section ciblée
- `label` : le texte affiché dans le bouton de navigation

Exemple :

```js
{ href: "#simulation", label: "Simulation" }
```

Les boutons affichés dans le header permettent de rejoindre les sections suivantes :

- `#stats`
- `#simulation`
- `#chart`
- `#controls`
- `#live-settings`
- `#setup`

## Sections et ancres

Les ancres ont été ajoutées dans `DashboardLayout.jsx`.

Chaque grande zone du dashboard possède maintenant un `id` stable :

- `stats`
- `simulation`
- `chart`
- `controls`
- `live-settings`
- `setup`

Ces identifiants sont utilisés par la navbar et par le système de mise en avant.

## Scroll centré

Au départ, les liens utilisaient seulement le comportement natif des ancres HTML.

Ensuite, le besoin a changé : lorsqu'un bouton du header est cliqué, la section doit arriver au centre de l'écran.

Pour cela, un utilitaire a été créé :

```txt
src/utils/sectionNavigation.js
```

Il expose les fonctions :

```js
centerAndHighlightSection(sectionId)
highlightElement(target)
```

`centerAndHighlightSection` fait trois choses :

1. Met a jour l'URL avec l'ancre correspondante.
2. Centre la section avec `scrollIntoView({ block: "center" })`.
3. Ajoute temporairement une classe CSS de mise en avant.

`highlightElement` sert a relancer la meme animation sur un élément précis sans forcément passer par une section complète.

## Scroll smooth

Le scroll smooth global a été activé dans `global.css` avec :

```css
:root {
  scroll-behavior: smooth;
}
```

Le scroll déclenché en JavaScript utilise aussi :

```js
behavior: "smooth"
```

Cela permet d'avoir un déplacement fluide, que la navigation soit déclenchée par une ancre ou par la fonction JavaScript.

## Mise en avant des sections

Quand une section est atteinte depuis la navbar, elle reçoit temporairement la classe :

```css
is-section-highlighted
```

Cette classe déclenche les animations de mise en avant.

Le système ne dépend plus de `:target` pour les animations principales. Cela évite les problèmes de surbrillance qui ne se relance pas lorsque l'utilisateur reclique sur la même ancre.

La mise en avant reprend volontairement le style du hover existant :

- légère élévation de la section ;
- bordure plus visible ;
- ombre douce ;
- couleur de l'icône identique au hover du panneau.

Les couleurs d'icônes sont cohérentes avec les panneaux :

- Simulation : bleu
- Graphique : vert
- Contrôles : jaune
- Paramètres en direct : bleu
- Configuration : rouge

## Durée des animations

Deux animations principales sont utilisées :

- `section-target` : léger mouvement de la section
- `panel-target-highlight` : effet visuel du panneau

Le mouvement de section a été rallongé pour être plus doux.

La durée utilisée est :

```css
2200ms
```

La mise en avant visuelle du panneau dure :

```css
1800ms
```

La classe `is-section-highlighted` est retirée automatiquement après `2200ms`.

## Clic sur une section

Une autre demande était de centrer la section aussi lorsqu'on clique directement dessus.

Cela a été ajouté dans `DashboardLayout.jsx`.

Le comportement ne se déclenche pas si l'utilisateur clique sur un élément interactif interne, par exemple :

- bouton
- input
- slider
- canvas
- lien
- textarea

Cela évite de casser les contrôles de simulation ou les paramètres.

## Clic sur une carte statistique

Les statistiques sont un cas particulier, car la section `stats` contient quatre cartes :

- Population
- Sains
- Infectés
- Guéris

Quand l'utilisateur clique sur le bouton `Statistiques` de la navbar, la section complète est mise en avant. Les quatre cartes statistiques sont donc animées ensemble.

Quand l'utilisateur clique directement sur une seule carte statistique, seule cette carte reçoit la classe temporaire `is-section-highlighted`.

Ce comportement est géré dans `StatsPanel.jsx`.

Le clic sur une carte appelle :

```js
highlightElement(event.currentTarget)
```

Le clic utilise aussi :

```js
event.stopPropagation()
```

Cela empêche le clic de remonter jusqu'a la section `stats` dans `DashboardLayout.jsx`. Sans cela, cliquer sur `Population` déclencherait aussi la mise en avant de `Sains`, `Infectés` et `Guéris`.

## Responsive mobile

Sur desktop, l'ordre des boutons de navigation reste celui du composant React.

Sur mobile, l'ordre visuel est changé uniquement en CSS avec `order`.

L'ordre mobile demandé est :

1. Statistiques
2. Contrôles
3. Direct
4. Simulation
5. Graphique
6. Paramètres

La navbar mobile reste horizontalement scrollable.

Pour rendre ce scroll explicite :

- une scrollbar visible est affichée ;
- le texte `Faire défiler` apparaît sous la navbar.

## Problèmes rencontrés et résolutions

### 1. La surbrillance restait affichée indéfiniment

Au début, la mise en avant utilisait uniquement `:target`.

Problème :

- une section ciblée par l'URL reste `:target` tant que l'ancre ne change pas ;
- certaines propriétés visuelles pouvaient donc rester actives.

Résolution :

- remplacer l'effet permanent par une animation temporaire ;
- faire revenir les styles a leur état normal a la fin de l'animation.

### 2. L'effet ne correspondait pas exactement au hover

Problème :

- la section était mise en avant, mais l'icône du panneau ne reprenait pas la même couleur que pendant le hover.

Résolution :

- ajouter des animations spécifiques par type de panneau ;
- reprendre les mêmes couleurs que les règles hover existantes.

### 3. Le bouton restait bleu sur mobile

Problème :

- sur mobile, certains navigateurs conservent l'état `:hover` après un tap ;
- le bouton pouvait donc rester visuellement actif.

Résolution :

- désactiver l'effet hover pour les écrans tactiles avec :

```css
@media (hover: none) and (pointer: coarse)
```

- garder seulement un état `:active` discret pendant l'appui.

### 4. L'état d'appui mobile était trop visible

Problème :

- le premier style `:active` mobile utilisait encore un bleu trop fort et un déplacement vertical ;
- visuellement, cela paraissait moins propre.

Résolution :

- remplacer l'effet par un fond gris discret ;
- supprimer le mouvement vertical pendant l'appui.

### 5. La mise en avant ne fonctionnait plus après le scroll centré

Problème :

- après l'ajout du scroll centré, le code utilisait `pushState` puis `scrollIntoView` ;
- `:target` n'était plus fiable pour relancer l'animation ;
- recliquer sur le même bouton ne relançait pas toujours la surbrillance.

Résolution :

- créer `sectionNavigation.js` ;
- ajouter une classe temporaire `is-section-highlighted` au clic ;
- retirer puis réappliquer la classe pour relancer l'animation ;
- stocker le timer avec `WeakMap` pour éviter les conflits lors de clics répétés.

### 6. Cliquer une carte statistique animait toutes les statistiques

Problème :

- la section `stats` possède un gestionnaire de clic pour centrer et mettre en avant la section ;
- les cartes `Population`, `Sains`, `Infectés` et `Guéris` sont a l'intérieur de cette section ;
- un clic sur une carte remontait donc au parent et animait les quatre cartes.

Résolution :

- ajouter un gestionnaire de clic spécifique dans `StatsPanel.jsx` ;
- appeler `event.stopPropagation()` pour bloquer la remontée du clic ;
- utiliser `highlightElement(event.currentTarget)` pour appliquer l'animation seulement a la carte cliquée ;
- conserver `centerAndHighlightSection("stats")` pour la navbar afin que le bouton `Statistiques` continue d'animer les quatre cartes.

## Vérifications effectuées

Les commandes suivantes ont été exécutées pendant les modifications :

```bash
npm run lint
npm run test:run
npm run build
```

Les tests existants passent.

Le build fonctionne.

Vite affiche seulement un avertissement connu sur la taille du bundle, sans bloquer la compilation.

## Notes pour les prochains développements

- Si une nouvelle section principale est ajoutée, il faut ajouter son `id` dans `DashboardLayout.jsx`.
- Il faut aussi ajouter une entrée dans `NAVIGATION_ITEMS` dans `Header.jsx`.
- Si cette nouvelle section a un panneau avec une icône, prévoir une animation de couleur cohérente dans `layout.css`.
- Ne pas revenir a un système uniquement basé sur `:target` pour la surbrillance, car il ne relance pas toujours l'animation lors de clics répétés.
- Pour les sous-éléments cliquables d'une section, utiliser `highlightElement` et stopper la propagation si le parent possède déjà un clic de mise en avant.
