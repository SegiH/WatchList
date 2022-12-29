@echo off
SET BuildPath=WatchList-Build
IF EXIST %BuildPath% rd /s /q %BuildPath% && mkdir %BuildPath%
mkdir %BuildPath%\Web
xcopy /E www\*.* %BuildPath%\Web
xcopy backend\*.* %BuildPath%
cd %BuildPath%
npm install