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
// Segunda ronda: combinación de lo elegido en la primera.
const base2 = readFileSync(join(dir, 'propuestas', 'diseno2.html'), 'utf8');
['arcos', 'cuadrantes', 'estelas'].forEach((n, i) => {
  const titulo = ['Arcos', 'Cuadrantes', 'Estelas'][i];
  writeFileSync(join(dir, 'propuestas', `diseno2-${'abc'[i]}-${n}.html`), base2.split('__V__').join(String(i + 1)).split('__NOMBRE__').join(titulo).split('__LOGO__').join(logo));
});
// Pantalla de acceso en el mismo estilo.
const baseL = readFileSync(join(dir, 'propuestas', 'login.html'), 'utf8');
['partida', 'ficha', 'marino'].forEach((n, i) => {
  const titulo = ['Partida', 'Ficha', 'Marino'][i];
  writeFileSync(join(dir, 'propuestas', `login-${'abc'[i]}-${n}.html`), baseL.split('__V__').join(String(i + 1)).split('__NOMBRE__').join(titulo).split('__LOGO__').join(logo));
});
['lisa', 'columna', 'bisel'].forEach((n, i) => {
  const titulo = ['Lisa', 'Columna', 'Bisel'][i];
  writeFileSync(join(dir, 'propuestas', `login-${'def'[i]}-${n}.html`), baseL.split('__V__').join(String(i + 4)).split('__NOMBRE__').join(titulo).split('__LOGO__').join(logo));
});
['limpia', 'arco', 'perfil'].forEach((n, i) => {
  const titulo = ['Limpia', 'Arco', 'Perfil'][i];
  writeFileSync(join(dir, 'propuestas', `login-${'ghi'[i]}-${n}.html`), baseL.split('__V__').join(String(i + 7)).split('__NOMBRE__').join(titulo).split('__LOGO__').join(logo));
});
console.log('Diseños generados: 15');
