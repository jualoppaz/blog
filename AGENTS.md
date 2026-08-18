# AGENTS.md

Guía de contexto para agentes de IA (Copilot CLI, Copilot Coding Agent, etc.) que trabajen en este repositorio. Documenta la arquitectura, el historial de la migración Heroku → Vercel y los problemas ya resueltos, para evitar repetir investigación o reintroducir errores.

## Qué es este proyecto

Blog personal y CV de Juan Manuel López Pazos, hecho en **Nuxt 2** (SSR) con Vue 2, más una **API Express** montada como middleware de Nuxt (`api/`) que sirve datos del CV (empresas, experiencia profesional, tecnologías, proyectos personales, formación extra, conocimientos).

- `pages/`, `layouts/`, `components/`, `store/`, `plugins/`, `middleware/`: app Nuxt estándar.
- `content/`: posts del blog en Markdown, gestionados con `@nuxt/content`.
- `server-api/`: API Express independiente, registrada en Nuxt vía `serverMiddleware` en `nuxt.config.js`. **Renombrada desde `api/`** durante un intento de despliegue descartado (ver sección de despliegue) — se mantiene así aunque ya no sea estrictamente necesario con la solución final, para no volver a tocar nada que ya funciona.
  - `server-api/index.js`: entrypoint Express.
  - `server-api/router.js` + `server-api/routes/`: definición de rutas.
  - `server-api/controllers/`: lógica de cada recurso (companies, professionalExperience, technology, knowledge, personalProject, extraTraining).
  - `server-api/data/*.json`: **datos estáticos** que sustituyen a la antigua base de datos MongoDB (ver migración más abajo).
  - `server-api/validations/`: validaciones con `joi` / `express-validation`.
- `locales/`: i18n (`es`), usado vía `import` ES module en `nuxt.config.js`.
- `vercel.json`: configura el despliegue en Vercel usando el builder oficial (aunque no activamente mantenido) `@nuxtjs/vercel-builder` — ver sección de despliegue.

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
- No hace falta ninguna variable de entorno para la URL de la API (se resuelve dinámicamente por request, ver incidencia I más abajo).

### 3. Despliegue en Vercel: builder oficial `@nuxtjs/vercel-builder` (solución final)

**Historia completa (por orden cronológico, para no repetir el mismo camino ni las mismas pruebas):**

