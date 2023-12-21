#!/bin/bash

npm install

npm run build-linux --prod

rm ../API/Web/*

sed -i 's/\/dist\/bundle.js/\.\/bundle.js/g' dist/index.html

cp -R dist/* ../API/Web

cp electron-package.json dist/package.json

npm run build:electron

npm run deploy-linux

echo REACT_APP_WATCHLIST_ENV=LOCAL > .env

echo Build is complete. The build is located under release_builds