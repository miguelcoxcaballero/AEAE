// Genera lo único que se publica:
//   index.html      página de acceso con la web cifrada dentro
//   fuente.cifrado  copia cifrada de la carpeta fuente/, para poder recuperarla
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cifrar, pedirClave, ITERACIONES } from './cripto.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const fuente = join(raiz, 'fuente');
const clave = await pedirClave();

const TIPOS = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif' };

function listar(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? listar(p) : [p];
  });
}

// 1. Página única: estilos e imágenes locales van incrustados, para que no quede nada en claro.
let html = readFileSync(join(fuente, 'index.html'), 'utf8');
html = html.replace(/<link rel="stylesheet" href="(?!https?:)([^"]+)">/g, (_, ruta) =>
  `<style>\n${readFileSync(join(fuente, ruta), 'utf8')}\n</style>`);
html = html.replace(/(src|href)="(assets\/[^"]+)"/g, (_, attr, ruta) => {
  const tipo = TIPOS[extname(ruta).toLowerCase()];
  if (!tipo) throw new Error('Tipo de archivo sin soporte: ' + ruta);
  return `${attr}="data:${tipo};base64,${readFileSync(join(fuente, ruta)).toString('base64')}"`;
});

// 2. Copia cifrada de la fuente.
const archivos = {};
for (const p of listar(fuente)) archivos[relative(fuente, p).split('\\').join('/')] = readFileSync(p).toString('base64');

const acceso = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>AEAE · Acceso</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 16px;
    background: linear-gradient(160deg, #10113b 0%, #29304c 40%, #3f5fc4 100%);
    font-family: Poppins, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #29304c; }
  form { width: 100%; max-width: 380px; padding: 32px 28px; background: #fff; border: 3px solid #29304c; border-radius: 22px; }
  h1 { margin: 0 0 6px; font-size: 26px; }
  p { margin: 0 0 20px; font-size: 14px; color: #666f7d; }
  label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 600; }
  input { width: 100%; padding: 11px 16px; border: 2px solid #29304c; border-radius: 999px; font: inherit; font-size: 16px; }
  button { width: 100%; margin-top: 14px; padding: 11px 16px; border: 3px solid #29304c; border-radius: 999px;
    background: #29304c; color: #fff; font: inherit; font-size: 15px; cursor: pointer; }
  button:disabled { opacity: .6; cursor: wait; }
  input:focus-visible, button:focus-visible { outline: 3px solid #3f5fc4; outline-offset: 2px; }
  #aviso { min-height: 20px; margin: 12px 0 0; color: #b3261e; }
</style>
</head>
<body>
<form id="acceso">
  <h1>AEAE</h1>
  <p>Documento interno. Introduce la contraseña para verlo.</p>
  <label for="clave">Contraseña</label>
  <input id="clave" type="password" autocomplete="current-password" required autofocus>
  <button id="entrar" type="submit">Entrar</button>
  <p id="aviso" role="alert"></p>
</form>
<script>
(function () {
  var DATOS = "${cifrar(Buffer.from(html, 'utf8'), clave)}";
  var ITERACIONES = ${ITERACIONES};
  var MEMORIA = 'aeae-llave';
  var bytes = Uint8Array.from(atob(DATOS), function (c) { return c.charCodeAt(0); });
  var sal = bytes.slice(0, 16), iv = bytes.slice(16, 28), cuerpo = bytes.slice(28);
  var form = document.getElementById('acceso'), aviso = document.getElementById('aviso'), boton = document.getElementById('entrar');

  function importar(crudo) {
    return crypto.subtle.importKey('raw', crudo, 'AES-GCM', false, ['decrypt']);
  }
  function derivar(clave) {
    return crypto.subtle.importKey('raw', new TextEncoder().encode(clave), 'PBKDF2', false, ['deriveBits'])
      .then(function (base) {
        return crypto.subtle.deriveBits({ name: 'PBKDF2', salt: sal, iterations: ITERACIONES, hash: 'SHA-256' }, base, 256);
      });
  }
  function abrir(crudo) {
    return importar(crudo).then(function (llave) {
      return crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, llave, cuerpo);
    }).then(function (claro) {
      // Se recuerda solo mientras dure la pestaña, para no pedirla al recargar.
      try { sessionStorage.setItem(MEMORIA, btoa(String.fromCharCode.apply(null, new Uint8Array(crudo)))); } catch (e) {}
      var pagina = new TextDecoder().decode(claro);
      document.open(); document.write(pagina); document.close();
    });
  }

  if (!window.crypto || !crypto.subtle) {
    aviso.textContent = 'Este navegador no permite descifrar la página.';
    boton.disabled = true;
    return;
  }

  try {
    var guardada = sessionStorage.getItem(MEMORIA);
    if (guardada) {
      abrir(Uint8Array.from(atob(guardada), function (c) { return c.charCodeAt(0); }).buffer)
        .catch(function () { sessionStorage.removeItem(MEMORIA); });
    }
  } catch (e) {}

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    aviso.textContent = '';
    boton.disabled = true;
    derivar(document.getElementById('clave').value).then(abrir).catch(function () {
      aviso.textContent = 'Contraseña incorrecta.';
      boton.disabled = false;
      document.getElementById('clave').select();
    });
  });
})();
</script>
</body>
</html>
`;

writeFileSync(join(raiz, 'index.html'), acceso);
writeFileSync(join(raiz, 'fuente.cifrado'), cifrar(Buffer.from(JSON.stringify(archivos)), clave) + '\n');
console.log(`Listo: index.html y fuente.cifrado (${Object.keys(archivos).length} archivos de fuente).`);
