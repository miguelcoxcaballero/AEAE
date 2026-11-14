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

const logoAcceso = 'data:image/png;base64,' + readFileSync(join(fuente, 'assets', 'logo-aeae.png')).toString('base64');
const acceso = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Intranet AEAE</title>
<link rel="icon" href="${logoAcceso}">
<link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700&display=swap" rel="stylesheet">
<style>
html, body { height:100%; }
body { margin:0; background:#f3f5fa; }
.acc { display:grid; grid-template-columns:minmax(0,11fr) minmax(0,9fr); height:100vh; overflow:hidden; background:#f3f5fa; color:#2b2f3a; font:15px/1.45 "Trebuchet MS","Fira Sans","Segoe UI",Arial,sans-serif; -webkit-font-smoothing:antialiased; }
.acc * { box-sizing:border-box; }
.acc-lado { position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:flex-end; padding:40px 40px 54px 7vw; background:#29304c; clip-path:polygon(0 0,100% 0,calc(100% - 110px) 100%,0 100%); }
.acc-lado h1 { position:relative; margin:0; color:#fff; font-size:40px; font-weight:700; letter-spacing:-.01em; line-height:1.15; }
.acc-marca { position:absolute; left:5vw; top:50%; transform:translateY(-58%); color:transparent; -webkit-text-stroke:2.5px rgba(169,211,245,.24); font-size:21vw; font-weight:700; line-height:1; letter-spacing:-.02em; white-space:nowrap; pointer-events:none; user-select:none; }
.acc-form { display:grid; place-items:center; padding:40px 40px 40px 0; overflow-y:auto; }
.acc-caja { width:100%; max-width:360px; animation:acc-entra .3s cubic-bezier(.2,.7,.2,1) both; }
@keyframes acc-entra { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
.acc-logo { display:block; width:76px; height:auto; margin:0 0 30px; }
.acc-sec { display:flex; align-items:center; gap:14px; color:#29304c; font-size:14px; font-weight:700; font-variant:small-caps; letter-spacing:.06em; }
.acc-sec span { padding:6px 24px 6px 14px; background:#29304c; color:#fff; clip-path:polygon(0 0,100% 0,calc(100% - 10px) 100%,0 100%); }
.acc-sec::after { content:""; flex:1; height:2px; background:#29304c; }
.acc-cuerpo { display:flex; flex-direction:column; align-items:flex-start; gap:18px; margin:26px 0 0; }
.acc label { display:block; margin-bottom:6px; color:#29304c; font-size:13px; font-weight:700; letter-spacing:.04em; }
.acc-campo { display:block; width:100%; padding:12px 14px; border:0; border-bottom:2px solid #29304c; border-radius:0; background:#fff; color:inherit; font:inherit; font-size:16px; transition:box-shadow .2s; }
.acc-campo:focus { outline:none; box-shadow:0 7px 0 -4px #a9d3f5; }
.acc-entrar { display:inline-flex; align-items:center; gap:10px; padding:11px 22px 11px 24px; border:0; background:#29304c; color:#fff; font:inherit; font-weight:700; cursor:pointer; clip-path:polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%); transition:background .15s, padding .2s cubic-bezier(.2,.7,.2,1); }
.acc-entrar:hover:not(:disabled) { background:#10113b; padding-right:30px; }
.acc-entrar:disabled { opacity:.6; cursor:wait; }
.acc-google { display:inline-flex; align-items:center; gap:12px; padding:10px 22px 10px 12px; border:1.5px solid #29304c; border-radius:999px; background:#fff; color:#29304c; font:inherit; font-weight:700; cursor:pointer; transition:box-shadow .2s, transform .15s cubic-bezier(.2,.7,.2,1); }
.acc-google:hover:not(:disabled) { box-shadow:0 10px 22px -12px rgba(16,17,59,.55); transform:translateY(-1px); }
.acc-google:disabled { opacity:.55; cursor:wait; }
.acc-nota { margin:0; color:#737a8a; font-size:13px; }
.acc-msg { margin:0; color:#b3261e; font-size:13px; line-height:1.4; }
.acc-msg:empty { display:none; }
.acc-pasos { display:flex; gap:8px; }
.acc-pasos i { width:34px; height:5px; background:#d9deea; }
.acc-pasos i.on { background:#29304c; }
.acc :focus-visible { outline:3px solid #3f5fc4; outline-offset:2px; }
.acc .acc-campo:focus-visible { outline:none; }
@media (max-width:760px) {
  .acc { grid-template-columns:1fr; grid-template-rows:auto 1fr; height:auto; min-height:100vh; overflow:visible; }
  .acc-lado { min-height:200px; padding:26px; clip-path:polygon(0 0,100% 0,100% calc(100% - 40px),0 100%); }
  .acc-lado h1 { font-size:32px; }
  .acc-marca { font-size:150px; }
  .acc-form { padding:30px 22px; place-items:start center; overflow:visible; }
}
@media (prefers-reduced-motion: reduce) { .acc *, .acc *::before, .acc *::after { animation:none !important; transition:none !important; } }
/* Con la contraseña ya puesta en esta pestaña no se enseña el formulario al recargar */
.recordada .acc-caja { visibility:hidden; }
</style>
<script>
  try { if (sessionStorage.getItem('aeae-llave')) document.documentElement.className = 'recordada'; } catch (e) {}
</script>
</head>
<body>
<div class="acc"><div class="acc-lado"><div class="acc-marca" aria-hidden="true">AEAE</div><h1>Intranet</h1></div>
  <div class="acc-form"><div class="acc-caja"><img class="acc-logo" src="${logoAcceso}" alt="AEAE"><div class="acc-sec"><span>Acceso</span></div>
    <form class="acc-cuerpo" id="acceso"><div style="width:100%"><label for="clave">Contraseña</label><input class="acc-campo" id="clave" type="password" autocomplete="current-password" required autofocus></div>
      <button class="acc-entrar" id="entrar" type="submit">Entrar <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg></button>
      <p class="acc-msg" id="aviso" role="alert"></p><div class="acc-pasos" aria-label="Paso 1 de 2"><i class="on"></i><i></i></div></form></div></div></div>
<script>
(function () {
  var DATOS = "${cifrar(Buffer.from(html, 'utf8'), clave)}";
  var ITERACIONES = ${ITERACIONES};
  var MEMORIA = 'aeae-llave';
  var bytes = Uint8Array.from(atob(DATOS), function (c) { return c.charCodeAt(0); });
  var sal = bytes.slice(0, 16), iv = bytes.slice(16, 28), cuerpo = bytes.slice(28);
  var form = document.getElementById('acceso'), aviso = document.getElementById('aviso'), boton = document.getElementById('entrar');

  var cargada = new Promise(function (ok) {
    if (document.readyState === 'complete') ok();
    else window.addEventListener('load', function () { setTimeout(ok, 0); });
  });

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
      // Hay que esperar a que esta página termine de cargarse: si no, el navegador
      // añade la web debajo del formulario en vez de sustituirlo.
      return cargada.then(function () {
        document.open(); document.write(pagina); document.close();
      });
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
        .catch(function () { sessionStorage.removeItem(MEMORIA); document.documentElement.className = ''; });
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
