#/!bin/bash
#angular init
bower install
#server side
npm i -g bower
npm i -g npm-check-updates
npm-check-updates -u
npm install
node server.js
