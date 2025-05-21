# Task-miniProject
---

Mini note de conception
---
Pendant ce projet, j’ai eu pas mal de galères avec WSL et React Native, ce qui a un peu freiné mon avancement. En plus, j’étais en période d’examens, donc le temps a manqué pour finir tout ce que je voulais faire.

Pour la base MongoDB, comme je manquais d’espace sur ma machine, j’ai opté pour Docker, ce qui m’a bien simplifié la vie et m’a permis d’apprendre pas mal de trucs sur les conteneurs.

Côté code, j'ai pensé à quelques améliorations comme ne pas recharger toute la liste à chaque fois, mieux gérer la limite max de 20 tâches et éviter les doublons, et peut-être améliorer la pagination ou l’incrément des tâches affichées. Rien de critique, mais ça pourrait rendre l’app encore plus fluide.

Même si tout n’est pas parfait, ce projet m’a beaucoup appris et j’aimerais vraiment pouvoir retenter l’expérience en bossant avec vous si j’ai la chance d’intégrer votre équipe.



## README Backend
---
### Installation & Lancement

- **Environnement :** Ce backend tourne sous WSL (Ubuntu).

- **Pré-requis :** Node.js, npm/yarn, Docker (pour MongoDB).

### Installation :

1. Cloner le dépôt.

2. Lancer MongoDB via Docker :

docker run -d -p 27017:27017 --name mongodb mongo

Installer les dépendances :

npm install

Lancer le serveur :

npm start
L’API sera accessible sur http://localhost:3000.

Logique principale
API REST pour gérer les tâches (CRUD).

Supporte la récupération incrémentale via paramètre since.

Endpoint pour simuler l’ajout de tâches.

MongoDB utilisé comme base de données, conteneurisé avec Docker pour faciliter la gestion.

README Frontend
---
Installation & Lancement
Environnement : Windows avec React Native

Pré-requis : Node.js, npm/yarn, React Native CLI ou Expo.

Installation :
Cloner le dépôt.

Installer les dépendances :

npm install

Lancer l’application :

npm start

Expo : scanner le QR code avec Expo Go.


Logique principale
Affichage d’une liste de tâches récupérées depuis le backend.

Actualisation automatique toutes les 5 secondes.

Animation des nouvelles tâches à leur apparition.

Possibilité de simuler des ajouts côté backend via un bouton.

Gestion simple des statuts avec couleur différente selon état (todo, in_progress, done).

