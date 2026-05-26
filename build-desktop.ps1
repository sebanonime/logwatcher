#Requires -Version 5.1
<#
.SYNOPSIS
    Build script for LogWatcher Desktop (Electron + .NET sidecar)

.DESCRIPTION
    Steps:
      1. Build the React frontend  (logwatcher-frontend)  → LogWatcher.Web/wwwroot
      2. Publish  LogWatcher.Web   as self-contained win-x64 → publish/LogWatcher.Web
      3. Package  logwatcher-desktop via electron-builder   → dist/win-unpacked
      4. Zip the result                                     → dist/LogWatcher-Desktop-win-x64.zip

.EXAMPLE
    .\build-desktop.ps1
    .\build-desktop.ps1 -SkipFrontend   # skip step 1 if frontend did not change
    .\build-desktop.ps1 -SkipBackend    # skip step 2 if .NET backend did not change
#>
param(
    [switch]$SkipFrontend,
    [switch]$SkipBackend
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root      = $PSScriptRoot
$Frontend  = Join-Path $Root 'logwatcher-frontend'
$WebProj   = Join-Path $Root 'LogWatcher.Web\LogWatcher.Web.csproj'
$PublishOut = Join-Path $Root 'publish\LogWatcher.Web'
$Desktop   = Join-Path $Root 'logwatcher-desktop'
$DistDir   = Join-Path $Desktop 'dist'
$ZipOut    = Join-Path $DistDir 'LogWatcher-Desktop-win-x64.zip'

function Step($n, $msg) {
    Write-Host "`n[Step $n] $msg" -ForegroundColor Cyan
}

function Die($msg) {
    Write-Host "`nERROR: $msg" -ForegroundColor Red
    exit 1
}

# ── Step 1 : Frontend ────────────────────────────────────────────────────────
if (-not $SkipFrontend) {
    Step 1 "Build React frontend  →  LogWatcher.Web/wwwroot"

    if (-not (Test-Path (Join-Path $Frontend 'node_modules'))) {
        Write-Host "  Installing npm dependencies..."
        Push-Location $Frontend
        npm ci
        if ($LASTEXITCODE -ne 0) { Pop-Location; Die "npm ci failed in logwatcher-frontend" }
        Pop-Location
    }

    Push-Location $Frontend
    npm run build
    $rc = $LASTEXITCODE
    Pop-Location
    if ($rc -ne 0) { Die "Frontend build failed" }
} else {
    Write-Host "[Step 1] Skipped (SkipFrontend)" -ForegroundColor DarkGray
}

# ── Step 2 : .NET backend ────────────────────────────────────────────────────
if (-not $SkipBackend) {
    Step 2 "Publish LogWatcher.Web  (self-contained win-x64)  →  publish/LogWatcher.Web"

    dotnet publish $WebProj `
        -c Release `
        -r win-x64 `
        --self-contained true `
        -p:PublishSingleFile=true `
        -p:TargetFramework=net10.0 `
        -o $PublishOut

    if ($LASTEXITCODE -ne 0) { Die "dotnet publish failed" }
} else {
    Write-Host "[Step 2] Skipped (SkipBackend)" -ForegroundColor DarkGray
}

if (-not (Test-Path (Join-Path $PublishOut 'LogWatcher.Web.exe'))) {
    Die "publish\LogWatcher.Web\LogWatcher.Web.exe not found — run without -SkipBackend at least once"
}

# ── Step 3 : Electron package ────────────────────────────────────────────────
Step 3 "Package Electron app  →  dist/win-unpacked"

if (-not (Test-Path (Join-Path $Desktop 'node_modules'))) {
    Write-Host "  Installing npm dependencies..."
    Push-Location $Desktop
    npm ci
    if ($LASTEXITCODE -ne 0) { Pop-Location; Die "npm ci failed in logwatcher-desktop" }
    Pop-Location
}

# Disable code signing (no certificate — avoids winCodeSign symlink error on Windows)
$env:CSC_IDENTITY_AUTO_DISCOVERY = 'false'
$env:WIN_CSC_LINK                = ''

Push-Location $Desktop
npm run package
$rc = $LASTEXITCODE
Pop-Location

if ($rc -ne 0) { Die "electron-builder packaging failed" }

$unpacked = Join-Path $DistDir 'win-unpacked'
if (-not (Test-Path $unpacked)) { Die "dist\win-unpacked not found after packaging" }

# ── Step 4 : Zip ─────────────────────────────────────────────────────────────
Step 4 "Zip  dist/win-unpacked  →  $ZipOut"

if (Test-Path $ZipOut) { Remove-Item $ZipOut -Force }
Compress-Archive -Path (Join-Path $unpacked '*') -DestinationPath $ZipOut
$sizeMb = [math]::Round((Get-Item $ZipOut).Length / 1MB, 1)

Write-Host "`n✓ Done!  $ZipOut  ($sizeMb MB)" -ForegroundColor Green
Write-Host "  Extract anywhere and run: 'LogWatcher Desktop.exe'" -ForegroundColor Green
