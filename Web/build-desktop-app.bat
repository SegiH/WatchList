@echo off
ECHO Checking that ENV was passed....

SET ENV=%1

IF "%ENV%" == "" (
     SET ENV=PROD
)

IF NOT "%ENV%" == "LOCAL" (
      IF NOT "%ENV%" == "PROD" (
           echo Please specify LOCAL OR PROD
           exit /b 1
      )   
)

echo Passed....
echo.

SET REACT_APP_WATCHLIST_ENV=PROD

echo REACT_APP_WATCHLIST_ENV=%REACT_APP_WATCHLIST_ENV% > .env

echo Checking that src\assets\config.json does not point to localhost....
IF "%ENV%" == "PROD" (
    REM type src\assets\config.json | find ""

    >nul find "localhost" .env && (
         echo Error! Cannot deploy to prod with an API URL that points to localhost. Please check the value of REACT_APP_PROJECTLOG_ENV in .env
         exit /b 1
    )
)

IF NOT EXIST node_modules\nul (
     echo Installing dependencies...
     echo.
     cmd /c npm install
)

echo Building app...
echo.
cmd /c npm run build-win

IF %ERRORLEVEL% == 1 (
     echo An error occurred building the app. Aborting....
     exit /b 1
)

cmd /c IF EXIST ..\\API\\Web\\NUL (
     echo Deleting ..\\API\\Web...
     echo.
     rd /s /q ..\\API\\Web
)

echo Creating ..\\API\\Web...
echo.
cmd /c mkdir ..\\API\\Web

cd dist

echo Replacing /dist/bundle.js with ./bundle.js in index.html...
echo.
cmd /c powershell -Command "(gc dist/index.html) -replace '/dist/bundle.js', './bundle.js' | Out-File -encoding ASCII index.html"

echo Renaming bundle.js...
echo.

REM Get name of bundle file that has the number in front of it (not bundle.js) ex 185.bundle.js
dir /b *bundle.js | findstr /v /b "bundle.js" > out.txt
set /p bundlefile=<out.txt

REM Rename the file if the destination file doesn't exist already
IF EXIST dist%bundlefile% (
     echo Deleting dist%bundlefile%...
     echo.
     DEL dist%bundlefile%
)

IF NOT EXIST dist%bundlefile% (
     IF EXIST "%bundlefile%" (
          echo Renaming  %bundlefile% to dist%bundlefile%...
          echo.
          REN %bundlefile% dist%bundlefile%
     )
)

REM DELETE temp file and temp environment variable
IF EXIST out.txt DEL out.txt
IF EXIST bundle.js.LICENSE.txt DEL bundle.js.LICENSE.txt

SET bundlefile=

cd ..

echo Copying dist\\*.* to ..\\API\\Web...
echo.
cmd /c xcopy /E /Q /Y dist\\*.* ..\\API\\Web

cmd /c cd ..\\API

echo Installing API dependencies...
echo.
cmd /c npm install

REM Perform steps to build Electron app
echo Copying electron-package.json to dist\package.json...
echo.

cmd /c copy electron-package.json dist\package.json

echo Building electron project...
echo.
cmd /c npm run build:electron


echo Creating Electron package...
echo.

cmd /c npm run deploy-win
REM Electron end

echo REACT_APP_WATCHLIST_ENV=LOCAL > .env

echo Build is complete. The build is located under release_builds