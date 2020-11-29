<template>
  <div id="academic-record">
    <el-row>
      <el-col
        :xs="24"
        :lg="{
          span: 16,
          offset: 4
        }"
      >
        xoxExpediente académico
      </el-col>
    </el-row>
    <el-backtop
      :visibility-height="200"
    />
  </div>
</template>

<script>

import utils from '@/utils';

export default {
  components: {},
  nuxtI18n: {
    paths: {
      es: '/expediente-academico',
    },
  },
  beforeDestroy() {
    this.$store.dispatch('curriculum/destroyCV');
  },
  head() {
    const metas = {
      title: 'Currículum de Juan Manuel López Pazos',
      description: 'Currículum de Juan Manuel López Pazos 👨‍💻 Aquí encontrarás el currículum de Juan Manuel López Pazos, Graduado en Ingeniería de Software.',
      author: 'Juan Manuel López Pazos',
      keywords: 'curriculum, juan manuel lopez pazos, ingeniero software, programador frontend, desarrollador frontend, desarrollador vue, microfrontends, micro frontends, micro-frontends',
      canonical_url: 'http://www.juanmanuellopezpazos.es/curriculum',
      og_title: 'Currículum de Juan Manuel López Pazos',
      og_type: 'website',
      og_image: 'http://www.juanmanuellopezpazos.es/images/yo_2018.jpg',
      og_url: 'http://www.juanmanuellopezpazos.es/curriculum',
      og_description: 'Currículum de Juan Manuel López Pazos 👨‍💻 Aquí encontrarás el currículum de Juan Manuel López Pazos, Graduado en Ingeniería de Software.',
      og_site_name: 'BLOG - JMLP',
      twitter_site: '@LopezPazos14',
      twitter_card: 'summary',
      twitter_image: 'http://www.juanmanuellopezpazos.es/images/yo_2018.jpg',
      twitter_title: 'Currículum de Juan Manuel López Pazos',
      twitter_description: 'Currículum de Juan Manuel López Pazos 👨‍💻 Aquí encontrarás el currículum de Juan Manuel López Pazos, Graduado en Ingeniería de Software.',
    };
    return utils.getCommonMetas({
      metas,
    });
  },
};
</script>

<style lang="scss" scoped>

#curriculum {
  ::v-deep {
    .curriculum-section-title{
      font-size: 36px;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    div[id^="curriculum-"] {
      &:not(:first-child) {
        margin-top: 50px;
      }
    }
  }
}
</style>
