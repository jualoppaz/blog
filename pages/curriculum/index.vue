<template>
  <div id="curriculum">
    <el-row>
      <el-col
        :xs="24"
        :lg="{
          span: 16,
          offset: 4
        }"
      >
        <SeeCurriculumPdf />
      </el-col>
    </el-row>
  </div>
</template>

<script>

import SeeCurriculumPdf from '@/components/curriculum/CurriculumPdfFormat.vue';

export default {
  components: {
    SeeCurriculumPdf,
  },
  beforeDestroy() {
    this.$store.dispatch('posts/destroyCurrent');
  },
};
</script>
