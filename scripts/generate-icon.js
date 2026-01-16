const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

// Tamanhos necessários para Windows (em pixels)
const ICON_SIZES = [
  16, 20, 24, 30, 32, 36, 40, 48, 60, 64, 72, 96, 256
];

// Caminhos
const BUILD_DIR = path.join(__dirname, '..', 'build');
const ICON_OUTPUT = path.join(BUILD_DIR, 'icon.ico');

/**
 * Gera ícone .ico a partir de uma imagem fonte (PNG, SVG, etc.)
 * ou regenera a partir do ícone atual
 */
async function generateIcon(sourceImage = null) {
  try {
    // Criar pasta build se não existir
    if (!fs.existsSync(BUILD_DIR)) {
      fs.mkdirSync(BUILD_DIR, { recursive: true });
    }

    let inputBuffer;

    if (sourceImage && fs.existsSync(sourceImage)) {
      // Usar imagem fonte fornecida
      console.log(`📸 Usando imagem fonte: ${sourceImage}`);
      inputBuffer = fs.readFileSync(sourceImage);
    } else if (fs.existsSync(ICON_OUTPUT)) {
      // Não podemos ler .ico diretamente com Sharp
      // Verificar se existe imagem fonte primeiro
      const possibleSources = [
        path.join(BUILD_DIR, 'icon-source.png'),
        path.join(BUILD_DIR, 'icon-source.svg'),
        path.join(BUILD_DIR, 'icon.png'),
        path.join(BUILD_DIR, 'icon.svg'),
      ];

      let foundSource = null;
      for (const source of possibleSources) {
        if (fs.existsSync(source)) {
          foundSource = source;
          break;
        }
      }

      if (foundSource) {
        console.log(`📸 Encontrada imagem fonte: ${foundSource}`);
        inputBuffer = fs.readFileSync(foundSource);
      } else {
        const stats = fs.statSync(ICON_OUTPUT);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`\n📁 Ícone atual encontrado: ${ICON_OUTPUT}`);
        console.log(`   Tamanho: ${sizeKB} KB`);
        console.log(`\n✅ O ícone atual parece estar OK (tamanho adequado para múltiplos tamanhos)`);
        console.log(`\n💡 Para regenerar o ícone com todos os tamanhos garantidos:`);
        console.log(`   1. Coloque uma imagem PNG ou SVG (mínimo 256x256) em:`);
        console.log(`      - build/icon-source.png ou`);
        console.log(`      - build/icon-source.svg`);
        console.log(`   2. Execute novamente: npm run generate-icon`);
        console.log(`\n💡 Ou forneça o caminho da imagem fonte:`);
        console.log(`     npm run generate-icon -- build/icon-source.png`);
        console.log(`\n📝 Tamanhos que serão incluídos: ${ICON_SIZES.join(', ')}`);
        return;
      }
    } else {
      // Tentar encontrar imagem fonte
      const possibleSources = [
        path.join(BUILD_DIR, 'icon-source.png'),
        path.join(BUILD_DIR, 'icon-source.svg'),
        path.join(BUILD_DIR, 'icon.png'),
        path.join(BUILD_DIR, 'icon.svg'),
      ];

      let foundSource = null;
      for (const source of possibleSources) {
        if (fs.existsSync(source)) {
          foundSource = source;
          break;
        }
      }

      if (foundSource) {
        console.log(`📸 Encontrada imagem fonte: ${foundSource}`);
        inputBuffer = fs.readFileSync(foundSource);
      } else {
        console.error('❌ Nenhuma imagem fonte encontrada!');
        console.log('\n📝 Instruções:');
        console.log('  1. Coloque uma imagem PNG ou SVG (mínimo 256x256) em:');
        console.log('     - build/icon-source.png ou');
        console.log('     - build/icon-source.svg');
        console.log('  2. Execute novamente: npm run generate-icon');
        console.log('\n💡 Ou forneça o caminho como argumento:');
        console.log('     npm run generate-icon -- build/icon-source.png');
        return;
      }
    }

    console.log(`\n🔄 Gerando ${ICON_SIZES.length} tamanhos de ícone...`);

    // Gerar todas as imagens em diferentes tamanhos
    const images = await Promise.all(
      ICON_SIZES.map(async (size) => {
        const buffer = await sharp(inputBuffer)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png()
          .toBuffer();

        console.log(`  ✓ ${size}x${size}`);
        return buffer;
      })
    );

    console.log(`\n💾 Criando arquivo icon.ico com todos os tamanhos...`);

    // Converter para .ico
    const icoBuffer = await toIco(images);

    // Salvar arquivo
    fs.writeFileSync(ICON_OUTPUT, icoBuffer);

    const fileSize = (icoBuffer.length / 1024).toFixed(2);
    console.log(`\n✅ Ícone gerado com sucesso!`);
    console.log(`   Arquivo: ${ICON_OUTPUT}`);
    console.log(`   Tamanho: ${fileSize} KB`);
    console.log(`   Tamanhos incluídos: ${ICON_SIZES.join(', ')}`);
    console.log(`\n🎯 O ícone está pronto para uso no build do Electron!`);

  } catch (error) {
    console.error('\n❌ Erro ao gerar ícone:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Executar
const sourceImage = process.argv[2] || null;
generateIcon(sourceImage);
