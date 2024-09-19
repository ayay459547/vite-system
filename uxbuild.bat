call node -v

call npm -v

@echo off
set root=%cd%

cd %root%\ux-dev
REM #### install vue depenedency
call npm install

REM #### build vue project #######

call npm run build-only:pro

REM #### copy vue file to ipassweb #######
REM #### copy /y %root%\demo\portal\*.* %root%\dist\*.*

REM #### rd /s /q %root%\dist\static
REM #### xcopy /y /i /S %root%\demo\portal\static\* %root%\dist\static

REM delete unused portal folder from vue
REM #### rd /s /q %root%\demo\portal
