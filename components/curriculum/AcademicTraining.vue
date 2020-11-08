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
    <MediaList
      :items="academicTraining"
    >
      <template v-slot:image="{ item: training }">
        <img :src="`${training.image.url}`">
      </template>
      <template v-slot:title="{ item: training }">
        {{ training.startDate }} - {{ training.endDate }}
      </template>
      <template v-slot:body="{ item: training }">
        <v-runtime-template
          :template="training.description"
        />
      </template>
    </MediaList>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import VRuntimeTemplate from 'v-runtime-template';
import MediaList from '@/components/MediaList.vue';

export default {
  name: 'AcademicTraining',
  components: {
    VRuntimeTemplate, MediaList,
  },
  data() {
    return {
      academicTrainingTitle: this.$t('VIEWS.CV.ACADEMIC_TRAINING.TITLE'),
    };
  },
  computed: {
    ...mapState('curriculum', {
      academicTraining: 'academicTraining',
    }),
  },
};
</script>

<style lang="scss" scoped>

</style>
