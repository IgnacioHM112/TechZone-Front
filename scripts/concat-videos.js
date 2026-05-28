import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const assetsDir = path.join(__dirname, '..', 'public', 'assets');
const outFile = path.join(assetsDir, 'promo_combined.mp4');

if (!ffmpegPath) {
  console.error('\nNo se pudo resolver ffmpeg-static. Instala dependencias con npm install.');
  process.exit(1);
}

// Obtener archivos .mp4 en public/assets (orden alfabético)
const files = fs.readdirSync(assetsDir)
  .filter(f => f.toLowerCase().endsWith('.mp4'))
  .sort()
  .map(f => path.join(assetsDir, f));

if (files.length === 0) {
  console.error('No se encontraron archivos .mp4 en', assetsDir);
  process.exit(1);
}

// Crear archivo list.txt para concat demuxer
const listFile = path.join(assetsDir, 'ffconcat_list.txt');
const listContent = files.map(f => `file '${f.replace(/'/g, "'\\''")}'`).join('\n');
fs.writeFileSync(listFile, listContent);

console.log('Archivos a concatenar:');
files.forEach(f => console.log(' -', path.basename(f)));
console.log('\nConcatenando a', path.basename(outFile), '...');

try {
  // Re-encode to ensure compatibility
  execFileSync(ffmpegPath, [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', listFile,
    '-c:v', 'libx264',
    '-crf', '23',
    '-preset', 'veryfast',
    '-c:a', 'aac',
    '-b:a', '192k',
    outFile
  ], { stdio: 'inherit' });

  console.log('\nArchivo combinado creado en:', outFile);
  // limpiar list file
  try { fs.unlinkSync(listFile); } catch(e) {}
} catch (err) {
  console.error('\nError ejecutando ffmpeg:', err.message || err);
  process.exit(1);
}

process.exit(0);
