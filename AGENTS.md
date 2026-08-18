# AGENTS.md

Guía de contexto para agentes de IA (Copilot CLI, Copilot Coding Agent, etc.) que trabajen en este repositorio. Documenta la arquitectura, el historial de la migración Heroku → Vercel y los problemas ya resueltos, para evitar repetir investigación o reintroducir errores.

## Qué es este proyecto

Blog personal y CV de Juan Manuel López Pazos, hecho en **Nuxt 2** (SSR) con Vue 2, más una **API Express** montada como middleware de Nuxt (`api/`) que sirve datos del CV (empresas, experiencia profesional, tecnologías, proyectos personales, formación extra, conocimientos).

- `pages/`, `layouts/`, `components/`, `store/`, `plugins/`, `middleware/`: app Nuxt estándar.
- `content/`: posts del blog en Markdown, gestionados con `@nuxt/content`.
- `api/`: API Express independiente, registrada en Nuxt vía `serverMiddleware` en `nuxt.config.js`.
  - `api/index.js`: entrypoint Express.
  - `api/router.js` + `api/routes/`: definición de rutas.
  - `api/controllers/`: lógica de cada recurso (companies, professionalExperience, technology, knowledge, personalProject, extraTraining).
  - `api/data/*.json`: **datos estáticos** que sustituyen a la antigua base de datos MongoDB (ver migración más abajo).
  - `api/validations/`: validaciones con `joi` / `express-validation`.
- `locales/`: i18n (`es`), usado vía `import` ES module en `nuxt.config.js`.
- `server/ssr.js`: entrypoint de la función serverless de Vercel (ver sección 3 de despliegue). Usa la API programática de Nuxt (`loadNuxt('start')`) para servir SSR + la API `/api` + estáticos, todo desde una sola función.
- `scripts/vercel-build.js`: script de build propio ejecutado por Vercel (`npm run vercel-build`) que genera la estructura `.vercel/output/` (Build Output API v3) a mano, sustituyendo al abandonado `@nuxtjs/vercel-builder`.

## Historial de migración (contexto importante)

### 1. Eliminación de MongoDB → datos estáticos
El proyecto originalmente usaba MongoDB (Heroku add-on) para servir los datos del CV. Se migró todo a ficheros JSON estáticos en `api/data/`:
- Se extrajeron los datos reales desde la API de producción (antes de apagarla).
- Se reescribieron todos los controllers de `api/controllers/` para leer de los JSON en vez de hacer queries con Mongoose.
- Se eliminó `mongoose` y cualquier dependencia de conexión a BD del `package.json`.
- **Importante**: si se necesita modificar el contenido del CV, hay que editar directamente los ficheros en `api/data/*.json`, no existe base de datos.

### 2. Eliminación de Heroku
- No quedan referencias de infraestructura Heroku en el código (las únicas menciones a `herokuapp.com` que puedan aparecer son URLs dentro de JSON de descripciones de proyectos del CV, no configuración real).
- El "plugin DNS" de Heroku (si se menciona en conversaciones previas) es una funcionalidad del dashboard de Heroku, no código del repo.
- Variables de entorno de Heroku (`HOST`, `NODE_ENV`, `NPM_CONFIG_PRODUCTION`) **no son necesarias en Vercel** y se eliminaron del proyecto de Vercel:
  - `HOST`: específico del binding de Heroku.
  - `NODE_ENV`: Vercel lo gestiona automáticamente.
  - `NPM_CONFIG_PRODUCTION`: **activamente perjudicial** en Vercel, impide instalar devDependencies necesarias para el build de Nuxt.
- La única variable de entorno necesaria es `BASE_URL` (debe incluir el prefijo `/api`, ver más abajo).

### 3. Despliegue en Vercel: script de build propio (Build Output API v3)

**Historia**: inicialmente se intentó usar el paquete legacy `@nuxtjs/vercel-builder` (última versión `0.25.0`, abril 2024, sin mantenimiento activo), que es la única opción "oficial" documentada para Nuxt 2 en Vercel. Tras muchas horas de debugging (ver detalle en "Incidencias ya resueltas" más abajo) se concluyó que ese builder es **fundamentalmente incompatible con Node ≥22** y además tiene un mecanismo de empaquetado de ficheros (`serverFiles`) frágil y manual que obligaba a listar uno a uno cada fichero/dependencia transitiva que Nuxt carga dinámicamente en runtime.

**Solución actual**: se abandonó `@nuxtjs/vercel-builder` por completo. En su lugar, `package.json` define un script `vercel-build` (`scripts/vercel-build.js`) que Vercel detecta y ejecuta automáticamente, generando a mano la estructura nativa **Build Output API v3** de Vercel (`.vercel/output/`) — el mismo formato que usan internamente los builders oficiales, sin depender de ningún paquete de terceros para el empaquetado.

Qué hace `scripts/vercel-build.js`:
1. Ejecuta `npm run build` (build normal de Nuxt, genera `.nuxt/dist`).
2. Usa `@vercel/nft` (paquete oficial de Vercel para dependency tracing — el mismo motor que usa `@vercel/node` internamente) para rastrear automáticamente las dependencias reales de `server/ssr.js`. Esto es mucho más fiable que mantener a mano una lista de `serverFiles`.
3. Copia además ficheros/carpetas que Nuxt necesita en runtime pero que `@vercel/nft` no puede rastrear por ser `require`s dinámicos con rutas variables (no detectables estáticamente): `nuxt.config.js`, `.nuxt/`, `locales/`, `content/`, `api/`.
4. Excluye explícitamente `.env` del bundle (nunca deben subirse secretos locales; las env vars reales las inyecta Vercel).
5. Copia `static/` a `.vercel/output/static/` para que esos ficheros (favicon, imágenes, robots.txt) se sirvan directamente por el CDN de Vercel, sin invocar la función serverless.
6. Escribe `.vercel/output/functions/index.func/.vc-config.json` con `runtime: "nodejs22.x"` y `handler: "server/ssr.js"`.
7. Escribe `.vercel/output/config.json` con rutas: primero intenta servir como fichero estático (`handle: "filesystem"`), y si no hay match, cae a la función serverless (`dest: "/index"`).

