/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

import es from './locales/es';

require('dotenv').config();

export default {
  mode: 'universal',
  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },
  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'es',
    },
    title: 'Blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Blog personal de Juan Manuel López Pazos ☑️ Artículos relacionados con tecnologías y música procesional' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'swagger-ui/dist/swagger-ui.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/nuxt-social-sharing.js',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/moment',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxt/content',
    '@nuxtjs/style-resources',
    [
      'nuxt-i18n',
      {
        locales: ['es'],
        defaultLocale: 'es',
        vueI18n: {
          fallbackLocale: 'es',
          messages: {
            es,
          },
        },
      },
    ],
    ['nuxt-fontawesome', {
      imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['fas'],
        }, {
          set: '@fortawesome/free-brands-svg-icons',
          icons: ['fab'],
        }, {
          set: '@fortawesome/free-regular-svg-icons',
          icons: ['far'],
        },
      ],
    }],
    '@nuxtjs/sitemap',
    ['@nuxtjs/google-adsense', {
      id: 'ca-pub-2309187828170787',
    }],
    ['nuxt-youtube-subscribe-module', {}],
  ],

  styleResources: {
    scss: [
      './assets/styles/_variables.scss',
      './assets/styles/_mixins.scss',
      './assets/styles/_global.scss',
    ],
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.BASE_URL,
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/, /^vue-adblock-detect/],
    /*
    ** You can extend webpack config here
    */
    extend(config) {
      config.resolve.alias['@'] = __dirname;
      config.resolve.alias.vue = 'vue/dist/vue.common';
    },
  },
  router: {
    middleware: ['scroll-top'],
  },
  serverMiddleware: [
    { path: '/api', handler: '@/api/index.js' },
  ],
  moment: {
    defaultLocale: 'es',
    locales: ['es'],
  },
  sitemap: {
    hostname: 'http://www.juanmanuellopezpazos.es',
    routes: async () => {
      // eslint-disable-next-line global-require
      const { $content } = require('@nuxt/content');

      const posts = await $content('posts')
        .only(['path'])
        .fetch();

      return posts.map((p) => `/blog/${p.path}`);
    },
  },
};
