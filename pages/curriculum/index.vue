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
        <AcademicTraining />
        <ProfessionalExperience />
      </el-col>
    </el-row>
  </div>
</template>

<script>

import SeeCurriculumPdf from '@/components/curriculum/CurriculumPdfFormat.vue';
import AcademicTraining from '@/components/curriculum/AcademicTraining.vue';
import ProfessionalExperience from '@/components/curriculum/ProfessionalExperience.vue';

export default {
  components: {
    SeeCurriculumPdf, AcademicTraining, ProfessionalExperience,
  },
  beforeDestroy() {
    this.$store.dispatch('posts/destroyCurrent');
  },
};
</script>

<style lang="scss" scoped>

#curriculum {
  ::v-deep {
    .curriculum-section-title, .professional-experience-section-title{
      font-size: 36px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
  }
}
</style>
