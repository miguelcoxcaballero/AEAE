// Cifrado común: PBKDF2-SHA256 + AES-256-GCM.
// Formato del resultado (base64): sal (16 bytes) | iv (12 bytes) | datos cifrados + etiqueta (16 bytes)
import { pbkdf2Sync, randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
import { createInterface } from 'node:readline';

export const ITERACIONES = 600000;

export function cifrar(datos, clave) {
  const sal = randomBytes(16);
  const iv = randomBytes(12);
  const llave = pbkdf2Sync(clave, sal, ITERACIONES, 32, 'sha256');
  const c = createCipheriv('aes-256-gcm', llave, iv);
  const cuerpo = Buffer.concat([c.update(datos), c.final()]);
  return Buffer.concat([sal, iv, cuerpo, c.getAuthTag()]).toString('base64');
}

export function descifrar(b64, clave) {
  const todo = Buffer.from(b64, 'base64');
  const sal = todo.subarray(0, 16);
  const iv = todo.subarray(16, 28);
  const etiqueta = todo.subarray(todo.length - 16);
  const cuerpo = todo.subarray(28, todo.length - 16);
  const llave = pbkdf2Sync(clave, sal, ITERACIONES, 32, 'sha256');
  const d = createDecipheriv('aes-256-gcm', llave, iv);
  d.setAuthTag(etiqueta);
  return Buffer.concat([d.update(cuerpo), d.final()]);
}

// La contraseña se toma de la variable AEAE_CLAVE o se pide por teclado.
// No se guarda en ningún archivo.
export async function pedirClave() {
  if (process.env.AEAE_CLAVE) return process.env.AEAE_CLAVE;
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  const clave = await new Promise((ok) => rl.question('Contraseña: ', ok));
  rl.close();
  if (!clave) throw new Error('Hace falta una contraseña.');
  return clave;
}
