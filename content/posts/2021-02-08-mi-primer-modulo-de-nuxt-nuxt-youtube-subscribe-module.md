---
title: "Mi primer módulo de Nuxt: nuxt-youtube-subscribe-module"
image: /images/blog/posts/2021-02-08-mi-primer-modulo-de-nuxt-nuxt-youtube-subscribe-module.jpg
tags: ['technologies']
metas: { 
  description: "En este artículo se explica cómo ha sido el desarrollo de un módulo para Nuxt, con el cual se consigue incluir el botón oficial de suscripción a un canal de Youtube.",
  author: 'Juan Manuel López Pazos',
  keywords: "nuxt, youtube, suscripción, google, adsense, google adsense, botón suscripción youtube con nuxt",
  canonical_url: "https://www.juanmanuellopezpazos.es/blog/posts/2021-02-08-mi-primer-modulo-de-nuxt-nuxt-youtube-subscribe-module",
  og_title: "Mi primer módulo de Nuxt: nuxt-youtube-subscribe-module",
  og_type: "article",
  article_published_time: "2021-02-08T21:40:15.000Z",
  article_author: "https://www.facebook.com/jualoppaz",
  og_image: "/images/blog/posts/2021-02-08-mi-primer-modulo-de-nuxt-nuxt-youtube-subscribe-module.jpg",
  og_url: "https://www.juanmanuellopezpazos.es/blog/posts/2021-02-08-mi-primer-modulo-de-nuxt-nuxt-youtube-subscribe-module",
  og_description: "En este artículo se explica cómo ha sido el desarrollo de un módulo para Nuxt, con el cual se consigue incluir el botón oficial de suscripción a un canal de Youtube.",
  og_site_name: BLOG - JMLP,
  twitter_site: "@LopezPazos14",
  twitter_card: summary,
  twitter_image: "/images/blog/posts/2021-02-08-mi-primer-modulo-de-nuxt-nuxt-youtube-subscribe-module.jpg",
  twitter_title: "Mi primer módulo de Nuxt: nuxt-youtube-subscribe-module",
  twitter_description: "En este artículo se explica cómo ha sido el desarrollo de un módulo para Nuxt, con el cual se consigue incluir el botón oficial de suscripción a un canal de Youtube."
}
published: true
creationDate: '2021-02-08T21:40:15.000Z'
---

## Mi experiencia desarrollando un módulo para Nuxt

