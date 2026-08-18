# AGENTS.md

Guía de contexto para agentes de IA (Copilot CLI, Copilot Coding Agent, etc.) que trabajen en este repositorio. Documenta la arquitectura, el historial de la migración Heroku → Vercel y los problemas ya resueltos, para evitar repetir investigación o reintroducir errores.

## Qué es este proyecto

Blog personal y CV de Juan Manuel López Pazos, hecho en **Nuxt 2** (SSR) con Vue 2, más una **API Express** montada como middleware de Nuxt (`api/`) que sirve datos del CV (empresas, experiencia profesional, tecnologías, proyectos personales, formación extra, conocimientos).

- `pages/`, `layouts/`, `components/`, `store/`, `plugins/`, `middleware/`: app Nuxt estándar.
- `content/`: posts del blog en Markdown, gestionados con `@nuxt/content`.
- `server-api/`: API Express independiente, registrada en Nuxt vía `serverMiddleware` en `nuxt.config.js`. **Renombrada desde `api/`** (ver sección de despliegue: Vercel trata `/api` de forma especial y auto-detecta cada `.js` dentro como función serverless independiente, lo cual rompía el despliegue).
  - `server-api/index.js`: entrypoint Express.
  - `server-api/router.js` + `server-api/routes/`: definición de rutas.
  - `server-api/controllers/`: lógica de cada recurso (companies, professionalExperience, technology, knowledge, personalProject, extraTraining).
  - `server-api/data/*.json`: **datos estáticos** que sustituyen a la antigua base de datos MongoDB (ver migración más abajo).
  - `server-api/validations/`: validaciones con `joi` / `express-validation`.
- `locales/`: i18n (`es`), usado vía `import` ES module en `nuxt.config.js`.
- `server.js` (raíz del proyecto): entrypoint de la función serverless de Vercel (ver sección 3 de despliegue). Es un servidor Node.js normal que llama a `.listen()` — Vercel lo detecta automáticamente por convención de nombre/ubicación, sin necesitar `vercel.json` ni scripts de empaquetado propios.

## Historial de migración (contexto importante)

### 1. Eliminación de MongoDB → datos estáticos
El proyecto originalmente usaba MongoDB (Heroku add-on) para servir los datos del CV. Se migró todo a ficheros JSON estáticos en `server-api/data/` (originalmente `api/data/`, renombrado después, ver sección de despliegue):
- Se extrajeron los datos reales desde la API de producción (antes de apagarla).
- Se reescribieron todos los controllers de `server-api/controllers/` para leer de los JSON en vez de hacer queries con Mongoose.
- Se eliminó `mongoose` y cualquier dependencia de conexión a BD del `package.json`.
- **Importante**: si se necesita modificar el contenido del CV, hay que editar directamente los ficheros en `server-api/data/*.json`, no existe base de datos.

### 2. Eliminación de Heroku
- No quedan referencias de infraestructura Heroku en el código (las únicas menciones a `herokuapp.com` que puedan aparecer son URLs dentro de JSON de descripciones de proyectos del CV, no configuración real).
- El "plugin DNS" de Heroku (si se menciona en conversaciones previas) es una funcionalidad del dashboard de Heroku, no código del repo.
- Variables de entorno de Heroku (`HOST`, `NODE_ENV`, `NPM_CONFIG_PRODUCTION`) **no son necesarias en Vercel** y se eliminaron del proyecto de Vercel:
  - `HOST`: específico del binding de Heroku.
  - `NODE_ENV`: Vercel lo gestiona automáticamente.
  - `NPM_CONFIG_PRODUCTION`: **activamente perjudicial** en Vercel, impide instalar devDependencies necesarias para el build de Nuxt.
- La única variable de entorno necesaria es `BASE_URL` (debe incluir el prefijo `/api`, ver más abajo).

### 3. Despliegue en Vercel: servidor Node.js nativo (`server.js`)

**Historia completa (por orden cronológico, para no repetir el mismo camino):**

