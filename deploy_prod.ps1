# Import the secrets
. ./secrets.ps1

$hostname = $env:PRODUCTION_SERVER
$appPath = $env:APP_PATH
$distPath = $env:DIST_PATH
$userName = $env:USER_NAME

$projectDirectory = $PSScriptRoot

Set-Location -Path $projectDirectory

Write-Host "Build Project With Prod Configuration - [STARTED]"
    Start-Process "npm" -ArgumentList "run build-prod" -NoNewWindow -Wait
Write-Host "Build Project With Prod Configuration - [FINISHED]"

Write-Host "Removing previous files on server - [STARTED]"
    Start-Process "ssh" -ArgumentList "$userName@$hostname ""rm -rf $appPath*""" -NoNewWindow -Wait
Write-Host "Removing previous files on server - [FINISHED]"


Write-Host "Moving Dist to Production server - [STARTED]"
    Start-Process "scp" -ArgumentList "-r $projectDirectory$distPath* $userName@${hostname}:$appPath" -NoNewWindow -Wait
Write-Host "Moving Dist to Production server - [FINISHED]"
