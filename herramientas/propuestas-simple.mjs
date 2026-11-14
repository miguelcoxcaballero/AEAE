// Genera las tres propuestas de simplificación a partir de fuente/propuestas/simple.html.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'fuente');
const base = readFileSync(join(dir, 'propuestas', 'simple.html'), 'utf8');
const logo = 'data:image/png;base64,' + readFileSync(join(dir, 'assets', 'logo-aeae.png')).toString('base64');
['pestanas', 'mosaico', 'columnas'].forEach((n, i) => {
  const titulo = ['Pestañas', 'Mosaico', 'Columnas'][i];
  writeFileSync(join(dir, 'propuestas', `simple-${i + 1}-${n}.html`), base.split('__V__').join(String(i + 1)).split('__NOMBRE__').join(titulo).split('__LOGO__').join(logo));
});
console.log('Propuestas generadas: 3');
