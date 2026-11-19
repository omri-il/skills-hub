# Renders deploy/og/og.html into assets/og.png (1200x630), the picture a shared link shows.
# Run from the repo root: powershell -File deploy/og/make_og.ps1
$chrome = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw "Chrome not found" }
$src = (Resolve-Path "deploy/og/og.html").Path
$out = Join-Path (Resolve-Path "assets").Path "og.png"
$profile = Join-Path $env:TEMP "og-chrome-profile"
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --user-data-dir="$profile" --window-size=1200,630 --screenshot="$out" "file:///$($src -replace '\\','/')" | Out-Null
Start-Sleep -Seconds 2
Get-Item $out | Select-Object Name, Length
