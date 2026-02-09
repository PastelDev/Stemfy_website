param(
    [string]$OutputDir = (Join-Path $PSScriptRoot '..\\backups')
)

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$resolvedOutput = [System.IO.Path]::GetFullPath((Join-Path $root $OutputDir))

$sourceCandidates = @(
    (Join-Path $root 'posts')
    (Join-Path $root 'admin\\data')
    (Join-Path $root 'admin\\uploads')
)

$sources = @()
foreach ($candidate in $sourceCandidates) {
    if (Test-Path $candidate) {
        $sources += (Resolve-Path $candidate).Path
    }
}

if ($sources.Count -eq 0) {
    Write-Error 'No content directories found to back up.'
    exit 1
}

if (-not (Test-Path $resolvedOutput)) {
    New-Item -ItemType Directory -Path $resolvedOutput -Force | Out-Null
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$archivePath = Join-Path $resolvedOutput "stemfy-content-$timestamp.zip"

Compress-Archive -Path $sources -DestinationPath $archivePath -Force
Write-Output "Backup created: $archivePath"
