<template>
  <div id="extra-training">
    <h1 class="curriculum-section-title">
      <font-awesome-icon
        :icon="['fas', 'university']"
        size="1x"
      />
      {{ extraTrainingTitle }}
    </h1>
    <el-divider />
    <ul class="media-list">
      <li
        v-for="(training, index) in extraTraining"
        :key="index"
        class="media"
      >
        <div
          class="media-left"
        >
          <img
            :src="`/images/${training.image}`"
          >
        </div>
        <div class="media-body">
          <h4>
            <span class="extra-training-date">{{ getExtraTrainingDate(training) }}</span>
          </h4>
          <p
            class="media-heading"
            v-text="training.description"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ExtraTraining',
  components: {},
  data() {
    return {
      extraTrainingTitle: this.$t('VIEWS.CV.EXTRA_TRAINING.TITLE'),
    };
  },
  computed: {
    ...mapState('curriculum', {
      extraTraining: (state) => state.curriculum.extraTraining,
    }),
  },
  created() {
    this.$store.dispatch('curriculum/getCVExtraTraining');
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