1. Se intentó usar el paquete legacy `@nuxtjs/vercel-builder` (última versión `0.25.0`, abril 2024, sin mantenimiento activo), la única opción "oficial" documentada históricamente para Nuxt 2 en Vercel. Tras muchas horas de debugging (ver "Incidencias ya resueltas" más abajo) se concluyó que ese builder es **fundamentalmente incompatible con Node ≥22** y además tiene un mecanismo de empaquetado de ficheros (`serverFiles`) frágil y manual que obligaba a listar uno a uno cada fichero/dependencia transitiva que Nuxt carga dinámicamente en runtime. Se abandonó.
2. Se probó sustituirlo por un script de build propio (`scripts/vercel-build.js`) que generaba a mano la estructura **Build Output API v3** de Vercel usando `@vercel/nft` para el tracing de dependencias. Funcionaba perfectamente en local, pero en Vercel **entró en un bucle infinito de builds**: el proceso de `nuxt build` interno dejaba el event loop de Node vivo (webpack/chokidar no cierran todos sus handles), así que aunque nuestro script terminaba su trabajo con éxito, el proceso Node nunca salía — Vercel interpretaba esto como un build colgado y lo reintentaba desde cero indefinidamente. Se corrigió forzando `process.exit(0)`, pero el enfoque en su conjunto (generar `.vercel/output` a mano) era innecesariamente complejo y fue **abandonado también**, en favor de la opción más simple y 100% oficial descrita a continuación.
3. **Solución final y actual**: usar el patrón oficial de Vercel ["Deploy a Node.js server"](https://vercel.com/docs/functions/runtimes/node-js#deploy-a-node.js-server) — un fichero `server.js` en la raíz del proyecto que llama a `.listen()`. Vercel lo detecta automáticamente (por convención de nombre/ubicación), gestiona él mismo el tracing de dependencias y el empaquetado, y no requiere ningún `vercel.json`, script de build propio, ni librería de terceros para el despliegue.

**Cómo funciona `server.js`:**
```js
const { loadNuxt } = require('nuxt');

async function start() {
  const nuxt = await loadNuxt('start');
  await nuxt.server.listen(); // sin argumentos: Nuxt lee process.env.PORT internamente
}

start().catch((err) => { console.error(err); process.exit(1); });
```
- Usa la API programática oficial de Nuxt (`loadNuxt('start')`) para arrancar la app ya compilada (requiere que `npm run build` se haya ejecutado antes — ver `vercel-build` script).
- `nuxt.server.listen()` sin argumentos: Nuxt 2 (`@nuxt/config`) ya lee `process.env.PORT` por defecto para configurar el puerto interno; Vercel inyecta `PORT` automáticamente y enruta el tráfico a ese puerto interno.

**`package.json` scripts relevantes:**
```json
"scripts": {
  "build": "cross-env NODE_OPTIONS=--openssl-legacy-provider nuxt build",
  "vercel-build": "npm run build"
}
```
Vercel ejecuta automáticamente `npm run vercel-build` (si existe) antes de capturar `server.js`, generando `.nuxt/dist/` (el build de Nuxt) que `loadNuxt('start')` necesita en runtime.

**Por qué se renombró `api/` a `server-api/`:** con cualquier framework preset distinto de uno que Vercel reconozca de forma nativa (aquí usamos "Other"), Vercel aplica su convención "zero-config" clásica: **cualquier fichero `.js` dentro de una carpeta `/api` en la raíz del proyecto se trata como una función serverless independiente**. Nuestra carpeta `api/` (Express app montada como `serverMiddleware` de Nuxt) contenía ficheros como `router.js` o los `controllers/*.js`, que no son handlers `(req, res) => ...` válidos — Vercel intentaría convertirlos en funciones y el build fallaría o se comportaría de forma inesperada. La solución fue renombrar toda la carpeta a `server-api/` (fuera de la convención `/api`) y actualizar la única referencia de ruta de fichero en `nuxt.config.js` (`serverMiddleware: [{ path: '/api', handler: '@/server-api/index.js' }]` — el `path: '/api'` es la URL pública y se mantiene igual, solo cambió la ruta del fichero handler).

**Cómo probar todo el flujo localmente antes de desplegar** (simula exactamente lo que Vercel hace: build + arrancar `server.js`):
```bash
npm run build
PORT=3000 node server.js
# en otra terminal (usar el mismo puerto que BASE_URL en .env, si no las llamadas
# internas de axios fallan y aparece un error de serialización de axios/devalue):
curl -i http://localhost:3000/
curl -i http://localhost:3000/blog
curl -i http://localhost:3000/curriculum
curl -i http://localhost:3000/api/companies
```

## Incidencias ya resueltas (no repetir el diagnóstico)

> **Nota**: las incidencias A-D de abajo ocurrieron mientras se usaba `@nuxtjs/vercel-builder` (ya abandonado, ver sección 3). Se documentan igualmente porque explican por qué se descartó ese builder, y porque el fix de la incidencia A (variable `BASE_URL`) sigue aplicando con el enfoque actual.

### A. Crash SSR "circular reference" en `/curriculum`
No era un problema real de referencia circular en Vue/devalue. La causa era que `store/curriculum.js` hacía llamadas axios sin el prefijo `/api` en la URL base. **Fix**: la variable de entorno `BASE_URL` debe ser `http://localhost:3000/api` en local, y en Vercel debe apuntar al dominio de producción **con el sufijo `/api`**. Si reaparece un error de serialización SSR, revisar primero esta variable antes de sospechar de datos circulares.

Nota: en `store/posts.js` se usa `.without(['body','toc','text','excerpt'])` al listar posts para `/blog` — es una optimización de payload (evita serializar el AST/markdown completo en el listado), no una corrección de bug. Se decidió mantenerla.

### B. `husky` rompe el build en Vercel ("husky command not found")
El script `prepare` de npm ejecutaba `husky` incondicionalmente, pero Vercel no tiene `husky` disponible / no lo necesita en su entorno de build. Fix aplicado en `package.json`:
```json
"prepare": "node -e \"if (!process.env.CI && !process.env.VERCEL) require('child_process').execSync('husky', { stdio: 'inherit' })\""
```
Esto omite `husky` cuando `CI` o `VERCEL` están definidos (Vercel inyecta `VERCEL=1` automáticamente), pero sigue instalando los git hooks en desarrollo local normal.

### C. `FUNCTION_INVOCATION_FAILED` — `Cannot find module 'esm'`
El launcher interno de `@nuxtjs/vercel-builder` (`node_modules/@nuxtjs/vercel-builder/lib/launcher.js`) necesita en runtime el paquete `esm` para cargar `nuxt.config.js` (que usa sintaxis `import`). `esm` era solo una dependencia transitiva y no se empaquetaba en el bundle de la lambda. **Fix**: añadir `esm` como dependencia directa en `package.json`.

### D. `FUNCTION_INVOCATION_FAILED` — `TypeError: Function.prototype.apply was called on undefined` bajo Node 24.x
Root cause más profundo, encontrado leyendo el código de `launcher.js`: este intenta cargar `nuxt.config.js` probando una cadena de loaders `["jiti", "esm"]` en orden, y **solo reporta un error descriptivo si el ÚLTIMO loader (`esm`) falla** — los fallos de `jiti` se silencian.

- Bajo **Node 24.x**: `jiti` falla silenciosamente, y el fallback a `esm@3.2.25` (paquete sin actualizar desde ~2020, anterior a los module loader hooks modernos de Node) también falla con un error interno de Node (`node:internal/modules/esm/translators`), produciendo el críptico `Function.prototype.apply was called on undefined`.
- Añadir `esm` y `jiti` como dependencias directas (para asegurar que se empaquetan en el bundle) fue **necesario pero no suficiente** bajo Node 24 — el problema no era que faltaran los paquetes, sino que sus shims de compatibilidad CJS/ESM no funcionan con el module loader de Node 24.
- **Verificado empíricamente** (instalando Node 22 vía Homebrew y probando localmente): bajo **Node 22.x**, `jiti` sí carga `nuxt.config.js` correctamente, por lo que el launcher nunca necesita caer al loader `esm` roto.

**Solución final: usar `"node": "22.x"` en `engines`, NO `24.x` ni `20.x`.**

Por qué no otras versiones (estado de soporte de Node en Vercel, verificado ~agosto 2026):
- Node 16.x: deprecado en Vercel desde el 31 enero 2025, ya no se pueden crear despliegues nuevos.
- Node 18.x: deprecado en Vercel desde el 1 septiembre 2025, ya no se pueden crear despliegues nuevos.
- Node 20.x: deprecado para nuevos despliegues a partir del **1 octubre 2026** — funcionaría hoy pero quedaría inservible pronto, y el usuario rechazó explícitamente esta opción como solución "temporal".
- **Node 22.x: soportado, y es la versión elegida** (compatible con el loader `jiti` del builder).
- Node 24.x: soportado por Vercel en general, pero **incompatible con el launcher de `@nuxtjs/vercel-builder`** por el bug descrito arriba.

Si en el futuro se actualiza `@nuxtjs/vercel-builder` a una versión más reciente que arregle esto, o se migra a un método de despliegue distinto (ver "Alternativas futuras" abajo), se podría reconsiderar subir a Node 24.x.

### E. (Con `@nuxtjs/vercel-builder`, tras arreglar D) `Cannot find module '../package.json'` / launcher sigue fallando por ficheros faltantes
Incluso arreglando el loader de `jiti`/`esm` con Node 22.x, el builder seguía fallando porque su `serverFiles` (configurado manualmente en `vercel.json`) no incluía TODOS los ficheros que Nuxt necesita en runtime: primero faltó `locales/**` (usado por `nuxt.config.js` vía `import es from './locales/es'`), luego faltó el paquete transitivo `node-fetch-native` (usado por `@nuxt/vue-app`, no listado como dependencia directa). Cada vez que se arreglaba un fichero/módulo faltante, aparecía el siguiente — patrón típico de un builder con tracing manual/incompleto de dependencias, en vez de tracing automático real.

**Esto fue la señal que llevó a abandonar `@nuxtjs/vercel-builder`.**

### F. Script de build propio con `@vercel/nft` en bucle infinito de builds
Se sustituyó `@nuxtjs/vercel-builder` por un script propio (`scripts/vercel-build.js`, ya eliminado) que generaba a mano la estructura Build Output API v3 usando `@vercel/nft` para el tracing de dependencias. Funcionaba perfectamente en local, pero en Vercel el build se repetía indefinidamente en bucle (visible en los logs como el mismo "Running npm run vercel-build" ejecutándose una y otra vez sin fin). Causa: `nuxt build` deja el event loop de Node vivo (webpack/chokidar no cierran todos sus handles al terminar), así que aunque el script terminaba su trabajo con éxito ("✔ Build Output API v3 generated"), el proceso de Node nunca salía — Vercel interpretaba esto como un build colgado y lo reintentaba desde cero repetidamente.

**Esto (sumado a la complejidad innecesaria de mantener nuestro propio Build Output API) llevó a abandonar también ese enfoque**, en favor del patrón oficial y mucho más simple descrito en la sección 3 de despliegue: un `server.js` en la raíz con `.listen()`, que Vercel captura automáticamente sin necesidad de generar nada a mano.

### G. Vercel auto-detectando `api/` como funciones serverless independientes
Al pasar a "Other" como framework preset (necesario para que Vercel no aplique su integración zero-config de Nuxt.js, que ignoraba nuestro `server.js`), Vercel empezó a aplicar su otra convención zero-config: tratar cada `.js` dentro de una carpeta `/api` en la raíz como una función serverless independiente. Nuestra carpeta `api/` (la API Express montada como `serverMiddleware` de Nuxt) tiene ficheros como `router.js` o los `controllers/*.js` que no son handlers `(req,res)=>...` válidos, causando fallos. Solución: renombrar `api/` → `server-api/` (ver sección 3 de despliegue) y actualizar la única referencia de ruta de fichero en `nuxt.config.js`.

## Estado actual de `package.json` relevante para el deploy

```json
"scripts": {
  "build": "cross-env NODE_OPTIONS=--openssl-legacy-provider nuxt build",
  "vercel-build": "npm run build"
  // ...resto de scripts
},
"dependencies": {
  "esm": "^3.2.25",
  "jiti": "^2.7.0",
  "node-fetch-native": "1.6.7"
  // ...resto de dependencias de la app
},
"engines": {
  "node": "22.x",
  "npm": ">=10"
}
```

`esm`, `jiti` y `node-fetch-native` se añadieron como dependencias directas cuando aún se usaba `@nuxtjs/vercel-builder`. Con el enfoque actual (servidor Node.js nativo `server.js`, capturado y empaquetado automáticamente por Vercel) probablemente ya no son estrictamente necesarias como directas, pero se han dejado así por precaución/no repetir regresiones. No hacen daño. `@vercel/nft` y `@nuxtjs/vercel-builder` (usados por enfoques ya abandonados) han sido eliminados de `package.json`.

## Variables de entorno necesarias en Vercel

Solo una:
- `BASE_URL`: URL base de la API, **debe incluir el sufijo `/api`** (p. ej. `https://tu-dominio.vercel.app/api`). Si falta el sufijo, reaparecerá el bug de la sección A (fallos de SSR en `/curriculum`, `/blog`, etc. por llamadas axios mal dirigidas).

No añadir `HOST`, `NODE_ENV` ni `NPM_CONFIG_PRODUCTION` (ver sección "Eliminación de Heroku").

**Framework Preset en Vercel (Project Settings → General):** debe estar en **"Other"**, NO en "Nuxt.js". El preset "Nuxt.js" de Vercel usa su propia integración zero-config para Nuxt, que ignora nuestro `server.js` y nuestro `vercel-build` script (ver incidencia F/relacionada). Build Command / Output Directory / Install Command / Development Command deben quedar **vacíos/sin override** — Vercel detecta `server.js` y el script `vercel-build` de `package.json` automáticamente.

## Cómo probar cambios de Node/dependencias localmente antes de desplegar

Dado lo frágil que puede ser este stack (Nuxt 2 en Vercel), **siempre verificar localmente con la misma versión de Node que se usará en Vercel antes de hacer commit/deploy**. La forma más fiel de probarlo es replicar exactamente lo que Vercel hace (ver sección 3 más arriba): `npm run build` y luego `PORT=3000 node server.js`, y comprobar con curl las rutas clave. El siguiente procedimiento adicional sigue siendo útil para descartar problemas de compatibilidad de Node en la instalación de dependencias/build de Nuxt en sí (independientemente del despliegue en Vercel):

```bash
# instalar una versión concreta de Node vía Homebrew, p. ej. Node 22
brew install node@22
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
node -v   # confirmar versión activa

# reinstalar dependencias con esa versión (importante: los binarios nativos/lockfile pueden diferir)
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# build completo
npm run build

# levantar el servidor y comprobar páginas clave
npm run start &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/blog
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/curriculum
```

Para probar específicamente si el loader del builder (`jiti`/`esm`) funciona bajo una versión de Node dada, sin desplegar:

```bash
cat > ./test_loader_tmp.js <<'EOF'
const jiti = require('jiti')(__filename);
try {
  const config = jiti('./nuxt.config.js');
  console.log('JITI OK', typeof config);
} catch (e) { console.log('JITI FAIL', e.message); }
EOF
node ./test_loader_tmp.js
rm ./test_loader_tmp.js
```

Si `jiti` falla bajo la versión de Node que se está probando, el deploy en Vercel fallará con el mismo error que en la sección D.

## Debugging de despliegues en Vercel (CLI)

- `vercel whoami` / `vercel link --yes`: vincula el repo local al proyecto de Vercel (crea `.vercel/`, ya en `.gitignore`).
- `vercel ls` / `vercel inspect <deployment>`: para ver qué deployment está detrás del alias de producción.
- Las URLs de deployment individuales (hash) devuelven **302 con protección SSO de preview** — esto es normal y no indica error; solo el alias de producción refleja el comportamiento real para usuarios.
- `vercel logs <url>` es un comando **bloqueante/streaming**, no tiene modo "últimas N líneas y salir". Patrón usado para capturarlo sin bloquear la sesión:
  ```bash
  nohup vercel logs <production-url> > /tmp/vercel_logs.txt 2>&1 &
  LOGS_PID=$!
  sleep 3
  curl -s <production-url> > /dev/null   # dispara una invocación real
  sleep 5
  kill $LOGS_PID
  cat /tmp/vercel_logs.txt
  ```
- Si `vercel logs`/CLI falla con error de certificado autofirmado (TLS), sospechar de una VPN corporativa interceptando HTTPS — desactivarla suele resolverlo.
- Los cambios de variables de entorno en el dashboard de Vercel **no afectan a despliegues ya existentes**; hace falta un redeploy nuevo para que tomen efecto.

## Notas de Git / GitHub

- Repo personal (`jualoppaz/blog`), autenticación HTTPS vía credential helper `osxkeychain` + Personal Access Token (no usar `gh auth login` con flujo de dispositivo si el usuario prefiere no exponer credenciales al agente; en su lugar, guiar al usuario para que ejecute `git credential-osxkeychain store` él mismo).
- **Cuidado**: `git credential-osxkeychain erase` para `protocol=https, host=github.com` borra la credencial para **todos los repos que compartan ese host+protocolo** en la máquina, no solo el repo en el que se está trabajando. Si hay otros repos personales HTTPS en la misma máquina (p. ej. `esencia`), se verán afectados igual. Los repos corporativos que usan SSH (`git@github.com:...`) no se ven afectados por esto, al ser un mecanismo de auth completamente distinto.

## Alternativas futuras (si el enfoque actual deja de ser viable)

El enfoque actual (servidor Node.js nativo `server.js`, capturado por Vercel sin configuración adicional, sección 3) ya resolvió los problemas de raíz de los dos intentos anteriores (`@nuxtjs/vercel-builder` y el script de build propio con `@vercel/nft`). Si en el futuro este enfoque también deja de funcionar (p. ej. Vercel deja de soportar el patrón "Node.js server", o Node 22.x deja de estar soportado), las opciones a evaluar, de menor a mayor esfuerzo:
1. Actualizar `engines.node` a la siguiente versión LTS soportada por Vercel en su momento (el patrón `server.js` + `.listen()` no depende de shims frágiles como `jiti`/`esm`, así que subir de versión de Node debería ser mucho menos problemático que con el builder abandonado).
2. Revisar la documentación vigente de Vercel sobre despliegue de servidores Node.js (`/docs/functions/runtimes/node-js`), por si el patrón de detección cambia.
3. Como último recurso, y solo si se acepta perder SSR: migrar a `nuxt generate` (sitio estático) + funciones serverless independientes para las rutas de `/api` (habría que volver a usar la carpeta `/api` para eso, ya que en ese escenario sí sería la convención deseada).
4. Migración completa a Nuxt 3/4 (Vue 3), que sí tiene soporte nativo y mantenido para Vercel — descartado por ahora por ser un esfuerzo mucho mayor (reescritura de módulos incompatibles como `element-ui`, `nuxt-i18n`, `@nuxt/content` v1, `vuex`, etc.), pero sería la solución "correcta" a largo plazo dado que Nuxt 2 alcanzó su EOL.
