<template>
  <div id="academic-record">
    <el-row>
      <el-col
        :xs="24"
        :lg="{
          span: 18,
          offset: 3
        }"
      >
        <AcademicCourses />
        <DegreeCourses />
        <AcademicCourseAverages />
        <DegreeCourseAverages />
        <DegreeAverages />
      </el-col>
    </el-row>
    <el-backtop
      :visibility-height="200"
    />
  </div>
</template>

<script>

import utils from '@/utils';

import AcademicCourses from '@/components/academic-record/AcademicCourses.vue';
import DegreeCourses from '@/components/academic-record/DegreeCourses.vue';
import AcademicCourseAverages from '@/components/academic-record/averages/AcademicCourseAverages.vue';
import DegreeCourseAverages from '@/components/academic-record/averages/DegreeCourseAverages.vue';
import DegreeAverages from '@/components/academic-record/averages/DegreeAverages.vue';

export default {
  name: 'AcademicRecord',
  components: {
    AcademicCourses,
    DegreeCourses,
    AcademicCourseAverages,
    DegreeCourseAverages,
    DegreeAverages,
  },
  nuxtI18n: {
    paths: {
      es: '/expediente-academico',
    },
  },
  async fetch() {
    return this.$store.dispatch('academic-records/getRecords');
  },
  beforeDestroy() {
    this.$store.dispatch('curriculum/destroyCV');
  },
  head() {
    const obj = {
      title: 'Expediente académico de Juan Manuel López Pazos',
      metas: {
        description: 'Expediente académico de Juan Manuel López Pazos 👨‍💻 Aquí encontrarás mi expediente académico en mis estudios del Grado en Ingeniería de Software por la Universidad de Sevilla.',
        author: 'Juan Manuel López Pazos',
        keywords: 'expediente academico, juan manuel lopez pazos, ingeniero software, programador frontend, desarrollador frontend, desarrollador vue, microfrontends, micro frontends, micro-frontends',
        canonical_url: 'http://www.juanmanuellopezpazos.es/expediente-academico',
        og_title: 'Expediente académico de Juan Manuel López Pazos',
        og_type: 'website',
        og_image: '/images/yo_2018.jpg',
        og_url: 'http://www.juanmanuellopezpazos.es/expediente-academico',
        og_description: 'Expediente académico de Juan Manuel López Pazos 👨‍💻 Aquí encontrarás mi expediente académico en mis estudios del Grado en Ingeniería de Software por la Universidad de Sevilla.',
        og_site_name: 'BLOG - JMLP',
        twitter_site: '@LopezPazos14',
        twitter_card: 'summary',
        twitter_image: '/images/yo_2018.jpg',
        twitter_title: 'Expediente académico de Juan Manuel López Pazos',
        twitter_description: 'Expediente académico de Juan Manuel López Pazos 👨‍💻 Aquí encontrarás mi expediente académico en mis estudios del Grado en Ingeniería de Software por la Universidad de Sevilla.',
      },
    };
    return utils.getCommonMetas(obj);
  },
};
</script>

<style lang="scss" scoped>
</style>
