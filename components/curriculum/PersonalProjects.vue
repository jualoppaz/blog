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
    <LoadingText
      v-if="isLoading"
    />
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
        <el-card
          class="project-links"
        >
          <div slot="header" class="clearfix">
            <span>{{ linksText }}</span>
          </div>
          <el-tag
            v-for="(link, index) in project.links"
            :key="index"
            type="primary"
            effect="plain"
            class="project-link"
          >
            <a
              :href="link.value"
              target="_blank"
              rel="nofollow"
            >
              {{ getLinkTypeText(link.type) }}
              <font-awesome-icon
                :icon="['fas', 'external-link-alt']"
                size="1x"
              />
            </a>
          </el-tag>
        </el-card>
      </template>
    </MediaList>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import utils from '@/utils';
import MediaList from '@/components/MediaList.vue';
import TechnologiesList from '@/components/TechnologiesList.vue';
import LoadingText from '@/components/LoadingText.vue';

export default {
  name: 'PersonalProjects',
  components: {
    MediaList,
    TechnologiesList,
    LoadingText,
  },
  async fetch() {
    return this.$store.dispatch('curriculum/getPersonalProjects');
  },
  data() {
    return {
      personalProjectsTitle: this.$t('VIEWS.CV.PERSONAL_PROJECTS.TITLE'),
      currentText: this.$t('VIEWS.CV.PERSONAL_PROJECTS.TIMESTAMP.CURRENT.TEXT'),
      technologiesText: this.$t('VIEWS.CV.PERSONAL_PROJECTS.TECHNOLOGIES.TEXT'),
      linksText: this.$t('VIEWS.CV.PERSONAL_PROJECTS.LINKS.TEXT'),
    };
  },
  computed: {
    ...mapState('curriculum', {
      personalProjects: 'personalProjects',
      isLoading: (state) => state.isLoading.personalProjects,
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
      return this.$t(`VIEWS.CV.PERSONAL_PROJECTS.LINKS.TYPE.${linkType.toUpperCase()}`);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
