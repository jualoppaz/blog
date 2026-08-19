// En SSR, cada petición trae en sus cabeceras el host real por el que el
// usuario está accediendo (dominio de Vercel, dominio final, o localhost en
// desarrollo). Usarlo para construir baseURL evita depender de una URL fija
// en una variable de entorno, y funciona igual en cualquier dominio.
export default function ({ $axios, req }) {
  if (process.server && req && req.headers && req.headers.host) {
    // Solo hay 'x-forwarded-proto' cuando la petición pasa por un proxy
    // (p. ej. Vercel), que siempre lo fija a 'https'. En desarrollo local
    // (npm run dev), sin proxy delante, la conexión es HTTP plano, así que
    // el fallback correcto es 'http', no 'https' (que rompería la llamada
    // con EPROTO al no haber TLS en el servidor de dev).
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    $axios.setBaseURL(`${protocol}://${req.headers.host}/api`);
  }
}
