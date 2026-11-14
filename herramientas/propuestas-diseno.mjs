// Genera las tres propuestas de diseño a partir de fuente/propuestas/diseno.html.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'fuente');
const base = readFileSync(join(dir, 'propuestas', 'diseno.html'), 'utf8');
const logo = 'data:image/png;base64,' + readFileSync(join(dir, 'assets', 'logo-aeae.png')).toString('base64');
['membrete', 'plano', 'cartel'].forEach((n, i) => {
  const titulo = ['Membrete', 'Plano', 'Cartel'][i];
  writeFileSync(join(dir, 'propuestas', `diseno-${i + 1}-${n}.html`), base.split('__V__').join(String(i + 1)).split('__NOMBRE__').join(titulo).split('__LOGO__').join(logo));
});
console.log('Diseños generados: 3');