1. **Intento 1 — `@nuxtjs/vercel-builder` "a pelo"**: se usó directamente sin ajustes finos. Aparecieron varios problemas de compatibilidad de Node (`esm`/`jiti` rotos bajo Node ≥24) y de `serverFiles` incompletos (`locales/`, `node-fetch-native` faltantes). Ver detalle en "Incidencias ya resueltas" (A-E). Se solucionaron uno a uno: fijar `engines.node` a `22.x` (versión con la que `jiti` funciona correctamente) y completar `serverFiles` en `vercel.json`.
2. **Intento 2 — script de build propio con `@vercel/nft`**: ante la fragilidad percibida del builder legacy, se probó sustituirlo por un script propio (`scripts/vercel-build.js`, ya eliminado) que generaba a mano la estructura Build Output API v3 usando `@vercel/nft` para el tracing automático de dependencias. Funcionaba perfectamente en local, pero en Vercel **entró en un bucle infinito de builds** (causa: `nuxt build` deja el event loop de Node vivo por handles de webpack/chokidar sin cerrar, así que aunque el script terminaba con éxito el proceso nunca salía, y Vercel reintentaba el build indefinidamente). Se corrigió forzando `process.exit(0)`, pero el enfoque se consideró innecesariamente complejo para el problema real.
3. **Intento 3 — patrón oficial "Node.js server" (`server.js` + `.listen()`)**: se probó el patrón zero-config más simple documentado por Vercel (un `server.js` en la raíz que Vercel detecta y captura solo). Para que funcionase hubo que cambiar el Framework Preset del proyecto a "Other" (si no, la integración zero-config de Nuxt.js de Vercel ignora el `server.js` y ejecuta su propio flujo, esperando encontrar un `dist/` estático que nunca se genera). Al usar "Other" surgió un problema nuevo: Vercel también auto-detecta cualquier `.js` dentro de una carpeta `/api` como función serverless independiente — de ahí el renombrado `api/` → `server-api/`. **Se descartó este enfoque** por decisión explícita: se prefirió volver a una solución más simple usando exclusivamente el builder oficial/histórico de Vercel para Nuxt, sin entrypoints ni servidores custom.
4. **Solución final y actual — volver a `@nuxtjs/vercel-builder`, ya con todos los fixes de compatibilidad aplicados**: `vercel.json` usa el builder con `serverFiles` actualizado a la carpeta renombrada:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "nuxt.config.js",
      "use": "@nuxtjs/vercel-builder",
      "config": {
        "serverFiles": ["server-api/**", "locales/**", "content/**"]
      }
    }
  ]
}
```
No hay `server.js` ni `scripts/vercel-build.js` ni script `vercel-build` en `package.json` — el builder gestiona su propio flujo de build (`nuxt build --standalone`) y empaquetado internamente. Requisitos para que esto funcione (ya cumplidos en el repo):
- `engines.node: "22.x"` en `package.json` (Node 24.x rompe el loader `jiti`/`esm` del launcher del builder).
- `esm` y `jiti` como dependencias directas (no solo transitivas), para que el builder las incluya en el bundle.
- `serverFiles` en `vercel.json` debe incluir explícitamente cualquier carpeta que Nuxt cargue dinámicamente en runtime y que el builder no rastree solo: `server-api/**` (antes `api/**`), `locales/**` y `content/**` (los `.md` que lee `@nuxt/content` en runtime).
- **Framework Preset del proyecto en Vercel debe ser "Other"** (no "Nuxt.js"), porque `vercel.json` con `builds` explícitos requiere que Vercel no aplique su propia integración zero-config de Nuxt.js por encima.

**Verificado localmente (Node 22, `vercel build` vía CLI)**: el build se completa sin errores y genera un bundle con `server-api/**`, `locales/**` y `node-fetch-native` correctamente incluidos en `filePathMap`.

**IMPORTANTE — nunca ejecutar `vercel build` (ni `vercel deploy`/`vercel --prod` desde CLI) directamente sobre el repo real de trabajo.** El builder `@nuxtjs/vercel-builder` reescribe/colapsa `package.json` como efecto secundario de su proceso interno (se ha visto renombrar `nuxt` → `@nuxt/core`, entre otras mutaciones) — esto ya ha ocurrido dos veces en esta migración. Si se necesita probar el build de Vercel localmente, hacerlo en una copia aislada del proyecto en otro directorio (con instalación de dependencias limpia, no copiada), nunca en el working directory real. Preferir siempre dejar que el propio Vercel (tras `git push`) ejecute el build en su infraestructura, y usar `vercel inspect --logs` / `vercel logs` para depurar.

## Incidencias ya resueltas (no repetir el diagnóstico)

> **Nota**: las incidencias A-E de abajo ocurrieron mientras se depuraba `@nuxtjs/vercel-builder` (la solución final y actual, ver sección 3). Sus fixes siguen aplicando. Las incidencias F y G documentan los dos intentos alternativos que se probaron y se descartaron (script de build propio, y patrón `server.js`).

### A. Crash SSR "circular reference" en `/curriculum`
No era un problema real de referencia circular en Vue/devalue (aunque el mensaje de error `Maximum call stack size exceeded` en `devalue` es engañoso y sugiere justo eso). La causa raíz era que una llamada axios fallaba (401/error de red) y esa promesa rechazada quedaba sin capturar; el objeto `AxiosError` crudo (con funciones internas como `transformRequest`, `httpAdapter`, etc.) se intentaba serializar para hidratación, lo que producía el stack overflow. **Ver incidencia I para la causa concreta y el fix definitivo** (baseURL dinámico por request, sin depender de variables de entorno). Si reaparece este error, el primer sospechoso siempre debe ser una llamada axios que esté fallando silenciosamente en el servidor, no una referencia circular real.

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

### E. `Cannot find module '../package.json'` / launcher sigue fallando por ficheros faltantes
Incluso arreglando el loader de `jiti`/`esm` con Node 22.x, el builder seguía fallando porque su `serverFiles` (configurado manualmente en `vercel.json`) no incluía TODOS los ficheros que Nuxt necesita en runtime: primero faltó `locales/**` (usado por `nuxt.config.js` vía `import es from './locales/es'`), luego faltó el paquete transitivo `node-fetch-native` (usado por `@nuxt/vue-app`, no listado como dependencia directa). **Fix**: añadir `locales/**` a `serverFiles` en `vercel.json`, y `node-fetch-native` como dependencia directa en `package.json`.

### F. (Intento descartado) Script de build propio con `@vercel/nft` en bucle infinito de builds
Se probó sustituir `@nuxtjs/vercel-builder` por un script propio (`scripts/vercel-build.js`, ya eliminado) que generaba a mano la estructura Build Output API v3 usando `@vercel/nft` para el tracing de dependencias. Funcionaba perfectamente en local, pero en Vercel el build se repetía indefinidamente en bucle (visible en los logs como el mismo "Running npm run vercel-build" ejecutándose una y otra vez sin fin). Causa: `nuxt build` deja el event loop de Node vivo (webpack/chokidar no cierran todos sus handles al terminar), así que aunque el script terminaba su trabajo con éxito ("✔ Build Output API v3 generated"), el proceso de Node nunca salía — Vercel interpretaba esto como un build colgado y lo reintentaba desde cero repetidamente.

Este enfoque se **descartó por decisión explícita** en favor de volver al builder oficial (sección 3), por resultar innecesariamente complejo para lo que se necesitaba.

### G. (Intento descartado) Patrón `server.js` + Vercel auto-detectando `api/` como funciones serverless independientes
Se probó el patrón oficial "Node.js server" de Vercel (`server.js` en la raíz con `.listen()`), que requería cambiar el Framework Preset a "Other". Al hacerlo, Vercel empezó a aplicar su otra convención zero-config: tratar cada `.js` dentro de una carpeta `/api` en la raíz como una función serverless independiente. La carpeta `api/` (la API Express montada como `serverMiddleware` de Nuxt) tiene ficheros como `router.js` o los `controllers/*.js` que no son handlers `(req,res)=>...` válidos, causando fallos. Se renombró `api/` → `server-api/` como solución a esto.

Este enfoque también se **descartó por decisión explícita** en favor de volver al builder oficial (sección 3) — pero el renombrado `server-api/` se mantuvo (no aporta ni quita nada funcionalmente con el builder oficial, y evita otro cambio innecesario).

### H. Tras volver al builder: `Error: /posts not found` (contenido de `@nuxt/content` no incluido)
Al recuperar `@nuxtjs/vercel-builder`, se restauró `serverFiles: ["server-api/**", "locales/**"]` tal cual estaba antes de los intentos F/G, sin recordar que `content/**` (los `.md` que `@nuxt/content` lee dinámicamente en runtime, incluida `content/posts/`) también hace falta explícitamente en `serverFiles` — no es un módulo de `node_modules` que el builder rastree por dependencias, sino ficheros de datos sueltos en el repo. **Fix**: añadir `content/**` a `serverFiles` en `vercel.json`.

### I. `Maximum call stack size exceeded` en SSR de `/curriculum` — causa real: baseURL de axios apuntando a la URL interna del deployment (401 por SSO)
Tras resolver A-H, siguió fallando `/curriculum` (y cualquier ruta que dispara `nuxtServerInit`/llamadas a la propia API en SSR) con `Maximum call stack size exceeded` en `node_modules/@nuxt/devalue`. Se diagnosticó con logs (`console.log`/`console.error` temporales en `store/curriculum.js`, ya revertidos) capturando `npx vercel logs <url>` mientras se disparaba la petición real. El log mostró la causa exacta: una llamada axios a `/cv/knowledge` fallaba con `401 ERR_BAD_REQUEST`, y esa promesa rechazada quedaba sin capturar (`UnhandledPromiseRejection`) porque ninguna action de las stores tenía `.catch`.

La causa del 401: se había intentado fijar `baseURL` en el servidor usando `VERCEL_URL` (variable que Vercel define automáticamente), pero **`VERCEL_URL` apunta a la URL interna/inmutable del deployment concreto** (tipo `blog-xxxxx-usuario-projects.vercel.app`), **no al dominio/alias que visita el usuario**, y esas URLs de deployment individuales tienen la protección SSO de Vercel activada por defecto → cualquier llamada HTTP directa a ellas (como la que hace axios en SSR) devuelve 401. El objeto `AxiosError` resultante, al intentar serializarse para hidratación (`devalue`), contiene funciones internas (`transformRequest`, `httpAdapter`, etc.) que `devalue` no sabe serializar, entrando en el bucle que termina en el stack overflow.

**Fix definitivo** (sin depender de ninguna variable de entorno, funciona igual en `*.vercel.app`, dominio final o localhost):
- `plugins/axios.js` (nuevo, `mode: 'server'` en `nuxt.config.js`): en cada petición SSR, lee `req.headers.host` (el dominio real por el que el usuario está accediendo) y `req.headers['x-forwarded-proto']` (protocolo), y hace `$axios.setBaseURL(...)` con ese host antes de que se disparen las llamadas a la API. Esto es necesario porque `nuxt.config.js` solo se evalúa una vez al arrancar el proceso (no hay `req` disponible ahí), mientras que un plugin de Nuxt se ejecuta en cada request y sí recibe el contexto con `req`.
- `nuxt.config.js`: `serverBaseURL` es un valor fijo `http://localhost:3000/api`, sin leer ninguna variable de entorno — solo se usa como valor inicial antes de que el plugin lo sobreescriba en la primera petición real; en desarrollo local (`npm run dev`) el plugin hace exactamente lo mismo con el host de `localhost:3000`.

**Lección para el futuro**: no usar `VERCEL_URL` para construir URLs que la propia función SSR va a llamar por HTTP — solo sirve como identificador informativo, no como endpoint accesible sin autenticación. Para llamadas "a uno mismo" en SSR, usar siempre el host de la petición entrante (`req.headers.host`).

## Estado actual de `package.json` / `vercel.json` relevante para el deploy

```json
// package.json
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
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "nuxt.config.js",
      "use": "@nuxtjs/vercel-builder",
      "config": {
        "serverFiles": ["server-api/**", "locales/**", "content/**"]
      }
    }
  ]
}
```

No hay script `vercel-build` en `package.json` — el builder `@nuxtjs/vercel-builder` gestiona su propio proceso de build internamente (`nuxt build --standalone`).

## Variables de entorno necesarias en Vercel

Ninguna relacionada con la URL de la API. El `baseURL` de axios en SSR se resuelve dinámicamente en cada petición a partir del host real (`req.headers.host`, ver `plugins/axios.js` e incidencia I).

No añadir `HOST`, `NODE_ENV` ni `NPM_CONFIG_PRODUCTION` (ver sección "Eliminación de Heroku").

**Framework Preset en Vercel (Project Settings → General):** debe estar en **"Other"**. Con `vercel.json` definiendo `builds` explícitamente, Vercel debe respetar esa configuración en vez de aplicar cualquier integración zero-config propia (p. ej. la de "Nuxt.js"), que la ignoraría.

## Cómo probar cambios de Node/dependencias localmente antes de desplegar

Dado lo frágil que puede ser este stack (Nuxt 2 en Vercel), **siempre verificar localmente con la misma versión de Node que se usará en Vercel antes de hacer commit/deploy**. **No usar `vercel build`/`vercel deploy` en el repo real** (ver aviso en la sección 3 sobre corrupción de `package.json`) — para probar el build completo del builder oficial, hacerlo en una copia aislada del proyecto en otro directorio. Para descartar simplemente problemas de compatibilidad de Node en la instalación de dependencias/build de Nuxt en sí (sin tocar el flujo de Vercel), basta con:

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

El enfoque actual (`@nuxtjs/vercel-builder`, sección 3) es el builder histórico/oficial de Vercel para Nuxt 2, ya con todos los problemas de compatibilidad conocidos resueltos (Node 22.x, `serverFiles` completos, `esm`/`jiti` como dependencias directas). Se probaron y descartaron dos alternativas más "modernas" (script de build propio con `@vercel/nft`, patrón `server.js`) por no aportar beneficio real frente a la complejidad añadida — ver incidencias F y G. Si en el futuro este enfoque deja de funcionar (p. ej. Node 22.x deja de estar soportado, o el builder deja de ser instalable), las opciones a evaluar, de menor a mayor esfuerzo:
1. Revisar si hay una versión más reciente de `@nuxtjs/vercel-builder` que solucione problemas de compatibilidad con versiones de Node más nuevas.
2. Reconsiderar el patrón oficial "Node.js server" (`server.js` + `.listen()`, incidencia G) — el problema que llevó a descartarlo (`api/` auto-detectada como funciones) ya tiene solución conocida (`server-api/`), así que sería más rápido de retomar si hiciera falta.
3. Como último recurso, y solo si se acepta perder SSR: migrar a `nuxt generate` (sitio estático) + funciones serverless independientes para las rutas de `/api`.
4. Migración completa a Nuxt 3/4 (Vue 3), que sí tiene soporte nativo y mantenido para Vercel — descartado por ahora por ser un esfuerzo mucho mayor (reescritura de módulos incompatibles como `element-ui`, `nuxt-i18n`, `@nuxt/content` v1, `vuex`, etc.), pero sería la solución "correcta" a largo plazo dado que Nuxt 2 alcanzó su EOL.
