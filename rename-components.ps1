# Ruta base de componentes
$basePath = "src\components"

# Obtener todos los archivos .js dentro de src/components
Get-ChildItem -Path $basePath -Recurse -Include *.js | ForEach-Object {
    $oldPath = $_.FullName
    $dir = $_.DirectoryName
    $fileName = $_.BaseName

    # Capitalizar primera letra
    $newFileName = $fileName.Substring(0,1).ToUpper() + $fileName.Substring(1)

    # Nuevo nombre con extensión .jsx
    $newPath = Join-Path $dir ($newFileName + ".jsx")

    Write-Output "Renombrando $oldPath → $newPath"
    Rename-Item -Path $oldPath -NewName $newPath
}
