# AEAE

Documento interno de trabajo. El contenido de este repositorio está cifrado:
lo que se publica es una página de acceso que pide una contraseña y descifra
la web en el navegador.

## Qué hay aquí

- `index.html` — página de acceso con la web cifrada dentro.
- `fuente.cifrado` — copia cifrada de la fuente de la web.
- `herramientas/` — scripts de Node para cifrar y descifrar (sin dependencias).

La carpeta `fuente/` (la web en claro) está en `.gitignore` y nunca se sube.

## Cómo se edita

1. `node herramientas/descifrar.mjs` recupera `fuente/` a partir de `fuente.cifrado`.
2. Se edita lo que haga falta dentro de `fuente/`.
3. `node herramientas/cifrar.mjs` vuelve a generar `index.html` y `fuente.cifrado`.
4. Se suben esos dos archivos.

Los scripts piden la contraseña por teclado (o la leen de la variable
`AEAE_CLAVE`). La contraseña no se guarda en ningún archivo del repositorio.

## Cifrado

AES-256-GCM con clave derivada de la contraseña mediante PBKDF2-SHA256
(600 000 iteraciones), sal e IV aleatorios en cada cifrado.
