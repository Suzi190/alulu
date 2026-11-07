# 用法：.\push.ps1 -RepoUrl https://github.com/你的用户名/你的仓库.git
param(
  [Parameter(Mandatory = $true)][string]$RepoUrl
)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (-not (Test-Path '.git')) { git init | Out-Null }

$remotes = git remote
if ($remotes -notcontains 'origin') {
  git remote add origin $RepoUrl
} else {
  git remote set-url origin $RepoUrl
}

git add -A
git -c user.email=dev@lulu.local -c user.name=lulu commit -m "update: rebuild apk" 2>$null | Out-Null
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "已推送。打开 https://github.com -> 你的仓库 -> Actions -> Build Lunara AI APK -> Artifacts 下载 lunara-ai-apk.zip" -ForegroundColor Green
