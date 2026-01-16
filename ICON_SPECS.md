# Especificações do Ícone para Windows

## ✅ Tamanhos Necessários no icon.ico

Para exibição correta do ícone na barra de tarefas do Windows e em todos os contextos (menu Iniciar, visualizações, etc.), o arquivo `build/icon.ico` deve conter **múltiplos tamanhos**:

### Tamanhos Obrigatórios

| Tamanho | Uso |
|---------|-----|
| **16×16** | Barra de tarefas pequena, menus de contexto |
| **24×24** | Barra de tarefas média |
| **32×32** | Barra de tarefas grande |
| **48×48** | Visualizações médias |
| **64×64** | Visualizações grandes |
| **96×96** | Visualizações muito grandes |
| **256×256** | **ESSENCIAL** - Alta resolução, propriedades do arquivo |

### Tamanhos Recomendados Adicionais

| Tamanho | Uso |
|---------|-----|
| 20×20 | Escala 125% |
| 30×30 | Escala 150% |
| 36×36 | Escala 150% |
| 40×40 | Escala 200% |
| 60×60 | Escala 150% |
| 72×72 | Escala 150% |

## ⚠️ Problemas Comuns

### Se o ícone contém apenas 256×256

- ❌ Ficará borrado na barra de tarefas
- ❌ Pode ficar pixelado em diferentes escalas
- ❌ Windows fará downscale, causando perda de qualidade

### Se faltam tamanhos intermediários

- ❌ Ícone pode ficar borrado em certas escalas do Windows (125%, 150%, 200%)
- ❌ Barra de tarefas pode exibir ícone de baixa qualidade

## 🔧 Como Verificar o Ícone Atual

### Opção 1: Usando PowerShell (Windows)

```powershell
# Verificar propriedades do arquivo
Get-Item "build\icon.ico" | Select-Object Length, LastWriteTime
```

### Opção 2: Ferramentas Online

- **<https://icoconvert.com/>** - Upload e visualize todos os tamanhos dentro do .ico
- **<https://www.icofile.com/>** - Verificador de ícones

### Opção 3: Software

- **IcoFX** (gratuito) - Abra o arquivo e veja todos os tamanhos contidos
- **Greenfish Icon Editor Pro** (gratuito)
- **GIMP** - Pode abrir .ico e mostrar camadas/tamanhos

## 🛠️ Como Gerar um Ícone Completo

### Opção 1: A partir de um PNG/SVG de alta qualidade (256×256 ou maior)

#### Usando Online Tools

1. **<https://icoconvert.com/>**
   - Upload seu PNG/SVG (mínimo 256×256)
   - Selecione todos os tamanhos necessários
   - Baixe o .ico gerado

2. **<https://convertio.co/png-ico/>**
   - Converte e permite selecionar tamanhos

#### Usando Ferramentas Desktop

1. **IcoFX** (Windows)
   - Abra seu PNG
   - Menu: File → Import → Images as frames
   - Adicione manualmente os tamanhos ou use a opção de gerar múltiplos tamanhos
   - Exporte como .ico

2. **GIMP**
   - Abra a imagem fonte
   - Exporte para .ico e selecione os tamanhos ao exportar

### Opção 2: Usando Node.js (se já tiver uma imagem fonte)

```bash
npm install --save-dev electron-icon-maker
```

Crie um script para gerar todos os tamanhos automaticamente.

## ✅ Checklist de Validação

Antes de usar o `icon.ico` no build:

- [ ] Arquivo existe em `build/icon.ico`
- [ ] Contém pelo menos **256×256** (obrigatório)
- [ ] Contém **16×16, 24×24, 32×32, 48×48** (essenciais para barra de tarefas)
- [ ] Tamanho do arquivo é razoável (50KB - 500KB dependendo dos tamanhos)
- [ ] Testado visualmente na barra de tarefas do Windows
- [ ] Testado em diferentes escalas de DPI (100%, 125%, 150%, 200%)

## 📝 Nota Importante

O `electron-builder` requer um arquivo `.ico` válido com **pelo menos 256×256**. Para garantir a melhor qualidade em todos os contextos do Windows, é **altamente recomendado** incluir todos os tamanhos listados acima.

## 🔍 Verificação Rápida

Se o seu `icon.ico` atual tem aproximadamente **137KB** (como detectado), provavelmente já contém múltiplos tamanhos. Mas é importante verificar se contém os tamanhos essenciais para evitar problemas de exibição na barra de tarefas.
