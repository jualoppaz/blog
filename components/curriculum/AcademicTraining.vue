<template>
  <div id="academic-training">
    <h1 class="curriculum-section-title">
      <font-awesome-icon
        :icon="['fas', 'graduation-cap']"
        size="1x"
      />
      {{ academicTrainingTitle }}
    </h1>
    <el-divider />
    <ul class="media-list">
      <li
        v-for="(training, key, index) in academicTraining"
        :key="index"
        class="media"
      >
        <div
          class="media-left"
        >
          <img
            :src="training.image.url"
          >
        </div>
        <div class="media-body">
          <h4>
            <b>{{ training.startDate }} - {{ training.endDate }}</b>
          </h4>
          <v-runtime-template
            class="media-heading"
            :template="training.description"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import VRuntimeTemplate from 'v-runtime-template';

export default {
  name: 'AcademicTraining',
  components: {
    VRuntimeTemplate,
  },
  data() {
    return {
      academicTrainingTitle: this.$t('VIEWS.CV.ACADEMIC_TRAINING.TITLE'),
    };
  },
  computed: {
    ...mapState('curriculum', {
      academicTraining: (state) => state.curriculum.academicTraining,
    }),
  },
};
</script>

<style lang="scss" scoped>

</style>
