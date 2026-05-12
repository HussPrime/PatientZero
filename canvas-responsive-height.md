# Hauteur responsive du canvas

## Objectif

Modifier uniquement la hauteur de la zone p5.js sur tablette et mobile, sans changer la hauteur du graphique ni le layout desktop.

## Ce qui a ete fait

- Ajout d'une variable CSS dediee au canvas: `--simulation-canvas-height`.
- Conservation de la valeur existante sur desktop via le fallback `--visual-panel-body-height`.
- Definition d'une hauteur tablette responsive pour le canvas: `min(72svh, 680px)`.
- Definition d'une hauteur mobile responsive pour le canvas: `min(72svh, 620px)`.

## Probleme rencontre

La hauteur du canvas utilisait `--visual-panel-body-height`, une variable partagee avec le graphique Chart.js. Modifier directement cette variable aurait aussi change la hauteur du graphique, ce qui ne respectait pas la demande.

## Solution apportee

La classe `.simulation-canvas` utilise maintenant:

```css
min-height: var(--simulation-canvas-height, var(--visual-panel-body-height, 520px));
```

Ainsi, seule la zone p5.js change de hauteur quand `--simulation-canvas-height` est definie dans les media queries. Le graphique continue d'utiliser `--visual-panel-body-height`.

## Correction mobile

La valeur mobile initiale etait trop basse et ne produisait pas l'effet attendu. Elle a ete remplacee par `min(72svh, 620px)`, ce qui rend la zone de simulation plus haute sur mobile tout en restant inferieure a la hauteur de l'ecran. Sur mobile, `.simulation-canvas` applique aussi cette valeur en `height` et en `min-height` pour que p5.js recalcule une taille de conteneur visible et stable.

## Correction tablette

La valeur tablette fixe `360px` etait egalement trop basse. Elle a ete remplacee par `min(72svh, 680px)` afin que la zone p5.js soit plus haute sur tablette, tout en restant sous la hauteur visible de l'ecran.

## Fichiers modifies

- `PatientZero/src/styles/components.css`
- `PatientZero/src/styles/layout.css`
