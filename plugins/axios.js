// En SSR, cada petición trae en sus cabeceras el host real por el que el
// usuario está accediendo (dominio de Vercel, dominio final, o localhost en
// desarrollo). Usarlo para construir baseURL evita depender de una URL fija
// en una variable de entorno, y funciona igual en cualquier dominio.
export default function ({ $axios, req }) {
  if (process.server && req && req.headers && req.headers.host) {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    $axios.setBaseURL(`${protocol}://${req.headers.host}/api`);
  }
}
