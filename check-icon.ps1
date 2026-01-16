# Script para verificar informacoes do icone icon.ico
# Execute: .\check-icon.ps1

$iconPath = "build\icon.ico"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Verificador de Icone para Windows" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $iconPath) {
    $file = Get-Item $iconPath
    Write-Host "OK Arquivo encontrado: $iconPath" -ForegroundColor Green
    $sizeKB = [math]::Round($file.Length / 1KB, 2)
    Write-Host "  Tamanho do arquivo: $($file.Length) bytes ($sizeKB KB)" -ForegroundColor Yellow
    Write-Host "  Ultima modificacao: $($file.LastWriteTime)" -ForegroundColor Yellow
    Write-Host ""
    
    # Verificar tamanho mínimo recomendado
    if ($file.Length -lt 50KB) {
        Write-Host "ATENCAO: Arquivo muito pequeno!" -ForegroundColor Red
        Write-Host "  Arquivos .ico com multiplos tamanhos geralmente tem 50KB-500KB" -ForegroundColor Yellow
        Write-Host "  Seu arquivo pode conter apenas um tamanho." -ForegroundColor Yellow
    }
    elseif ($file.Length -gt 500KB) {
        Write-Host "ATENCAO: Arquivo muito grande!" -ForegroundColor Yellow
        Write-Host "  Pode conter tamanhos desnecessarios ou nao otimizado." -ForegroundColor Yellow
    }
    else {
        Write-Host "OK Tamanho do arquivo parece adequado (50KB-500KB)" -ForegroundColor Green
        Write-Host "  Provavelmente contem multiplos tamanhos." -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host "RECOMENDACOES:" -ForegroundColor Cyan
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Para verificar os tamanhos exatos contidos no .ico, use:" -ForegroundColor White
    Write-Host ""
    Write-Host "  Opcao 1: Abra com IcoFX (gratuito)" -ForegroundColor Yellow
    Write-Host "           Download: https://icofx.ro/" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Opcao 2: Use ferramenta online" -ForegroundColor Yellow
    Write-Host "           https://icoconvert.com/" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Opcao 3: Verifique visualmente na barra de tarefas" -ForegroundColor Yellow
    Write-Host "           Teste em diferentes escalas (100%, 125%, 150%, 200%)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Tamanhos RECOMENDADOS no .ico:" -ForegroundColor Cyan
    Write-Host "  16×16, 24×24, 32×32, 48×48, 64×64, 96×96, 256×256" -ForegroundColor White
    Write-Host ""
    Write-Host "Tamanhos OBRIGATORIOS:" -ForegroundColor Cyan
    Write-Host "  256x256 (minimo exigido pelo electron-builder)" -ForegroundColor White
    Write-Host "  16×16, 24×24, 32×32 (para barra de tarefas)" -ForegroundColor White
    Write-Host ""
    
}
else {
    Write-Host "ERRO: Arquivo nao encontrado: $iconPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Crie a pasta 'build' e adicione um arquivo 'icon.ico' valido." -ForegroundColor Yellow
}
