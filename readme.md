# Event Sourcing My Poll

Projet de démonstration de l'*Event Sourcing* s'appuyant sur [Eventric](https://github.com/efacilitation/eventric) et [Socket.IO](https://socket.io)

## Prérequis

Ce projet s'appuie sur [node](https://nodejs.org/en/) et son gestionnaire de packages [npm](https://www.npmjs.com). Il peut donc s'exécuter au choix sur Windows, Mac OS ou Linux.

Se référer à la [page de téléchargement](https://nodejs.org/en/download/) si node n'est pas installé sur la machine.

Optionnellement le transpiller [Coffee Script](http://coffeescript.org) peut être installé pour développer en `CoffeeScript`. Il est cependant tout à fait possible de développer directement en javascript.

## Installation

Après avoir cloné le répository, installer les dépendances via `npm` : 
```
npm install
```

Installation du serveur web pour les ressources statiques :
```
npm install -g http-server
```

`http-server` est un serveur de ressources statiques, il est ici utilisé pour donner l'accès aux fichiers statiques `css`, `javascript` et `html`. Ce package n'est pas ajouté en tant que dépendance du projet dans le fichier `package.json` car n'importe quel serveur peut faire l'affaire. Le code est même très simple à adapter pour ne pas avoir besoin de serveur si l'on souhaite simplement expérimenter l'*Event Sourcing* en local.

## Démarrage

Il faut démarrer séparément le server web qui est utilisé pour servir les fichiers statiques (CSS, Javascript, Vues) et l'application node.

### 1. Démarrage de l'application node

```node myApp.js```

### 2. Démarrage du serveur web

```http-server -d false```

### 3. Tester

http://127.0.0.1:8080/#!/

http://127.0.0.1:8080/#!/admin

### 4. Modifier

A vous de jouer !

## Informations complémentaires

L'application `node` est développée en `Coffee Script` et transpilée en Javascript. Il est cependant tout à fait possible d'exploiter directement le fichier `myApp.js` pour ceux qui ne souhaitent pas s'encombrer du `myApp.coffee`.