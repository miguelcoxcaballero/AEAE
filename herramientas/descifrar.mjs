// Recupera la carpeta fuente/ (en claro) a partir de fuente.cifrado.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { descifrar, pedirClave } from './cripto.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const destino = resolve(raiz, 'fuente');
const clave = await pedirClave();

let archivos;
try {
  archivos = JSON.parse(descifrar(readFileSync(join(raiz, 'fuente.cifrado'), 'utf8'), clave));
} catch {
  console.error('Contraseña incorrecta o archivo dañado.');
  process.exit(1);
}

for (const [ruta, b64] of Object.entries(archivos)) {
  const salida = resolve(destino, ruta);
  if (!salida.startsWith(destino + sep)) throw new Error('Ruta no válida: ' + ruta);
  mkdirSync(dirname(salida), { recursive: true });
  writeFileSync(salida, Buffer.from(b64, 'base64'));
}
console.log(`fuente/ recuperada (${Object.keys(archivos).length} archivos).`);
