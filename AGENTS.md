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

### 3. Despliegue en Vercel con `@nuxtjs/vercel-builder`
Nuxt 2 no tiene soporte nativo/moderno para Vercel (a diferencia de Nuxt 3), así que se usa el paquete legacy `@nuxtjs/vercel-builder` (última versión publicada: `0.25.0`, abril 2024; el proyecto no tiene mantenimiento activo).

`vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "nuxt.config.js",
      "use": "@nuxtjs/vercel-builder",
      "config": { "serverFiles": ["api/**"] }
    }
  ]
}
```
Esto usa el formato **classic Build Output API v2** (`builds`/`use`), lo cual **desactiva la autodetección de framework de Vercel** (es intencional, no un bug). El "Framework Preset" en el dashboard de Vercel no aplicará; toda la responsabilidad de compatibilidad de Node recae en el propio builder.

`serverFiles: ["api/**"]` asegura que los ficheros de la API Express (controllers, data, etc.) se empaqueten dentro de la función serverless.

## Incidencias ya resueltas (no repetir el diagnóstico)

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

## Estado actual de `package.json` relevante para el deploy

```json
"dependencies": {
  "esm": "^3.2.25",
  "jiti": "^2.7.0"
  // ...resto de dependencias de la app
},
"devDependencies": {
  "@nuxtjs/vercel-builder": "0.25.0"
  // ...resto
},
"engines": {
  "node": "22.x",
  "npm": ">=10"
}
```

`esm` y `jiti` deben permanecer como **dependencias directas** (no solo transitivas) para garantizar que `@nuxtjs/vercel-builder` los empaquete en el bundle de la función serverless.

## Variables de entorno necesarias en Vercel

Solo una:
- `BASE_URL`: URL base de la API, **debe incluir el sufijo `/api`** (p. ej. `https://tu-dominio.vercel.app/api`). Si falta el sufijo, reaparecerá el bug de la sección A (fallos de SSR en `/curriculum`, `/blog`, etc. por llamadas axios mal dirigidas).

No añadir `HOST`, `NODE_ENV` ni `NPM_CONFIG_PRODUCTION` (ver sección "Eliminación de Heroku").

## Cómo probar cambios de Node/dependencias localmente antes de desplegar

Dado lo frágil que es este stack (Nuxt 2 + builder legacy), **siempre verificar localmente con la misma versión de Node que se usará en Vercel antes de hacer commit/deploy**:

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

## Alternativas futuras (si `@nuxtjs/vercel-builder` deja de ser viable)

Si en el futuro Node 22.x también deja de estar soportado, o el builder deja de funcionar por otro motivo, las opciones evaluadas (no implementadas) son:
1. Buscar una versión más nueva de `@nuxtjs/vercel-builder` que arregle la compatibilidad de loaders.
2. Escribir una función serverless propia (`api/index.js` como catch-all) que instancie directamente `Nuxt`/`Builder`/renderer de Nuxt 2, sin pasar por el launcher del builder (evita el problema de raíz, pero requiere más mantenimiento manual).
3. Convertir `nuxt.config.js` a CommonJS puro (sin `import`/`export default`, usando `require`/`module.exports`) para eliminar la necesidad de cualquier shim de carga ESM — habría que revisar si esto es compatible con el resto de la config (usa `import es from './locales/es'`).
4. Como último recurso, y solo si se acepta perder SSR: migrar a `nuxt generate` (sitio estático) + funciones serverless independientes para las rutas de `/api`.
