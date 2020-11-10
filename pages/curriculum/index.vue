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
        <ExtraTraining />
        <PersonalProjects />
        <Knowledge />
        <Languages />
      </el-col>
    </el-row>
  </div>
</template>

<script>

import SeeCurriculumPdf from '@/components/curriculum/CurriculumPdfFormat.vue';
import AcademicTraining from '@/components/curriculum/AcademicTraining.vue';
import ProfessionalExperience from '@/components/curriculum/ProfessionalExperience.vue';
import ExtraTraining from '@/components/curriculum/ExtraTraining.vue';
import PersonalProjects from '@/components/curriculum/PersonalProjects.vue';
import Knowledge from '@/components/curriculum/Knowledge.vue';
import Languages from '@/components/curriculum/Languages.vue';

export default {
  components: {
    SeeCurriculumPdf,
    AcademicTraining,
    ProfessionalExperience,
    ExtraTraining,
    PersonalProjects,
    Knowledge,
    Languages,
  },
  beforeDestroy() {
    this.$store.dispatch('curriculum/destroyCV');
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
