// Genera las cinco propuestas de interfaz a partir de fuente/propuestas/base.html.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'fuente');
const base = readFileSync(join(dir, 'propuestas', 'base.html'), 'utf8');
const logo = 'data:image/png;base64,' + readFileSync(join(dir, 'assets', 'logo-aeae.png')).toString('base64');
const nombres = ['aulas', 'espacio-de-trabajo', 'tablero', 'agenda', 'explorador', 'explorador-azul'];
const titulos = ['Aulas', 'Espacio de trabajo', 'Tablero', 'Agenda', 'Explorador', 'Explorador azul'];

nombres.forEach((n, i) => {
  const html = base.split('__V__').join(String(i + 1)).split('__NOMBRE__').join(titulos[i]).split('__LOGO__').join(logo);
  writeFileSync(join(dir, 'propuestas', `propuesta-${i + 1}-${n}.html`), html);
});
console.log('Propuestas generadas:', nombres.length);
