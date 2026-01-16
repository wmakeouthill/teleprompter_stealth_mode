# Instruções para Compilar o Executável

## Pré-requisitos
- Node.js instalado (versão 16 ou superior)
- npm ou yarn

## Passos para Compilar

1. **Instalar dependências:**
```bash
npm install
```

2. **Compilar o executável portátil:**
```bash
npm run build:portable
```

Ou para build completo:
```bash
npm run build
```

## Resultado

O executável será gerado na pasta `dist/` com o nome:
- `Teleprompter Stealth-1.0.0-portable.exe`

Este é um executável portátil que:
- ✅ Não requer instalação
- ✅ Pode ser executado diretamente
- ✅ É otimizado para tamanho mínimo
- ✅ Usa compressão máxima
- ✅ Não inclui DevTools em produção

## Otimizações Aplicadas

- Compressão máxima (maximum)
- ASAR habilitado (arquivo único)
- Apenas dependências necessárias incluídas
- DevTools desabilitado em produção
- Build portátil (sem instalador)
