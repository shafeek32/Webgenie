$templatesDir = "e:\main project\website-builder-ui\website-builder-ui\templates"
$htmlFiles = Get-ChildItem -Path $templatesDir -Filter "*.html"

foreach ($file in $htmlFiles) {
    $folderName = $file.BaseName
    $targetFolder = Join-Path $templatesDir $folderName
    
    if (-not (Test-Path $targetFolder)) {
        New-Item -ItemType Directory -Path $targetFolder -Force | Out-Null
    }
    
    $targetHtml = Join-Path $targetFolder $file.Name
    $targetCss = Join-Path $targetFolder ($folderName + ".css")
    $targetJs = Join-Path $targetFolder ($folderName + ".js")
    
    if (Test-Path $file.FullName) {
        Move-Item -Path $file.FullName -Destination $targetHtml -Force
    }
    
    if (-not (Test-Path $targetCss)) { New-Item -ItemType File -Path $targetCss -Force | Out-Null }
    if (-not (Test-Path $targetJs)) { New-Item -ItemType File -Path $targetJs -Force | Out-Null }
    
    Write-Host "Organized: $folderName"
}
