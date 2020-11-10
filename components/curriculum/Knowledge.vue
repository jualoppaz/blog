<template>
  <div id="curriculum-knowledge">
    <h1 class="curriculum-section-title">
      <font-awesome-icon
        :icon="['fas', 'book']"
        size="1x"
      />
      {{ knowledgeTitle }}
    </h1>
    <el-divider />
    <KnowledgeList
      :items="programmingLanguages"
    >
      <template v-slot:title>
        <font-awesome-icon
          :icon="['fas', 'code']"
          size="1x"
        />

        {{ programmingLanguagesTitle }}
      </template>
    </KnowledgeList>
    <KnowledgeList
      :items="frameworks"
    >
      <template v-slot:title>
        <font-awesome-icon
          :icon="['fas', 'puzzle-piece']"
          size="1x"
        />

        {{ frameworksTitle }}
      </template>
    </KnowledgeList>
    <KnowledgeList
      :items="webDesignFrameworks"
    >
      <template v-slot:title>
        <font-awesome-icon
          :icon="['fas', 'puzzle-piece']"
          size="1x"
        />

        {{ webDesignTitle }}
      </template>
    </KnowledgeList>
    <KnowledgeList
      :items="templateEngines"
    >
      <template v-slot:title>
        <font-awesome-icon
          :icon="['fas', 'sitemap']"
          size="1x"
        />

        {{ templateEnginesTitle }}
      </template>
    </KnowledgeList>
    <KnowledgeList
      :items="databases"
    >
      <template v-slot:title>
        <font-awesome-icon
          :icon="['fas', 'database']"
          size="1x"
        />

        {{ databasesTitle }}
      </template>
    </KnowledgeList>
    <KnowledgeList
      :items="versionControlSystems"
    >
      <template v-slot:title>
        <font-awesome-icon
          :icon="['fas', 'share-alt']"
          size="1x"
        />

        {{ versionControlSystemsTitle }}
      </template>
    </KnowledgeList>
    <KnowledgeList
      :items="projectManagementTools"
    >
      <template v-slot:title>
        <font-awesome-icon
          :icon="['fas', 'calendar']"
          size="1x"
        />

        {{ projectManagementToolsTitle }}
      </template>
    </KnowledgeList>
    <KnowledgeList
      :items="configurationManagementTools"
    >
      <template v-slot:title>
        <font-awesome-icon
          :icon="['fas', 'cogs']"
          size="1x"
        />

        {{ configurationManagementToolsTitle }}
      </template>
    </KnowledgeList>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import KnowledgeList from '@/components/curriculum/knowledge/KnowledgeList.vue';

export default {
  name: 'Languages',
  components: {
    KnowledgeList,
  },
  async fetch() {
    return Promise.all([
      this.$store.dispatch('curriculum/getProgrammingLanguages'),
      this.$store.dispatch('curriculum/getFrameworks'),
      this.$store.dispatch('curriculum/getWebDesignFrameworks'),
      this.$store.dispatch('curriculum/getTemplateEngines'),
      this.$store.dispatch('curriculum/getDatabases'),
      this.$store.dispatch('curriculum/getVersionControlSystems'),
      this.$store.dispatch('curriculum/getProjectManagementTools'),
      this.$store.dispatch('curriculum/getConfigurationManagementTools'),
    ]);
  },
  data() {
    return {
      knowledgeTitle: this.$t('VIEWS.CV.KNOWLEDGE.TITLE'),
      programmingLanguagesTitle: this.$t('VIEWS.CV.KNOWLEDGE.PROGRAMMING_LANGUAGES.TITLE'),
      frameworksTitle: this.$t('VIEWS.CV.KNOWLEDGE.FRAMEWORKS.TITLE'),
      webDesignTitle: this.$t('VIEWS.CV.KNOWLEDGE.WEB_DESIGN.TITLE'),
      templateEnginesTitle: this.$t('VIEWS.CV.KNOWLEDGE.TEMPLATE_ENGINES.TITLE'),
      databasesTitle: this.$t('VIEWS.CV.KNOWLEDGE.DATABASES.TITLE'),
      versionControlSystemsTitle: this.$t('VIEWS.CV.KNOWLEDGE.VERSION_CONTROL_SYSTEMS.TITLE'),
      projectManagementToolsTitle: this.$t('VIEWS.CV.KNOWLEDGE.PROJECT_MANAGEMENT_TOOLS.TITLE'),
      configurationManagementToolsTitle: this.$t('VIEWS.CV.KNOWLEDGE.CONFIGURATION_MANAGEMENT_TOOLS.TITLE'),
    };
  },
  computed: {
    ...mapState('curriculum', {
      programmingLanguages: (state) => state.knowledge.programmingLanguages,
      frameworks: (state) => state.knowledge.frameworks,
      webDesignFrameworks: (state) => state.knowledge.webDesignFrameworks,
      templateEngines: (state) => state.knowledge.templateEngines,
      databases: (state) => state.knowledge.databases,
      versionControlSystems: (state) => state.knowledge.versionControlSystems,
      projectManagementTools: (state) => state.knowledge.projectManagementTools,
      configurationManagementTools: (state) => state.knowledge.configurationManagementTools,
    }),
  },
};
</script>
