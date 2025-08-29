# PowerShell script to convert TypeScript files to JavaScript
$ErrorActionPreference = "Stop"

function Convert-TsToJs {
    param(
        [string]$FilePath
    )
    
    Write-Host "Converting: $FilePath"
    
    # Read the file content
    $content = Get-Content -Path $FilePath -Raw
    
    # Remove TypeScript-specific syntax patterns
    $content = $content -replace 'import.*from.*\.tsx["'']', { param($match) $match.Value -replace '\.tsx', '' }
    $content = $content -replace 'import.*from.*\.ts["'']', { param($match) $match.Value -replace '\.ts', '' }
    $content = $content -replace ': React\.FC<.*?>', ''
    $content = $content -replace 'React\.FC<.*?>', ''
    $content = $content -replace ': React\.ReactNode', ''
    $content = $content -replace 'React\.ReactNode', ''
    $content = $content -replace 'interface.*?\{.*?\}', ''
    $content = $content -replace 'type.*?=.*?;', ''
    $content = $content -replace '<.*?>:', ':'
    $content = $content -replace ':\s*[A-Z][a-zA-Z]*(\[.*?\])?', ''
    $content = $content -replace ':\s*\{.*?\}', ''
    $content = $content -replace ':\s*\(.*?\)\s*=>.*?', ''
    $content = $content -replace 'useState<.*?>', 'useState'
    $content = $content -replace 'useEffect<.*?>', 'useEffect'
    $content = $content -replace 'React\.forwardRef<.*?>', 'React.forwardRef'
    $content = $content -replace '!\s*$', ''
    $content = $content -replace ' as .*?', ''
    
    # Remove empty interface/type blocks and extra lines
    $content = $content -replace '\n\s*\n\s*\n', "`n`n"
    
    # Determine new file path
    $newPath = $FilePath -replace '\.tsx$', '.jsx' -replace '\.ts$', '.js'
    
    # Write the converted content
    Set-Content -Path $newPath -Value $content -Encoding UTF8
    Write-Host "Converted to: $newPath"
}

# Convert all TypeScript files in src directory
$tsFiles = Get-ChildItem -Path "src" -Recurse -Include "*.tsx", "*.ts"

foreach ($file in $tsFiles) {
    try {
        Convert-TsToJs -FilePath $file.FullName
    }
    catch {
        Write-Host "Error converting $($file.FullName): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Conversion completed!" -ForegroundColor Green