En este post voy a explicar cómo ha sido mi experiencia desarrollando un módulo de [Nuxt](https://nuxtjs.org "Web oficial de Nuxt"), pudiendo así reutilizar una funcionalidad en tantas aplicaciones como se desee. Además, así he podido realizar una contribución más, en esta ocasión la primera para [Nuxt](https://nuxtjs.org "Web oficial de Nuxt").

<advertisement></advertisement>

### Motivación

Hace escasos meses me surgió la necesidad de añadir un botón en una de mis webs con [Nuxt](https://nuxtjs.org "Web oficial de Nuxt") para invitar a los usuarios a que se suscribieran a un canal de **Youtube**. De este modo podría agilizar el incremento de suscriptores de dicho canal. Para quien no sepa a lo que me refiero es justo lo que se menciona en el siguiente [enlace](https://developers.google.com/youtube/youtube_subscribe_button?hl=es-419 "Botón de suscripción a canal de Youtube") y que se puede ver en la siguiente imagen:

<el-row>
  <el-col
    :xs="24"
    :sm="24"
    :md="24"
    :lg="{
      span: 12,
      offset: 6
    }"
  >
    <div class="post-image-container">
      <el-image
        class="post-image"
        src="/images/blog/posts/2021-02-08-ejemplo-boton-suscripcion-youtube.jpg"
        fit="contain"
        alt="Ejemplo de botón para suscribirse a un canal de Youtube"
      ></el-image>
    </div>
  </el-col>
</el-row>

Para ello me puse a buscar en la red si había algún tipo de plugin, librería o módulo desarrollado que facilitara esta labor en aplicaciones hechas con [Nuxt](https://nuxtjs.org "Web oficial de Nuxt"). Sin embargo no encontré nada, y no es posible hacer uso de la librería oficial como en el ejemplo dado, puesto que el mismo sólo funciona en webs que se renderizan al completo en servidor o que tienen un renderizado clásico en el navegador: en [Nuxt](https://nuxtjs.org "Web oficial de Nuxt") no funciona porque los ciclos de vida que tiene dificultan la carga de la misma. Pero no es algo exclusivo de [Nuxt](https://nuxtjs.org "Web oficial de Nuxt"), ya que esto mismo sucederá en cualquier framework JavaScript con paradigmas actuales.

Por tanto, me dije: <q>¿Y si desarrollo mi propio módulo y, así, realizo una contribución a la comunidad de [Nuxt](https://nuxtjs.org "Web oficial de Nuxt")?</q> Y es por este motivo por el que desarrollé el módulo [nuxt-youtube-subscribe-module](https://github.com/jualoppaz/nuxt-youtube-subscribe-module "Módulo de Nuxt para añadir botón de suscripción a canal de Youtube") y por eso estás leyendo estas líneas 😄.

### Punto de partida

Dado que no tenía ni idea de por dónde empezar decidí fijarme en otros módulos similares. El módulo que yo quería implementar no era una funcionalidad nueva e innovadora como tal, simplemente se trataba de un **wrapper** de la implementación [oficial](https://developers.google.com/youtube/youtube_subscribe_button?hl=es-419 "Botón de suscripción a canal de Youtube") sólo que adaptada a un framework **JavaScript** específico como [Nuxt](https://nuxtjs.org "Web oficial de Nuxt").

Por tanto, de entre los módulos que he llegado a utilizar, el que más se asemejaba a mis necesidades era [@nuxt/google-adsense](https://github.com/nuxt-community/google-adsense-module "Módulo de Google Adsense para Nuxt"). Este módulo te permite importar el script de **Google** requerido para poder añadir anuncios en tu sitio web, y por otro lado te permite insertar el anuncio específico a través de un componente **Vue** que hace uso de las funcionalidades cargadas en el script.

Es por todo esto por lo que el módulo [@nuxt/google-adsense](https://github.com/nuxt-community/google-adsense-module "Módulo de Google Adsense para Nuxt") es ideal para ser tomado como ejemplo, ya que también necesitamos cargar un script específico de **Google** y por otro lado añadir el botón de suscripción en el lugar deseado.

<advertisement></advertisement>

### Núcleo del módulo

La lógica principal para la carga del módulo se encuentra en el fichero **lib/module.js** es la siguiente:

```javascript
const { resolve } = require('path')

const Defaults = {
  tag: 'youtube-subscribe-button'
}

// Google JavaScript API script URL
const GoogleApiURL = 'https://apis.google.com/js/platform.js'

module.exports = function nuxtYoutubeSubscribe (moduleOptions = {}) {
  const options = Object.assign({}, Defaults, this.options['youtube-subscribe'] || moduleOptions)

  // Set the desired component tag name
  options.tag = options.tag || Defaults.tag

  // Register our plugin and pass config options
  this.addPlugin({
    src: resolve(__dirname, './plugin.template.js'),
    fileName: 'youtube-subcribe.js',
    options: options
  })

  // Add the async Google JavaScript API script to head
  this.options.head.script.push({
    hid: 'youtube-subscribe-script',
    src: GoogleApiURL,
    async: true,
    defer: true,
    callback: () => { // given by vue-meta
      document.dispatchEvent(new CustomEvent('youtube-subscribe:gapi-loaded'))
    }
  })
}

module.exports.meta = require('./../package.json')
```

El fichero **lib/module.js** se encarga de definir el módulo y exporta una serie de configuraciones que se detallan a continuación.

En primer lugar se determinan las opciones proporcionadas para cargar el módulo: se parte de una configuración por defecto para garantizar el funcionamiento básico del mismo, pero se da la opción de indicar opciones adicionales por 2 mecanismos como son la definición en línea o la configuración específica con el identificador **youtube-subscribe**.

Luego se determina el nombre a utilizar para registrar el componente **Vue**, el cual es personalizable. No es algo necesario, pero lo vi en la librería [@nuxt/google-adsense](https://github.com/nuxt-community/google-adsense-module "Módulo de Google Adsense para Nuxt") y me gustó 😅.

Después se procede a registrar el módulo con el método **addPlugin**, el cual recibe un **Template** en forma de objeto con las opciones necesarias: comentaremos el **Template** más adelante.

La última configuración consiste en añadir en el **DOM** el script de **Google** que contiene las funcionalidades necesarias para que el botón de suscripción al canal de **Youtube** pueda ser incrustado. Hay una peculiaridad en esta configuración y es la propiedad **callback**, la cual es proporcionada por [vue-meta](https://github.com/nuxt/vue-meta "Librería para personalizar metaetiquetas con Vue") y que sirve para ejecutar el código deseado cuando el script haya sido cargado. En este caso lo que haremos será lanzar un evento propio llamado **youtube-subscribe:gapi-loaded**, y más adelante veremos por qué es necesario.

Para finalizar la implementación del módulo es necesario exportar la propiedad **meta** apuntando al fichero **package.json** del módulo. Esto es un requisito que se indica en las [instrucciones de Nuxt](https://nuxtjs.org/docs/2.x/directory-structure/modules "Instrucciones para desarrollar módulo de Nuxt") para el caso en que se quiera publicar como paquete de **NPM**, y es algo que aplica puesto que quiero que sea accesible para todo el mundo.

<advertisement></advertisement>

### Plantilla del módulo

En esta sección comentaremos los detalles del fichero **lib/plugin.template.js**, en el cual se registra el componente **Vue** que nos va a permitir incrustar el deseado botón para que nuestros visitantes se suscriban a nuestro canal de **Youtube**.

```javascript
import Vue from 'vue'

// Custom Youtube Subscribe Button Component
const youtubeSubscribeButton = {
  render (h) {
    return h(
      'div',
      {
        style: this.adStyle,
        attrs: {
          id: this.identifier,
          'data-channelid': this.channelid,
          'data-channel': this.channel,
          'data-layout': this.layout,
          'data-theme': this.theme,
          'data-count': this.count
        }
      }
    )
  },
  props: {
    identifier: {
      type: String,
      required: true
    },
    channelid: {
      type: String,
      default: ''
    },
    channel: {
      type: String,
      default: ''
    },
    layout: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'full'].includes(value)
    },
    theme: {
      type: String,
      default: '',
      validator: (value) => ['', 'dark'].includes(value)
    },
    count: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'hidden'].includes(value)
    }
  },
  data () {
    return {}
  },
  mounted () {
    if (process.browser) {
      if (window.gapi) this.render()
      // eslint-disable-next-line no-console
      else {
        console.info(`<%= options.tag %>#${this.identifier}: gapi is not loaded yet`)
        document.addEventListener('youtube-subscribe:gapi-loaded', () => {
          this.render()
          console.info(`<%= options.tag %>#${this.identifier}: rendered after gapi load`)
        })
      }
    }
  },
  watch: {
    $props: {
      immediate: true,
      handler () {
        this.validateProps()
      }
    }
  },
  methods: {
    /**
     * Method for require one of channel or channelid props
     *
     * @author jualoppaz
     */
    validateProps () {
      if (this.channel === '' && this.channelid === '') {
        // eslint-disable-next-line no-console
        console.error(`<%= options.tag %>#${this.identifier}: You must indicate channel or channelid value.`)
      }
    },
    /**
     * Method for render the youtube subscribe button after gapi is loaded
     *
     * @author jualoppaz
     */
    render() {
      const container = document.getElementById(this.identifier)
      const options = {
        channelid: this.channelid,
        channel: this.channel,
        layout: this.layout,
        count: this.count
      }

      window.gapi.ytsubscribe.render(container, options)
    }
  }
}

// Register our subscribe component under the desired tag name
Vue.component('<%= options.tag %>', youtubeSubscribeButton)
```

En este fichero básicamente se declara un componente **Vue**, pero a diferencia del componente que haríamos en condiciones normales en una aplicación al uso, vamos a definir la plantilla del mismo con el método **render**.

La propiedad **attrs**, que sirve para aplicar un renombrado entre los atributos recibidos desde el componente y los que se van a indicar en el **DOM**, la vamos a definir de forma que se mantengan los nombres de los atributos, sólo que respetando el estándar [W3C](https://www.w3.org/TR/2011/WD-html5-20110525/elements.html#embedding-custom-non-visible-data-with-the-data-attributes "Prefijo \"data-\" para atributos propios en HTML") añadiendo los prefijos **data-**.

En las **props** se han definido todas las validaciones básicas para garantizar en la mayor medida posible que se proporcionan los valores necesarios para que se incruste el botón de suscripción a **Youtube** sin errores. Dado que hay campos como **channel** y **channelid**, de entre los cuales sólo es obligatorio indicar uno de ellos, y no hay un mecanismo propio de **Vue** para proceder a dicha validación he realizado la misma con la ayuda de un watcher.

Una vez superada la validación de campos se procede a la renderización del botón, la cual tendrá lugar en el ciclo **mounted** y solamente en el caso de que nos encontramos en el lado del **cliente**: no tiene sentido realizar esta acción en servidor puesto que en él no existen los objetos **window**, **document**, etc. 

Y aquí es donde está la clave de este componente, ya que el botón de **Youtube** se renderiza únicamente si la variable **window.gapi** ha sido cargada (realizado por el [script de Google](https://apis.google.com/js/platform.js "API JavaScript de Google para Youtube") cargado anteriormente). Pero puede suceder que el primer uso de este componente en la aplicación se más temprano que la carga del [script de Google](https://apis.google.com/js/platform.js "API JavaScript de Google para Youtube"), por lo que es posible que la variable **window.gapi** aún no contenga el catálogo de métodos necesarios y, por tanto, el botón no pueda ser renderizado.

Para el caso en que no pueda ser renderizado el botón en un primer intento tenemos el mecanismo alternativo, que consiste en la escucha del evento personalizado **youtube-subscribe:gapi-loaded**, el cual es lanzado por [vue-meta](https://github.com/nuxt/vue-meta "Librería para personalizar metaetiquetas con Vue") tal y como se ha indicado anteriormente. En este caso, al escuchar el evento se volverá a intentar renderizar el botón, esta vez teniendo la certeza de que la variable **window.gapi** va a estar cargada debidamente para ello.

Para finalizar sólo queda comentar el registro del componente, el cual se realiza de forma global sobre la propia instancia de **Vue** para que esté accesible desde cualquier parte sin tener que importarlo en cada vista o componente donde se quiere utilizar. Y como se mencionó con anterioridad, el componente se registra de forma dinámica con el nombre indicado en la variable **options.tag**, siendo reemplazado en tiempo de compilación mediante [Lodash templates](https://lodash.com/docs/4.17.15#template "Mecanismo para compilar plantillas con Lodash").

<advertisement></advertisement>

### Resultado

Hecho todo esto y publicado el paquete en **NPM** sólo tenemos que seguir las instrucciones indicadas en el [repositorio]() del módulo para poder instalarlo en nuestra aplicación y poder hacer uso de él.

Después de añadir la dependencia **nuxt-youtube-subscribe-module** y de incluir la etiqueta 

```html
<youtube-subscribe-button
  identifier="youtube-subscribe-button"
  channelid="UCHdhBcYWB_O2TQ0g1F6Ep2w"
  layout="full"
></youtube-subscribe-button>
```

podremos ver el resultado en nuestra web como sigue:

<div style="margin: auto; text-align: center; margin: 50px 0">
  <youtube-subscribe-button 
    identifier="youtube-subscribe-button" 
    channelid="UCHdhBcYWB_O2TQ0g1F6Ep2w" 
    layout="full" 
  ></youtube-subscribe-button>
</div>

El resultado es un botón de suscripción, en este caso, a mi [canal](https://www.youtube.com/c/JuanManuelLopezPazos "Canal de Juan Manuel López Pazos en Youtube") de **Youtube**. Si tienes curiosidad, acabas entrando y te gusta no dudes en suscribirte 😜.
