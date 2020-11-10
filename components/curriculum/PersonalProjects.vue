<template>
  <div id="curriculum-personal-projects">
    <h1 class="curriculum-section-title">
      <font-awesome-icon
        :icon="['fas', 'code-branch']"
        size="1x"
      />
      {{ personalProjectsTitle }}
    </h1>
    <el-divider />
    <MediaList
      :items="personalProjects"
    >
      <template v-slot:image="{ item: project }">
        <img
          :src="`/images/${project.image}`"
        >
      </template>
      <template v-slot:title="{ item: project }">
        <span class="personal-project-date">{{ getPersonalProjectDate(project) }}</span>
      </template>
      <template v-slot:body="{ item: project }">
        <div class="text-justified">
          {{ project.description }}
        </div>
        <div
          v-if="project.technologies && project.technologies.length > 0"
          class="project-technologies"
        >
          <div class="technologies-label">
            {{ technologiesText }}:
          </div>
          <TechnologiesList
            :technologies="project.technologies"
          />
        </div>
        <div
          v-for="(link, index) in project.links"
          :key="index"
          class="project-link"
        >
          {{ getLinkTypeText(link.type) }}:
          <a
            :href="link.value"
            target="_blank"
          >
            {{ getLinkValueText(link) }}
          </a>
        </div>
      </template>
    </MediaList>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import utils from '@/utils';
import MediaList from '@/components/MediaList.vue';
import TechnologiesList from '@/components/TechnologiesList.vue';

export default {
  name: 'PersonalProjects',
  components: {
    MediaList,
    TechnologiesList,
  },
  async fetch() {
    return this.$store.dispatch('curriculum/getPersonalProjects');
  },
  data() {
    return {
      personalProjectsTitle: this.$t('VIEWS.CV.PERSONAL_PROJECTS.TITLE'),
      currentText: this.$t('VIEWS.CV.PERSONAL_PROJECTS.TIMESTAMP.CURRENT.TEXT'),
      technologiesText: this.$t('VIEWS.CV.PERSONAL_PROJECTS.TECHNOLOGIES.TEXT'),
    };
  },
  computed: {
    ...mapState('curriculum', {
      personalProjects: 'personalProjects',
    }),
  },
  methods: {
    getPersonalProjectDate(project) {
      const startDateFormatted = this.$moment(project.startDate)
        .format(utils.COMMON.DATE_FORMAT.WITHOUT_DAY);

      let endDateFormatted = this.currentText;

      if (project.endDate) {
        endDateFormatted = this.$moment(project.endDate)
          .format(utils.COMMON.DATE_FORMAT.WITHOUT_DAY);
      }

      return `${startDateFormatted} - ${endDateFormatted}: ${project.name}`;
    },
    getLinkTypeText(linkType) {
      return this.$t(`VIEWS.CV.PERSONAL_PROJECTS.LINK.TYPE.${linkType.toUpperCase()}`);
    },
    getLinkValueText(link) {
      return link.type === 'tfg_documentation'
        ? this.$t('VIEWS.CV.PERSONAL_PROJECTS.LINK.TFG_DOCUMENTATION') : link.value;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
