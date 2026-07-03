param(
    [string]$inputFile,
    [string]$outputFile,
    [string]$bgColor
)

Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile($inputFile)
$transparentColor = [System.Drawing.Color]::White

if ($bgColor -eq "black") {
    $transparentColor = [System.Drawing.Color]::Black
}

$img.MakeTransparent($transparentColor)

$img.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()

Write-Host "Processed $inputFile to $outputFile with bgColor $bgColor"