`server/ssr.js` es el entrypoint de la función serverless: usa la API programática oficial de Nuxt (`require('nuxt').loadNuxt('start')`) para arrancar la app ya compilada y delegar cada request en `nuxt.server.app(req, res)`. Es código nuestro, simple, sin shims de terceros — ya no depende de `jiti`/`esm` para cargar `nuxt.config.js` en producción (aunque `@nuxt/config`, usado internamente por `loadNuxt`, sigue usando `jiti` bajo el capó — pero de forma nativa y correctamente empaquetada, no vía el launcher casero y roto del builder abandonado).

Con este enfoque **ya no existe `vercel.json`** — Vercel detecta el script `vercel-build` de `package.json` automáticamente y usa el `.vercel/output/` que generamos.

**Cómo probar el build completo localmente antes de desplegar:**
```bash
node scripts/vercel-build.js
# inspecciona .vercel/output/functions/index.func/ (debe contener node_modules,
# nuxt.config.js, .nuxt/, locales/, content/, api/, server/ssr.js, .vc-config.json)
# y .vercel/output/static/ (favicon, imágenes, etc.)

# probar el handler real generado, simulando una petición HTTP:
cd .vercel/output/functions/index.func
node -e "
process.env.BASE_URL = 'http://localhost:3000/api';
const http = require('http');
const handler = require('./server/ssr.js');
const server = http.createServer((req, res) => handler(req, res).catch(e => { console.error(e); res.statusCode=500; res.end('err'); }));
server.listen(3000, () => console.log('listening on 3000'));
"
# en otra terminal:
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

**Esto fue la señal definitiva para abandonar `@nuxtjs/vercel-builder`** y migrar al script de build propio con `@vercel/nft` (sección 3), que rastrea automáticamente TODAS las dependencias reales en vez de requerir mantenerlas a mano.

## Estado actual de `package.json` relevante para el deploy

```json
"scripts": {
  "vercel-build": "node scripts/vercel-build.js"
  // ...resto de scripts
},
"dependencies": {
  "esm": "^3.2.25",
  "jiti": "^2.7.0",
  "node-fetch-native": "1.6.7"
  // ...resto de dependencias de la app
},
"devDependencies": {
  "@vercel/nft": "^0.29.4"
  // ...resto (@nuxtjs/vercel-builder YA NO se usa, puede eliminarse de
  // devDependencies en una futura limpieza si no se necesita para nada más)
},
"engines": {
  "node": "22.x",
  "npm": ">=10"
}
```

`esm`, `jiti` y `node-fetch-native` se añadieron como dependencias directas cuando aún se usaba `@nuxtjs/vercel-builder`. Con el script de build propio (`@vercel/nft`) probablemente ya no son estrictamente necesarias como directas — el tracing automático las detectaría igual como transitivas — pero se han dejado así por precaución/no repetir regresiones. No hacen daño.

## Variables de entorno necesarias en Vercel

Solo una:
- `BASE_URL`: URL base de la API, **debe incluir el sufijo `/api`** (p. ej. `https://tu-dominio.vercel.app/api`). Si falta el sufijo, reaparecerá el bug de la sección A (fallos de SSR en `/curriculum`, `/blog`, etc. por llamadas axios mal dirigidas).

No añadir `HOST`, `NODE_ENV` ni `NPM_CONFIG_PRODUCTION` (ver sección "Eliminación de Heroku").

## Cómo probar cambios de Node/dependencias localmente antes de desplegar

Dado lo frágil que puede ser este stack (Nuxt 2 en Vercel), **siempre verificar localmente con la misma versión de Node que se usará en Vercel antes de hacer commit/deploy**. La forma más fiel de probarlo es ejecutar directamente el script de build (ver sección 3 más arriba: `node scripts/vercel-build.js` + probar el handler generado con un servidor HTTP local). El siguiente procedimiento adicional sigue siendo útil para descartar problemas de compatibilidad de Node en la instalación de dependencias/build de Nuxt en sí (independientemente del empaquetado para Vercel):

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

El enfoque actual (script de build propio + Build Output API v3, sección 3) ya resolvió el problema de raíz de `@nuxtjs/vercel-builder`. Si en el futuro este enfoque también deja de funcionar (p. ej. cambios en el formato de Build Output API de Vercel, o Node 22.x deja de estar soportado), las opciones a evaluar, de menor a mayor esfuerzo:
1. Actualizar `engines.node` a la siguiente versión LTS soportada por Vercel en su momento (el script de build propio no depende de shims frágiles como `jiti`/`esm` para cargar la config en producción, así que subir de versión de Node debería ser mucho menos problemático que con el builder abandonado).
2. Revisar la documentación vigente de Vercel sobre Build Output API (puede evolucionar de v3 a versiones futuras).
3. Como último recurso, y solo si se acepta perder SSR: migrar a `nuxt generate` (sitio estático) + funciones serverless independientes para las rutas de `/api`.
4. Migración completa a Nuxt 3/4 (Vue 3), que sí tiene soporte nativo y mantenido para Vercel — descartado por ahora por ser un esfuerzo mucho mayor (reescritura de módulos incompatibles como `element-ui`, `nuxt-i18n`, `@nuxt/content` v1, `vuex`, etc.), pero sería la solución "correcta" a largo plazo dado que Nuxt 2 alcanzó su EOL.
