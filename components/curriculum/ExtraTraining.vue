<template>
  <div id="curriculum-extra-training">
    <h1 class="curriculum-section-title">
      <font-awesome-icon
        :icon="['fas', 'university']"
        size="1x"
      />
      {{ extraTrainingTitle }}
    </h1>
    <el-divider />
    <LoadingText
      v-if="isLoading"
    />
    <MediaList
      :items="items"
    >
      <template v-slot:image="{ item: training }">
        <a
          :href="`/docs/${training.certification}`"
          target="_blank"
        >
          <img
            :src="`/images/${training.image}`"
          >
        </a>
      </template>
      <template v-slot:title="{ item: training }">
        <span class="extra-training-date">{{ getExtraTrainingDate(training) }}</span>
      </template>
      <template v-slot:body="{ item: training }">
        {{ training.description }}
      </template>
    </MediaList>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MediaList from '@/components/MediaList.vue';
import LoadingText from '@/components/LoadingText.vue';

export default {
  name: 'ExtraTraining',
  components: {
    MediaList,
    LoadingText,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      extraTrainingTitle: this.$t('VIEWS.CV.EXTRA_TRAINING.TITLE'),
    };
  },
  computed: {
    ...mapState('curriculum', {
      isLoading: (state) => state.isLoading.extraTraining,
    }),
  },
  methods: {
    getExtraTrainingDate(training) {
      return this.$t('VIEWS.CV.EXTRA_TRAINING.DATE', {
        month: this.$moment(training.date).format('MMMM'),
        year: this.$moment(training.date).format('YYYY'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.extra-training-date{
  font-weight: bold;
  display: block;

  &:first-letter{
    text-transform: uppercase;
  }
}
</style>
