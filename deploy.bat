@echo off
IF EXIST WatchList-Build rd /s /q WatchList-Build && mkdir WatchList-Build
mkdir WatchList-Build\Web
xcopy /E www\*.* WatchList-Build\Web
xcopy backend\*.* WatchList-Build
cd WatchList-Build
npm install