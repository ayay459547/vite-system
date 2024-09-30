call node -v

call npm -v

@echo off
set root=%cd%

cd %root%\ux-dev
REM #### install vue depenedency #######
call npm install

REM #### build vue project #######

call npm run build-only:pro

REM #### copy vue file to ipassweb #######
:: copy /y %root%\dist\*.* %root%\demo\*.*

:: rd /s /q %root%\demo\static
:: xcopy /y /i /S %root%\dist\static\* %root%\demo\static

REM delete unused portal folder from vue
:: rd /s /q %root%\dist
