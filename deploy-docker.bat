@echo off
SET BuildPath=WatchList-Build
SET DockerPath=%BuildPath%\docker
IF EXIST %BuildPath% rd /s /q %BuildPath% && mkdir %BuildPath%
mkdir %DockerPath%\
mkdir %DockerPath%\Web

REM Copy all docker specific files to %DockerPath%
xcopy backend\Dockerfile %DockerPath%
xcopy backend\package*.json %DockerPath%
xcopy backend\watchlistbackend.js %DockerPath%
xcopy /E www\*.* %DockerPath%\Web

REM Copy build files to %BuildPath%
xcopy backend\watchlist.yml %BuildPath%

cd %DockerPath%

npm install

cd ..