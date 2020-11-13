<template>
  <div id="curriculum-professional-experience">
    <h1 class="curriculum-section-title">
      <font-awesome-icon
        :icon="['fas', 'briefcase']"
        size="1x"
      />
      {{ professionalExperienceTitle }}
    </h1>
    <el-divider />
    <LoadingText
      v-if="isLoading"
    />
    <el-timeline>
      <el-timeline-item
        v-for="experience in professionalExperience"
        :key="experience.id"
        type="primary"
        size="large"
        placement="top"
      >
        <el-row class="company-card">
          <el-col :xs="24">
            <el-card :body-style="{ padding: '0px' }">
              <a
                :href="experience.company.web"
                :title="experience.company.name"
                target="_blank"
              >
                <img
                  style="display: inline-block"
                  :src="`/images/${experience.company.image}`"
                  class="company-image"
                >
              </a>
              <div style="display: inline-block; vertical-align: top; padding: 14px;">
                <span class="experience-timestamp">{{ getTimestamp(experience) }}</span>
                <p v-if="experience.description">
                  {{ experience.description }}
                </p>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <h4
          v-if="experience.projects && experience.projects.length > 0"
          class="projects-title"
        >
          {{ projectsTitle }}
        </h4>
        <el-card
          v-for="(project, index) in experience.projects"
          :key="index"
        >
          <h4>{{ getCompanyProjectName(project) }}</h4>
          <p v-text="project.description" />
          <p>{{ positionText }}: {{ project.position }}</p>
          <div class="project-technologies">
            <div class="technologies-label">
              {{ technologiesText }}:
            </div>
            <TechnologiesList
              :technologies="project.technologies"
            />
          </div>
          <p>{{ functionsText }}:</p>
          <el-table
            class="project-functions"
            :data="project.functions"
            border
            :show-header="false"
          >
            <el-table-column
              prop="text"
            />
          </el-table>
        </el-card>
        <!-- Consultora -->
        <div
          v-for="(client, index) in experience.clients"
          :key="index"
          class="experience-clients"
        >
          <el-card :body-style="{ padding: '0px' }">
            <a
              :href="client.company.web"
              :title="client.company.name"
              target="_blank"
            >
              <img
                style="display: inline-block"
                :src="`/images/${client.company.image}`"
                class="client-image"
              >
            </a>
            <div style="display: inline-block; vertical-align: top; padding: 14px;">
              <span class="client-timestamp">{{ getTimestamp(client) }}</span>
              <p v-if="client.description">
                {{ client.description }}
              </p>
            </div>
          </el-card>
          <h4
            v-if="client.projects && client.projects.length > 0"
            class="projects-title"
          >
            {{ projectsTitle }}
          </h4>
          <el-card
            v-for="(clientProject, indexClientProject) in client.projects"
            :key="indexClientProject"
          >
            <h4>{{ getCompanyProjectName(clientProject) }}</h4>
            <p v-text="clientProject.description" />
            <p>{{ positionText }}: {{ clientProject.position }}</p>
            <div class="project-technologies">
              <div class="technologies-label">
                {{ technologiesText }}:
              </div>
              <TechnologiesList
                :technologies="clientProject.technologies"
              />
            </div>
            <p>{{ functionsText }}:</p>
            <el-table
              class="project-functions"
              :data="clientProject.functions"
              border
              :show-header="false"
            >
              <el-table-column
                prop="text"
              />
            </el-table>
          </el-card>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import utils from '@/utils';
import TechnologiesList from '@/components/TechnologiesList.vue';
import LoadingText from '@/components/LoadingText.vue';

export default {
  name: 'ProfessionalExperience',
  components: {
    TechnologiesList,
    LoadingText,
  },
  async fetch() {
    return this.$store.dispatch('curriculum/getProfessionalExperience');
  },
  data() {
    return {
      professionalExperienceTitle: this.$t('VIEWS.CV.PROFESSIONAL_EXPERIENCE.TITLE'),
      projectsTitle: this.$t('VIEWS.CV.PROFESSIONAL_EXPERIENCE.PROJECTS.TEXT'),
      positionText: this.$t('VIEWS.CV.PROFESSIONAL_EXPERIENCE.POSITION.TEXT'),
      technologiesText: this.$t('VIEWS.CV.PROFESSIONAL_EXPERIENCE.TECHNOLOGIES.TEXT'),
      functionsText: this.$t('VIEWS.CV.PROFESSIONAL_EXPERIENCE.FUNCTIONS.TEXT'),
      currentText: this.$t('VIEWS.CV.PROFESSIONAL_EXPERIENCE.TIMESTAMP.CURRENT.TEXT'),
    };
  },
  computed: {
    ...mapState('curriculum', {
      professionalExperience: 'professionalExperience',
      isLoading: (state) => state.isLoading.professionalExperience,
    }),
  },
  methods: {
    getTimestamp(experience) {
      const startDateFormatted = this.$moment(experience.startDate)
        .format(utils.COMMON.DATE_FORMAT.WITHOUT_DAY);

      let endDateFormatted = this.currentText;

      if (experience.endDate) {
        endDateFormatted = this.$moment(experience.endDate)
          .format(utils.COMMON.DATE_FORMAT.WITHOUT_DAY);
      }

      return `${startDateFormatted} - ${endDateFormatted}: ${experience.company.name}`;
    },
    getCompanyProjectName(project) {
      let res = project.name;
      const startDateFormatted = this.$moment(project.startDate)
        .format(utils.COMMON.DATE_FORMAT.WITHOUT_DAY);

      let endDateFormatted = this.currentText;

      if (project.endDate) {
        endDateFormatted = this.$moment(project.endDate)
          .format(utils.COMMON.DATE_FORMAT.WITHOUT_DAY);
      }

      res += `: ${startDateFormatted} - ${endDateFormatted}`;

      return res;
    },
  },
};
</script>

<style lang="scss" scoped>

.el-timeline{
  padding-left: 0;

  @include for-tablet-up{
    padding-left: 40px;
  }

  .project-functions{
    ::v-deep tr.el-table__row{
      td{
        div.cell{
          word-break: normal;
          text-align: justify;
        }
      }
    }
  }

  .company-card{
    .company-image{
      width: 100px;
      height: 100px;
      padding: 5px;
    }

    .experience-timestamp{
      font-size: 16px;
      font-weight: bold;
    }
  }

  .projects-title{
    font-size: 16px;
  }

  .experience-clients{
    padding-top: 20px;
    padding-left: 20px;

    .client-image{
      width: 100px;
      height: 100px;
      padding: 5px;
    }

    .client-timestamp{
      font-size: 16px;
      font-weight: bold;
    }

    .el-card{
      &:not(:first-child){
        margin-top: 20px;
      }
    }
  }
}

</style>
