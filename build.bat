@echo off

@REM 安專前端專案
call npm install --force
echo.
echo Install executed.

@REM 打包前端專案
call npm run build-only:pro || echo Build command encountered warnings but continued.
echo.
echo Build command executed.

if %errorlevel% neq 0 (
    echo [31m[Error][0m Build failed with error code %errorlevel%    
    pause
    exit /b %errorlevel%
)

@REM 設定 root 為當前腳本所在的目錄
@REM set root=%cd%
set root=%~dp0

@REM 移除路徑結尾的反斜線（以防萬一）
set root=%root:~0,-1%

@REM 檢查 root 是否存在
if not exist "%root%" (
    echo [31m[Error][0m root not find: %root%
    pause
    exit /b 1
)

@REM 複製檔案到 dist
echo.
echo [Info] copy Vue to dist
if not exist "%root%\demo\" (
    echo [31m[Error][0m not find demo: %root%\demo
    mkdir "%root%\demo"
)
if not exist "%root%\dist\" (
    echo [31m[Error][0m not find dist: %root%\dist
    mkdir "%root%\dist"
)

copy /y "%root%\demo\*.*" "%root%\dist\"

@REM 刪除舊的 static 資料夾
if exist "%root%\dist\static" (
    echo [Info] delete static...
    rd /s /q "%root%\dist\static"
)
@REM 複製新的 static 資料夾
if exist "%root%\demo\static" (
    echo [Info] copy static to dist...
    xcopy /y /i /s "%root%\demo\static\*" "%root%\dist\static"
) else (
    echo [Warning] static not find: %root%\demo\static
)

@REM 刪除舊的 font 資料夾
if exist "%root%\dist\font" (
    echo [Info] delete font...
    rd /s /q "%root%\dist\font"
)
@REM 複製新的 font 資料夾
if exist "%root%\demo\font" (
    echo [Info] copy font to dist...
    xcopy /y /i /s "%root%\demo\font\*" "%root%\dist\font"
) else (
    echo [Warning] font not find: %root%\demo\font
)

echo.
echo [33m[Info]success[0m
pause
