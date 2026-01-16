# Guia para Resolver Problemas de ASAR com Dependências

## Problema

Quando o Electron Builder empacota o aplicativo em um arquivo ASAR, algumas dependências que usam `require()` dinâmico ou acesso a arquivos não podem funcionar corretamente dentro do ASAR. Esses módulos precisam ser desempacotados usando `asarUnpack`.

## Como Identificar Dependências que Precisam ser Desempacotadas

### 1. Executar o Aplicativo e Verificar Erros

Quando você executar o aplicativo compilado e receber um erro como:

```
Error: Cannot find module 'nome-do-modulo'
```

Esse módulo provavelmente precisa ser adicionado ao `asarUnpack`.

### 2. Verificar Cadeia de Dependências

Use o comando npm para verificar todas as dependências transitivas:

```powershell
npm list --all | Select-String -Pattern "nome-do-modulo"
```

### 3. Adicionar ao package.json

Adicione o módulo em **duas** seções do `package.json`:

#### A. Na seção `files` (garante que será incluído no build)

```json
"files": [
  "**/*",
  "!node_modules/**/*",
  "node_modules/nome-do-modulo/**/*",
  ...
]
```

#### B. Na seção `asarUnpack` (desempacota do ASAR)

```json
"asarUnpack": [
  "node_modules/nome-do-modulo/**/*",
  ...
]
```

## Dependências Comuns que Precisam de asarUnpack

### Para electron-store e conf

- `electron-store/**/*`
- `conf/**/*`
- `pkg-up/**/*`
- `find-up/**/*`
- `locate-path/**/*`
- `p-limit/**/*`
- `p-locate/**/*`
- `p-try/**/*`
- `path-exists/**/*`

### Outras dependências que geralmente precisam

- `type-fest/**/*`
- `dot-prop/**/*`
- `is-obj/**/*`
- `ajv/**/*`
- `ajv-formats/**/*`
- `ajv-keywords/**/*`
- `fast-deep-equal/**/*`
- `fast-uri/**/*`
- `json-schema-traverse/**/*`
- `atomically/**/*`
- `debounce-fn/**/*`
- `env-paths/**/*`
- `json-schema-typed/**/*`
- `onetime/**/*`
- `semver/**/*`

## Script para Verificar Dependências Transitivas

Para encontrar todas as dependências de um módulo específico:

```powershell
# Verificar dependências de electron-store
npm list electron-store --all --depth=5 | Select-String -Pattern "electron-store|conf|pkg-up|find-up"
```

## Solução Preventiva

### Opção 1: Desabilitar ASAR (não recomendado)

Desabilitar o ASAR aumenta o tamanho do aplicativo, mas resolve todos os problemas:

```json
"asar": false
```

### Opção 2: Usar ferramenta automatizada

Algumas ferramentas podem detectar automaticamente dependências que precisam ser desempacotadas, mas requerem configuração adicional.

### Opção 3: Manter lista atualizada

Sempre que adicionar uma nova dependência que pode ter problemas com ASAR (como módulos que acessam arquivos, usam `require()` dinâmico, ou precisam de caminhos relativos), adicione-a imediatamente ao `asarUnpack`.

## Como Testar

Após adicionar módulos ao `asarUnpack`:

1. Recompilar o aplicativo:

   ```bash
   npm run build:portable
   ```

2. Executar o executável gerado em `dist/`

3. Verificar se não há mais erros de módulo não encontrado

## Troubleshooting

Se ainda tiver erros após adicionar o módulo:

1. Verifique se adicionou em **ambas** as seções (`files` e `asarUnpack`)
2. Verifique se o caminho está correto: `node_modules/nome-do-modulo/**/*`
3. Limpe e recompile: `npm run clean && npm run build:portable`
4. Verifique se o módulo existe em `node_modules/` após `npm install`
