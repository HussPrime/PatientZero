# Interface de base Patient Zero

## Objectif de la tâche

Cette étape met en place le design visible de l'application Patient Zero en React. La propagation de l'épidémie, le moteur de simulation complet et l'intégration p5.js avancée ne sont pas encore implémentés.

## Analyse de la maquette

Les fichiers du dossier `Mockup` ont été consultés avant le développement:

- `Mockup/Patient Zero.html`: structure HTML générale, fond sombre, police Inter et viewport desktop.
- `Mockup/app.jsx`: référence principale pour le dashboard, la palette, les cartes statistiques, la zone de simulation, le graphique, les contrôles, les paramètres en direct et la configuration.
- `Mockup/tweaks-panel.jsx`: observé uniquement comme outil de prototype, non repris dans l'application.

L'interface reprend l'organisation de la maquette: header sombre en haut, cartes statistiques, grande zone de simulation, graphique d'évolution, panneau de contrôle à droite et configuration en bas.

## Fichiers créés ou modifiés

Fichiers React créés:

- `src/components/Header.jsx`
- `src/components/StatsPanel.jsx`
- `src/components/SimulationCanvas.jsx`
- `src/components/EvolutionChart.jsx`
- `src/components/ControlsPanel.jsx`
- `src/components/LiveSettingsPanel.jsx`
- `src/components/SetupPanel.jsx`
- `src/components/Legend.jsx`
- `src/components/DashboardLayout.jsx`
- `src/components/RangeField.jsx`

Fichiers CSS créés ou modifiés:

- `src/styles/index.css`
- `src/styles/global.css`
- `src/styles/layout.css`
- `src/styles/components.css`

Fichier principal modifié:

- `src/App.jsx`

Documentation créée:

- `docs/interface-base.md`

## Organisation de l'interface

`DashboardLayout` organise l'écran en trois niveaux:

1. Le `Header` avec le logo, le nom Patient Zero, le sous-titre, le statut et le tick temporaire.
2. Le contenu principal avec les cartes statistiques, la zone de simulation, le graphique et la colonne de contrôle.
3. Le panneau `SetupPanel` pour configurer les paramètres avant lancement.

Le layout est pensé pour desktop, comme la maquette. Il reste tout de même raisonnablement responsive sous environ 1240 px.

## Composants principaux

`Header` affiche l'identité de l'application, le statut visuel et un compteur de tick temporaire.

`StatsPanel` affiche quatre cartes: population, sains, infectés et guéris. Les couleurs suivent la charte: vert, rouge, bleu et neutre.

`SimulationCanvas` affiche un faux canvas sombre avec une grille, sans points fictifs. La zone est prête à recevoir les individus réels générés par la simulation.

`EvolutionChart` utilise Chart.js, sans historique fictif. Il affiche une zone de graphique vide en attente des futures données de simulation.

`ControlsPanel` contient Pause, Stop, Réinitialiser et le choix de vitesse x1 à x5. Les boutons changent seulement l'état visuel de base.

`LiveSettingsPanel` contient les sliders de probabilité de transmission et de rayon d'infection.

`SetupPanel` contient la configuration de population et d'épidémiologie, ainsi que les boutons de réinitialisation des paramètres et de démarrage.

## Données temporaires

Les points fictifs et l'historique fictif ont été retirés.

Les statistiques visibles sont calculées depuis les paramètres locaux: population totale, patients zéro, sains et guéris à zéro.

Ces données pourront être remplacées plus tard par:

- les individus générés par la classe `Population`;
- les statistiques réelles de simulation;
- l'historique réel alimenté à chaque tick logique.

## Future intégration p5.js

La zone `SimulationCanvas` est volontairement un placeholder HTML/CSS. Plus tard, elle pourra être remplacée par un vrai canvas p5.js en mode instance, conformément aux règles du fichier `CODEX.md`.

La logique métier devra rester dans `src/simulation/`. p5.js devra seulement dessiner les individus reçus depuis React.

## Future connexion Chart.js

Chart.js est déjà utilisé dans `EvolutionChart`, mais avec des données temporaires. Plus tard, les tableaux `healthy`, `infected` et `recovered` devront venir de l'historique réel de simulation stocké côté React.

Chart.js ne devra pas calculer la simulation. Il devra seulement afficher les données.

## Commandes exécutées

Commandes exécutées en fin de tâche:

```bash
npm run lint
npm run test:run
npm run build
npm run dev -- --host 127.0.0.1
```

Résultats:

- `npm run lint`: passe.
- `npm run test:run`: passe, 2 fichiers de tests et 7 tests réussis.
- `npm run build`: passe, build Vite généré correctement.
- `npm run dev -- --host 127.0.0.1`: serveur lancé sur `http://127.0.0.1:5174/PatientZero/` car le port 5173 était déjà utilisé.

## À faire ensuite

- Brancher la génération réelle de `Population` sur les paramètres.
- Remplacer les points temporaires par les vrais individus.
- Intégrer p5.js dans `SimulationCanvas`.
- Alimenter le graphique avec l'historique réel.
- Ajouter la vraie logique de start, pause, stop et reset.
- Ajouter la validation complète des paramètres utilisateur.
