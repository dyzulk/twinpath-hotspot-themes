# Deploy Script for Twinpath Hotspot
# This script copies production files to a 'dist' folder for easy MikroTik upload.

$Source = Get-Location
$Dest = Join-Path (Split-Path $Source -Parent) "dist\hotspot"

# Files/Folders to exclude from production
$ExcludeFiles = @("README.md", "LICENSE", "deploy.ps1", ".gitignore")
$ExcludeDirs = @(".git")

Write-Host "🚀 Preparing production folder: $Dest" -ForegroundColor Cyan

# Create destination if it doesn't exist
if (!(Test-Path $Dest)) {
    New-Item -ItemType Directory -Path $Dest -Force | Out-Null
}

# Use Robocopy for efficient syncing (it's faster and handles exclusions well)
# /MIR: Mirror directory tree
# /XD: Exclude Directories
# /XF: Exclude Files
# /NFL: No File List (cleaner output)
# /NDL: No Directory List (cleaner output)
robocopy $Source $Dest /MIR /XD $ExcludeDirs /XF $ExcludeFiles /R:3 /W:5 /NFL /NDL /NP

$TargetName = Split-Path $Dest -Leaf
Write-Host "✅ Deployment ready! You can now drag & drop 'dist\$TargetName' to MikroTik." -ForegroundColor Green
