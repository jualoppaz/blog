---
title: "¿Qué son los microfrontends? Introducción a single-spa"
image: /images/blog/posts/2021-06-07-que-son-los-microfrontends-introduccion-a-single-spa.jpg
tags: ['technologies']
metas: { 
  description: "En este artículo se explica qué son los microfrontends y cómo implementarlos con single-spa, así como la aportación que he realizado a la comunidad.",
  author: 'Juan Manuel López Pazos',
  keywords: "nuxt, microfrontends, single-spa, paquetes npm, webpack, vue",
  canonical_url: "http://www.juanmanuellopezpazos.es/blog/posts/2021-06-07-que-son-los-microfrontends-introduccion-a-single-spa",
  og_title: "¿Qué son los microfrontends? Introducción a single-spa",
  og_type: "article",
  article_published_time: "2021-02-08T21:40:15.000Z",
  article_author: "https://www.facebook.com/jualoppaz",
  og_image: "/images/blog/posts/2021-06-07-que-son-los-microfrontends-introduccion-a-single-spa.jpg",
  og_url: "http://www.juanmanuellopezpazos.es/blog/posts/2021-06-07-que-son-los-microfrontends-introduccion-a-single-spa",
  og_description: "En este artículo se explica qué son los microfrontends y cómo implementarlos con single-spa, así como la aportación que he realizado a la comunidad.",
  og_site_name: BLOG - JMLP,
  twitter_site: "@LopezPazos14",
  twitter_card: summary,
  twitter_image: "/images/blog/posts/2021-06-07-que-son-los-microfrontends-introduccion-a-single-spa.jpg",
  twitter_title: "¿Qué son los microfrontends? Introducción a single-spa",
  twitter_description: "En este artículo se explica qué son los microfrontends y cómo implementarlos con single-spa, así como la aportación que he realizado a la comunidad."
}
comparisionTableData: [
  {
    feature: 'Repositorios separados',
    monorepo: '❌',
    npm: '✅',
    dynamicModules: '✅',
  }, {
    feature: 'Compilaciones independientes',
    monorepo: '✅',
    npm: '✅',
    dynamicModules: '✅'
  }, {
    feature: 'Despliegues independientes',
    monorepo: '✅',
    npm: '❌',
    dynamicModules: '✅'
  }, {
    feature: 'Compilación y despliegue con cambios',
    monorepo: '❌ Todas las apps',
    npm: '☑️ Principal y app afectada',
    dynamicModules: '✅ Sólo app afectada'
  }, {
    feature: 'Cambios en caliente',
    monorepo: '❌',
    npm: '❌',
    dynamicModules: '✅'
  },
]
published: true
creationDate: '2021-06-07T21:40:15.000Z'
---

