#!/bin/bash

if ! command -v wine64 &> /dev/null
then
    echo "wine64 could not be found and is required to build the Windows WatchList desktop app. Please install it using your package manager"
    exit 1
fi

npm install

npm run build-linux --prod

rm ../API/Web/*

sed -i 's/\/dist\/bundle.js/\.\/bundle.js/g' dist/index.html

cp -R dist/* ../API/Web

cp electron-package.json dist/package.json

npm run build:electron

npm run deploy-win

echo REACT_APP_WATCHLIST_ENV=LOCAL > .env

echo Build is complete. The build is located under release_builds