Llevaba mucho tiempo queriendo hacer este artículo, ya que llevo tiempo trabajando en él y trata sobre uno de los conceptos que he aprendido recientemente en mi trabajo. Todo se lo debo a [Jesús Carmona Garrido](https://es.linkedin.com/in/jesusc/es "Perfil en LinkedIn de Jesús Carmona Garrido"), con el que trabajaba hasta hace poco en el equipo de innovación de [Accenture](https://www.accenture.com/es-es "Web oficial de Accenture España") (yo trabajo en [Emergya](https://www.emergya.com/es "Web oficial de Emergya España") pero colaboramos juntos en una UTE) y me encargó investigar sobre este concepto para su implantación en distintas aplicaciones web del [SAS](https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/ "Web oficial del SAS: Servicio Andaluz de Salud") (Servicio Andaluz de Salud). Y así fue: tras ver que nos aportaba muchas ventajas decidimos hacer uso de **microfrontends** mediante [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends"), encargándome yo de realizar una prueba piloto con la estrategia de **paquetes NPM** sobre una aplicación legacy para, posteriormente, evolucionar dicha implantación entre todo el equipo para llegar a disfrutar de las ventajas de la **carga dinámica de módulos**.

Por todo esto, creía necesario contar mi experiencia con los **microfrontends** y mencionar el aporte que he realizado a la comunidad, lo cual detallaré al final del artículo: comencemos.

## ¿Qué son los microfrontends?

El concepto **microfrontend** es bastante reciente y conforma un paradigma que puede suponer una revolución en lo que a desarrollo de aplicaciones web se refiere. Si tienes conocimientos de **backend** seguramente estarás familiarizado con el concepto **microservicio**: pues un **microfrontend** lo podemos equiparar a un **microservicio** en el **frontend**.

Esta idea se basa en la descomposición de una web en pequeños componentes, los cuales podrán estar desarrollados con tecnologías totalmente distintas e incluso por equipos de trabajo independientes. De este modo, también podemos independizar el funcionamiento de dichos componentes, de modo que una caída de un **microfrontend** no supondría la caída del resto.

Hay varios frameworks para poder implementar esta estrategia, pero nosotros nos vamos a centrar en uno: [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends").

<advertisement></advertisement>

## single-spa

[single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") es un framework que nos permitirá implementar de forma sencilla una aplicación web mediante **microfrontends**. De hecho, en la web oficial de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") hay una frase en el subtítulo que es muy reveladora: <q>a javascript router for frontend microservices</q>. Es decir, que podemos definir [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") como un enrutador que se sitúa sobre nuestras aplicaciones para orquestar el funcionamiento de las mismas.

El funcionamiento de este framework es muy sencillo y se precisa de lo siguiente:

1. Se debe desarrollar cada **microfrontend** (en [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") se llaman **aplicaciones registradas**) de forma independiente
2. Se debe ajustar el enrutado de cada aplicación para que [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") funcione correctamente sobre las mismas
3. Se registra cada **microfrontend** de forma individual como una aplicación registrada, indicando en qué momento debe estar activa cada aplicación
4. Se habilita un punto de montaje en el **index.html** principal donde montar cada una de las **aplicaciones registradas**
5. Se inicia la aplicación [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends"), dejando que el enrutado principal mande sobre los demás

A grosso modo estos son los pasos que hay que seguir. Sin embargo, dependiendo de la estrategia que utilicemos para montar nuestro **microfrontend**, tendremos que aplicar una serie de modificaciones o ajustes adicionales.

### ¿Cómo funciona single-spa?

[single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") necesita una serie de herramientas y tecnologías para funcionar de forma óptima. Funciona con **ES5**, **ES6+**, **TypeScript**, **Webpack**, **SystemJS**, **Gulp**, **Grunt**, **Bower**, **ember-cli** o cualquier otra herramienta de compilación disponible. Sin embargo, nosotros vamos a poner el foco en **Webpack**, **SystemJS** y en el estándar **ES5**.

Para hacer uso de estas herramientas podemos hacerlo con paquetes **NPM/Bower**, o bien importarlas directamente como un <code class="inline-code language-javascript">`<script>`</code>. En el ejemplo que detallaremos más adelante se explicará con detalle el primer caso de uso, aunque hay otros escenarios que precisan del segundo modo, tal y como veremos en el siguiente apartado.

### Estrategias

Hay diferentes estrategias para implementar una aplicación [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") que integre varios **microfrontends**. A continuación vamos a ver con detalle cada una de ellas y qué ventajas e inconvenientes tienen.

#### Monorepo

Esta estrategia es, según dicen en la propia documentación oficial de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends"), la más sencilla de implementar. Personalmente no creo que esto sea cierto de forma total y absoluta: ahora explicaré por qué.

La estrategia **monorepo** implica que tanto la aplicación principal de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") como las aplicaciones registradas deben encontrarse alojadas en el mismo repositorio.

Dentro de esta estrategia hay 2 variantes: un mismo script de **Webpack** para compilar toda la aplicación generando un fichero de salida para cada módulo, o un script de **Webpack** por cada aplicación registrada, así como para la aplicación anfitriona en la que se alojarán los **microfrontends**.

A pesar de estar catalogada como la estrategia más sencilla de implementar, en cualquiera de los 2 casos considero que tiene su parte de complejidad. En el primero tendríamos que hacer un script de **Webpack** que esté preparado para compilar tanto la aplicación principal como los **microfrontends**, y si cada módulo está implementado con un framework distinto (**Angular**, **Vue**, **React**, ...) nuestro script de **Webpack** se complicará sobremanera. Pero es que en el caso de que se implementen scripts individuales para cada módulo no facilitaremos la tarea: conseguiremos facilitar el compilado de cada módulo, sí, pero trasladeremos la dificultad al despliegue, puesto que tendremos que hacer uso de algún sistema de computación en la nube que esté preparado para tener varios puntos de entrada, o bien implementar nosotros un script que realice el despliegue de forma ordenada.

Por todo esto que acabo de comentar es por lo que afirmo que no veo tan sencilla esta estrategia.

#### Paquetes NPM

Esta estrategia podría ser definida como la intermedia, y es en la que más vamos a ahondar en este post, ya que es la única estrategia de la que no había ejemplos en la web oficial de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") hasta que decidí que eso dejara de ser así 😏.

<el-row>
  <el-col
    :xs="24"
    :sm="24"
    :md="24"
    :lg="24"
  >
    <div class="post-image-container">
      <el-image
        class="post-image"
        src="/images/blog/posts/2021-06-07-se-aceptan-contribuciones-single-spa-paquetes-npm.jpg"
        fit="contain"
        alt="Invitación a contribuir en single-spa con ejemplo de estrategia de microfrontends en paquetes NPM"
      ></el-image>
      <div class="post-image-caption">
        Invitación a contribuir en single-spa con ejemplo de estrategia de microfrontends en paquetes NPM
      </div>
    </div>
  </el-col>
</el-row>

Con la estrategia de distribución en paquetes de **NPM** tendríamos por un lado la aplicación [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") y el resto de aplicaciones registradas por otro, teniéndolas en distintos repositorios para mayor comodidad y publicando cada **microfrontend** en un paquete **NPM** distinto. De este modo, en la aplicación principal importaríamos las aplicaciones registradas como paquetes **NPM** en lugar de hacer uso de los ficheros compilados, generados por **Webpack** o por el procesador que hubiéramos utilizado para compilar cada una de las aplicaciones.

En cualquier caso, todas y cada una de las aplicaciones registradas serán procesadas por **Webpack** y serán incluidas en el compilado final de la aplicación anfitriona, por lo que seguiremos obteniendo un compilado bastante pesado para la carga inicial de la web.

Personalmente, veo más fácil de implementar esta estrategia que la inicial con un **monorepo**. Si sabes desarrollar aplicaciones web por separado, sabrás aplicar también por separado los ajustes necesarios para que funcionen con [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends"), ya que los conceptos a aplicar son siempre los mismos independientemente de los frameworks utilizados en **frontend**.

La mayor complejidad que puede tener esta estrategia es familiarizarse con los despliegues en **NPM**. Yo no había realizado nunca un despliegue de una aplicación o librería en **NPM**, pero siempre hay una primera vez. De hecho, me apunto este tema para explicarlo detalladamente en un post diferente 💡.

<advertisement></advertisement>

#### Carga dinámica de módulos

Ésta es la estrategia más atractiva y que más ventajas puede ofrecer, ya que no sólo permite que cada aplicación se encuentre alojada en un repositorio distinto sino que, además, las dependencias son resueltas en tiempo de ejecución: en lugar de precisar que las aplicaciones registradas estén disponibles antes de compilar la aplicación principal, sólo tenemos que definir una referencia dinámica para cada una de ellas, de modo que cada compilado será obtenido por primera vez en el momento en que se precise.

La pregunta clave en esta estrategia es: <q>¿cómo conseguimos realizar esta **carga dinámica de módulos**?</q> Pues con la ayuda de **SystemJS** y de los **import maps**.

Por un lado tenemos **SystemJS**, que es un cargador de módulos JavaScript. Esta herramienta es la que nos permitirá cargar dinámicamente los módulos, puesto que con otras funcionalidades nativas de EcmaScript como las funciones **define** o los **módulos amd** no vamos a poder hacer un uso correcto y exitoso de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends"). De hecho, tal ha sido la repercusión de esta herramienta que **Webpack** incorporó un **libraryTarget** propio para la misma, lo cual provoca que los compilados troceados por el propio **Webpack** sean encapsulados en métodos **System.register()**, tal y como se puede comprobar en el siguiente [enlace](https://webpack.js.org/configuration/output/#librarytarget-system "libraryTarget de Webpack específico para SystemJS").

Y por el otro lado tenemos los **import maps**. En cuanto leí sobre este concepto por primera vez en la documentación de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") pensé que era algo que introducía el propio framework, o bien que era definido por **SystemJS** para la **carga dinámica de módulos**: pues no. Resulta que los **import maps** son alias que se pueden definir en una etiqueta <code class="inline-code language-javascript">`<script>`</code> en cualquier html de nuestra aplicación, y de este modo le estaremos indicando al navegador de dónde tiene que recuperar cada **microfrontend** una vez que sea solicitado por [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") en el momento de su carga.

Un ejemplo de **import maps** puede ser algo como lo que sigue:

```html
<script type="systemjs-importmap">
  {
    "imports": {
      "@vue-mf/root-config": "//localhost:9000/vue-mf-root-config.js"
    }
  }
</script>
```

Este ejemplo se encuentra en la siguiente [ruta](https://github.com/vue-microfrontends/root-config/blob/master/src/index.ejs 'Ejemplo de import maps con systemjs'), y es el ejemplo oficial de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") para la estrategia con **carga dinámica de módulos**, implementados todos ellos con **Vue**.

Un detalle importante es el valor del campo **type** en la etiqueta <code class="inline-code language-javascript">`<script>`</code>, el cual debe ser **systemjs-importmap** para que sea procesado de forma manual por **SystemJS** cuando así lo demandemos y no de forma nativa por el navegador utilizado.

Y lo mejor de todo que es con **SystemJS** y los **import maps** no sólo podemos definir las rutas de nuestros **microfrontends**, sino también de las dependencias utilizadas en nuestras aplicaciones como **vue**, **vue-router**, **react**, librerías como **momentjs** o cualquier otra dependencia de **nodejs** que usemos en nuestras aplicaciones. Esto no sólo nos permitirá actualizar versiones de dependencias en caliente, sino que además nos permite reutilizar una misma dependencia para todos los **microfrontends** (precisándose también la propiedad **externals** en nuestra configuración de **Webpack**), evitando así que cada **microfrontend** compile sus dependencias y las incluya en sus ficheros finales. Imagínate el ahorro de memoria que esto implica cuando son muchos los **microfrontends** y las dependencias utilizadas.

Y una pregunta que nos puede surgir es: <q>¿Y por qué nunca he necesitado usar los **import maps** e incluso podía no saber de su existencia?</q> Pues porque **Webpack** reúne todas las dependencias en el compilado de nuestra aplicación, de forma que resuelve todas las rutas automáticamente, resultando este proceso totalmente transparente para nosotros. Y aunque no lo fuera, todas las dependencias que utilicemos en una aplicación JavaScript se resuelven por defecto en la carpeta **node_modules**. 

Sin embargo, en este caso no tendremos nuestros **microfrontends** publicados en ningún registro de dependencias como requisito para el funcionamiento y compilado de la aplicación principal, sino que estarán alojados en distintos endpoints como servicios. Y es esto último lo que nos permite realizar cambios en caliente en nuestra aplicación [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") sin necesidad alguna de compilar ni desplegar nuevamente.

#### Comparación de estrategias

Vistas todas las estrategias y qué aspectos las caracterizan vamos a resumirlas en una tabla comparativa:

<!-- TODO: Pendiente de solución a los slots dinámicos en nuxt-content > -->

<!--<el-table :data="comparisionTableData" border style="width: 100%">
  <el-table-column
    prop="feature"
    header-align="center"
    label="Característica"
    min-width="270">
  </el-table-column>
  <el-table-column
    prop="monorepo"
    align="center"
    label="Monorepo"
    min-width="150">
  </el-table-column>
  <el-table-column
    prop="npm"
    align="center"
    label="Paquetes NPM"
    min-width="200">
  </el-table-column>
  <el-table-column
    prop="dynamicModules"
    align="center"
    label="Carga dinámica de módulos"
    min-width="210">
  </el-table-column>
</el-table>-->

<div class="static-table">
  <table>
    <thead>
      <tr>
        <th class="text-center">Características</th>
        <th class="text-center">Monorepo</th>
        <th class="text-center">Paquetes NPM</th>
        <th class="text-center">Carga dinámica de módulos</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Repositorios separados</td>
        <td class="text-center">❌</td>
        <td class="text-center">✅</td>
        <td class="text-center">✅</td>
      </tr>
      <tr>
        <td>Compilaciones independientes</td>
        <td class="text-center">✅</td>
        <td class="text-center">✅</td>
        <td class="text-center">✅</td>
      </tr>
      <tr>
        <td>Despliegues independientes</td>
        <td class="text-center">✅</td>
        <td class="text-center">❌</td>
        <td class="text-center">✅</td>
      </tr>
      <tr>
        <td>Compilación y despliegue con cambios</td>
        <td class="text-center">❌ Todas las apps</td>
        <td class="text-center">☑️ Principal y app afectada</td>
        <td class="text-center">✅ Sólo app afectada</td>
      </tr>
      <tr>
        <td>Cambios en caliente</td>
        <td class="text-center">❌</td>
        <td class="text-center">❌</td>
        <td class="text-center">✅</td>
      </tr>
    </tbody>
  </table>
</div>

En cuanto a la **separación en repositorios** las únicas estrategias que lo permiten son la distribución en **paquetes NPM** o **carga dinámica de módulos**.

Las 3 estrategias ofrecen la posibilidad de realizar **compilaciones independientes**. Sin embargo, dependiendo de la estrategia escogida se nos podrán complicar más o no los despliegues. Aunque sea complicado de montar, es posible realizarlo con la estrategia **monorepo**, y por su puesto también con la **carga dinámica de módulos**. Por el contrario, con la estrategia basada en **paquetes NPM** estamos obligados a compilar y desplegar la aplicación principal, puesto que las dependencias tienen que ser procesadas por **Webpack** desde el principio (esto mismo nos sucederá con la estrategia **monorepo** si no montamos nada especial y utilizamos **Webpack** para compilar todas y cada una de las apps). 

En cuanto a la **compilación y despliegue con cambios** la mejor y más eficiente de las estrategias es la **carga dinámica de módulos**: en el caso de que se suban cambios a nuestro ecosistema, sólo tendríamos que compilar y desplegar el **microfrontend** afectado. Gracias a la resolución de las dependencias en tiempo de ejecución, para visualizar los cambios en nuestro **microfrontend** sólo tendremos que refrescar la url y asegurarnos de que la caché no hace de las suyas. Sin embargo, en las otras 2 estrategias precisamos de compilar y desplegar al menos el **microfrontend** afectado y la aplicación principal para que tome todos los cambios, y lo habitual es que sea necesario realizarlo al completo.

<advertisement></advertisement>

### Ventajas e inconvenientes de los microfrontends

Al igual que hemos visto las ventajas e inconvenientes de cada una de las estrategias de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends"), vamos a realizar una comparativa entre la implementación de una aplicación web común frente a una aplicación web con **microfrontends**:

<div class="static-table">
  <table>
    <thead>
      <tr>
        <th class="text-center">Características</th>
        <th class="text-center">App web común</th>
        <th class="text-center">App web con single-spa</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Complejidad desarrollo</td>
        <td class="text-center">✅ Baja</td>
        <td class="text-center">❌ Alta</td>
      </tr>
      <tr>
        <td>Complejidad compilación y despliegue</td>
        <td class="text-center">✅ Baja</td>
        <td class="text-center">❌ Alta</td>
      </tr>
      <tr>
        <td>Complejidad mantenimiento</td>
        <td class="text-center">❌ Alta</td>
        <td class="text-center">✅ Baja</td>
      </tr>
      <tr>
        <td>Trabajo en equipo</td>
        <td class="text-center">❌ Difícil gestión</td>
        <td class="text-center">✅ Fácil gestión</td>
      </tr>
      <tr>
        <td>Resistencia a fallos</td>
        <td class="text-center">❌ Baja</td>
        <td class="text-center">✅ Alta</td>
      </tr>
    </tbody>
  </table>
</div>

Lo habitual es que hoy en día se desarrollen las aplicaciones web con cualquier framework de **frontend** que tenga su propio **cli** (command line interface), el cual nos crea ya un proyecto con un esqueleto base para funcionar. De este modo, tan sólo tenemos que ampliar la web inicial con los desarrollos de los que precise nuestro proyecto. Sin embargo, en lo que a [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") se refiere, tenemos que desarrollar muchas cosas a mano a pesar de contar también con un **cli** de reciente creación (a partir de la versión 5) que da ciertos puntos ya preconfigurados. Por tanto, siempre va a ser algo más fácil el desarrollo con un único framework de **frontend** que con [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") reuniendo varios **microfrontends** con el mismo framework o distintos.

En cuanto a la **complejidad de la compilación y despliegue** tenemos más de lo mismo. La inmensa mayoría de frameworks de **frontend** vienen ya preparados para compilarse de forma automática (habitualmente con **Webpack**), por lo que el despliegue es muy sencillo en cualquier hosting de computación en la nube. Y aunque con [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") no es excesivamente complejo compilar un proyecto en uno o varios repositorios si se tienen conocimientos, sí es cierto que tiene cierta complejidad. Por tanto, es otro aspecto a tener en cuenta.

En lo que a **mantenimiento** se refiere considero que es más mantenible un ecosistema con **microfrontends** que una única aplicación web con muchas vistas y componentes. Un pequeño cambio de versión en una dependencia puede romper toda una aplicación web realizada con el mismo framework, mientras que en un ecosistema [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") con distintos **microfrontends** en distintos frameworks se nos puede romper sólo una pequeña parte de la web. Por tanto, la reacción a los cambios puede ser más rápida que cuando toda nuestra web está realizada en el mismo repositorio y nos encontramos ante un cambio crítico.

Otro punto importante a evaluar es la posibilidad de **trabajo en equipo**. En el desarrollo de cualquier web estándar es habitual que trabajen equipos de varias personas. Sin embargo, suele ser difícil el reparto de tareas en el mismo sin que los propios desarrolladores se pisen entre sí. Es posible, de hecho yo lo he realizado durante muchos años, pero con [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") se tienen muchas ventajas en este aspecto. Tanto en equipos de muchas personas como de pocas, es muy ventajoso el uso de **microfrontends**, ya que se asignar el desarrollo de cada **microfrontend** a una ó dos personas, mientras que en paralelo se desarrollan componentes reutilizables entre los distintos **microfrontends**. De este modo se reducen los conflictos en los repositorios a la hora de mergear código y quedan más claras las responsabilidades de cada integrante del equipo de trabajo.

Y un último punto a comparar puede ser la **resistencia a fallos**. Una gran ventaja que tendremos con [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") es que seremos menos castigados ante fallos, ya sean de código o en tiempo de ejecución. Es posible que tengamos algún error en algún **microfrontend**, ya sea a nivel de desarrollo, configuración o en tiempo de ejecución, pero eso no implicará que se caiga nuestra web ni que afecte al resto de **microfrontends**. Sin embargo, en una web estándar sí podemos sufrir este inconveniente si experimentamos un error que sea transversal a toda la aplicación.

### ¿Cuándo debo usar microfrontends?

Vistas las ventajas e inconvenientes del desarrollo con **microfrontends** o sin ellos nos puede surgir una pregunta: <q>¿Cuándo debo usar microfrontends?</q> Pues bien, no hay una respuesta exacta, ya que todo va a depender del contexto de la aplicación web que queramos desarrollar y de nuestras preferencias y habilidades.

Sin embargo, como yo he desarrollado aplicaciones web de ambas tipologías, creo que puedo dar una serie de pautas que nos indicarán cuándo usarlos. Yo haría uso de ellos si se dan alguna de las siguientes condiciones:

- Necesitamos que un error en producción no implique la caída de toda la aplicación web y que sea salvable mientras se soluciona
- Nos encontramos en un equipo amplio de desarrolladores y queremos hacer un buen reparto de tareas, además de especializar a cada equipo en una sección de la web
- No necesitamos renderización en servidor. Aunque la versión 5 de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") ya incorpora mecanismos para su implementación, aún no es algo estable y se pueden producir contratiempos
- Nos encontramos en la refactorización de una aplicación web **legacy** y queremos realizar una refactorización gradual distribuida en componentes. Para esto, [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") es idóneo.
- Queremos desarrollar una aplicación web con un alto rendimiento y que vaya cargando los módulos que vaya necesitando bajo demanda (sólo disponible con la estrategia de **carga dinámica de módulos**)

<advertisement></advertisement>

### Mi aportación a la comunidad

Como indicaba en el prólogo de este artículo, todo lo que he aprendido sobre **microfrontends** ha sido en mi actual empresa ([Emergya](https://www.emergya.com/es "Web oficial de Emergya España")). Y no sólo he descubierto un paradigma totalmente innovador, sino que me he convertido en un referente del mismo en mi empresa, siendo en gran parte responsable de la estandarización de los mismos en la UTE conformada entre [Accenture](https://www.accenture.com/es-es "Web oficial de Accenture España") y [Emergya](https://www.emergya.com/es "Web oficial de Emergya España") para el proyecto [**Servicios de Soporte y Mantenimiento horizontales de tecnologías de la información y comunicaciones del Servicio Andaluz de Salud**](https://www.juntadeandalucia.es/temas/contratacion-publica/perfiles-licitaciones/detalle/000000124889.html "Adjucación de proyecto herramientas horizontales del SAS a la UTE Accenture-Emergya").

Cuando comenzamos a investigar los **microfrontends** con [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") teníamos claro que el objetivo era alcanzar su implantación con la carga dinámica de módulos. Sin embargo, para no abarcar un reto mayúsculo y que pudiera hacernos tirar la toalla, decidimos implementar en primer lugar la estrategia con **paquetes NPM** para, una vez implantados los **microfrontends** en producción y habiendo asimilado todos los conceptos generales de los **microfrontends** y los específicos de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends"), evolucionar posteriormente a la **carga dinámica de módulos**.

Para esta labor tuve muchas complicaciones, ya que al observar los [ejemplos oficiales](https://single-spa.js.org/docs/separating-applications#comparison "Ejemplos oficiales de microfrontends con single-spa") de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") vi que había demostraciones de las estragegias **monorepo** y **carga dinámica de módulos**, pero no de la que necesitábamos. Por lo tanto, tuve que leerme varias veces toda la documentación oficial de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends"), buscar mucha información en distintos blogs y, además, dedicar mucho tiempo al visionado de vídeos de [Joel Denning](https://www.youtube.com/user/jbdenning/videos "Vídeo tutoriales de Joel Denning sobre single-spa"), uno de los colaboradores de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") que más me ha ayudado resolviendo mis dudas en los distintos repositorios oficiales de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") en [GitHub](https://github.com/emtecinc/single-spa-backbone/issues/6 "Ayuda ofrecida por Joel Denning para la implantación de microfrontends con single-spa y backbone").

Después de mucho tiempo de estudio y trabajo para su implantación, conseguimos migrar una aplicación web implementada al completo en **Backbone** a una aplicación web [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") que estuviera formada por:

- Aplicación principal [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") con aplicación **Backbone** incorporada dentro para su normal funcionamiento
- Implementación de **microfrontend** que contuviera el menú principal de la aplicación en **Vue**, reemplazando así al menú anteriormente implementado con **Backbone**
- Implementación de **microfrontend** para gestionar las pantallas de login y la autenticación en toda la web, reemplazando así a las pantallas y lógica equivalente en la aplicación **Backbone**
- Implementación de nuevo **microfrontend** con su correspondiente enlace en el menú para despejar el camino hacia próximos desarrollos con **Vue** coexistiendo con secciones legacy implementadas con **Backbone** hasta el abordaje de su refactorización

Meses después pudimos retomar este trabajo y evolucionar este ecosistema para que, en lugar de obtener los **microfrontends** de paquetes **NPM**, estos fueran obtenidos a través de servicios propios mediante llamadas HTTP en tiempo de ejecución, lo cual se consigue con la **carga dinámica de módulos**.

Sin embargo, yo tomé nota de todo lo que aprendí durante este proceso para, posteriormente, realizar mi propio ejemplo de **microfrontend** con [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") adoptando la estrategia de **paquetes NPM**, de la cual no había ejemplos oficiales en la web: de este modo podría ayudar a muchos otros que quisieran sumergirse en este mundo pero que no dispusieran de la suficiente información.

Además, no sólo supuso un reto el hecho de aplicar una estrategia carente de ejemplos: también fue un importante reto la gestión de la autenticación de usuarios. Los desarrolladores de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") no aportaron información al respecto en la documentación porque consideraron que no era necesario. Sin embargo, han sido muchas las dudas planteadas por los usuarios en los repositorios oficiales de **GitHub**, y una de ellas fue mía. Muestro a continuación una serie de incidencias relacionadas con la autenticación que han sido registradas en los distintos repositorios de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends"):

- [Appreciate if there is an example showing auth layer implementation](https://github.com/single-spa/single-spa/issues/201 "Petición de ejemplo de autenticación con microfrontends de single-spa")
- [Question - possible to embed single-spa within an .net mvc razor page and use auth?](https://github.com/single-spa/single-spa/issues/249 "Posibilidad de combinar single-spa con .net mvc razor y usar autenticación")

Por tanto, además de realizar un repositorio de ejemplo de la estrategia con **paquetes NPM**, decidí que también debía incluir una posible estrategia de autenticación, para que los visitantes de mi repositorio cogieran ideas sobre cómo autenticar a los usuarios finales y verificar que, a la hora de acceder a cada sección, se encuentran efectivamente autenticados en el sistema. Y para dotar a este ejemplo de un valor extra, decidí realizar cada **microfrontend** asociado a una sección de la web en distintos frameworks como son: **AngularJS**, **Angular**, **Vue** y **React**.

Dicho todo esto, la web que acabé implementando se encuentra en la url [https://single-spa-with-npm-packages.herokuapp.com/](https://single-spa-with-npm-packages.herokuapp.com/ "Web de ejemplo de single-spa con paquetes NPM y autenticación") (credenciales en el [README](https://github.com/jualoppaz/single-spa-login-example-with-npm-packages#%EF%B8%8F-demo)) y se encuentra en funcionamiento gracias a los distintos repositorios que se detallan a continuación:

- [single-spa-login-example-with-npm-packages](https://github.com/jualoppaz/single-spa-login-example-with-npm-packages "Ejemplo de aplicación single-spa con paquetes NPM y autenticación")
- [single-spa-auth-app](https://github.com/jualoppaz/single-spa-auth-app "Ejemplo de microfrontend desplegado en NPM para la gestión de autenticación")
- [single-spa-layout-app](https://github.com/jualoppaz/single-spa-layout-app "Ejemplo de microfrontend desplegado en NPM para la gestión del layout de la aplicación")
- [single-spa-home-app](https://github.com/jualoppaz/single-spa-home-app "Ejemplo de microfrontend desplegado en NPM realizado con AngularJS")
- [single-spa-angular-app](https://github.com/jualoppaz/single-spa-angular-app "Ejemplo de microfrontend desplegado en NPM realizado con Angular")
- [single-spa-vue-app](https://github.com/jualoppaz/single-spa-vue-app "Ejemplo de microfrontend desplegado en NPM realizado con Vue")
- [single-spa-react-app](https://github.com/jualoppaz/single-spa-react-app "Ejemplo de microfrontend desplegado en NPM realizado con React")

Si estás interesado en ver cómo se ha implementado cada una de las partes de esta demo sólo tienes que acceder a cada uno de estos repositorios y ver la documentación de los mismos.

Después del trabajo realizado parece ser que ha tenido buena acogida, ya que después de haberlo incorporado a la documentación oficial de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends") mediante las correspondientes [Pull Requests](https://github.com/single-spa/single-spa.js.org/pulls?q=is%3Apr+author%3Ajualoppaz+is%3Aclosed) ha recibido multitud de estrellas en el repositorio principal del ejemplo, tal y como se puede comprobar [aquí](https://github.com/jualoppaz/single-spa-login-example-with-npm-packages/stargazers "Estrellas del repositorio con ejemplo de aplicación single-spa con paquetes NPM y autenticación"). De hecho, si te ha gustado este artículo te pediría que dejaras la tuya 😜

<el-row>
  <el-col
    :xs="24"
    :sm="24"
    :md="24"
    :lg="24"
  >
    <div class="text-center">
      <github-button href="https://github.com/jualoppaz/single-spa-login-example-with-npm-packages" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star jualoppaz/single-spa-login-example-with-npm-packages on GitHub">
        Star
      </github-button>
    </div>
  </el-col>
</el-row>

Espero que este artículo te haya resultado interesante para conocer más sobre los **microfrontends** y, especialmente, de [single-spa](https://single-spa.js.org/ "single-spa: framework para microfrontends"). Próximamente iré profundizando más en este tema en cada estrategia, así que 🚨 **atento a las novedades** ❗
