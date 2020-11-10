import Vue from 'vue';

export const state = () => ({
  academicTraining: [
    {
      startDate: '09/2010',
      endDate: '09/2014',
      description: '<div>Grado en Ingeniería Informática - Ingeniería del Software por la Universidad de Sevilla (2010-2014)<br/>Si quieres ver mis notas en la Universidad consulta mi <NuxtLink class="expediente-academico" to="/blog">Expediente académico</NuxtLink></div>',
      image: {
        url: '/images/estudios_us.png',
      },
    },
  ],
  professionalExperience: [],
  extraTraining: [],
  personalProjects: [],
  knowledge: {
    programmingLanguages: [],
    frameworks: [],
    webDesignFrameworks: [],
    templateEngines: [],
    databases: [],
    versionControlSystems: [],
    projectManagementTools: [],
    configurationManagementTools: [],
  },
  languages: [
    {
      name: 'Inglés',
      level: 'B1',
      description: 'Acreditación de nivel B1 por el Instituto de idiomas de la Universidad de Sevilla.',
      date: '2012',
      image: '/images/estudios_us.png',
    },
  ],
});

const CV = 'cv';

export const actions = {
  getProfessionalExperience({ commit }) {
    return this.$axios.get(`/${CV}/professional-experiences`)
      .then((res) => commit('setProfessionalExperience', res.data));
  },
  getExtraTraining({ commit }) {
    return this.$axios.get(`/${CV}/extra-training`)
      .then((res) => commit('setExtraTraining', res.data));
  },
  getPersonalProjects({ commit }) {
    return this.$axios.get(`/${CV}/personal-projects`)
      .then((res) => commit('setPersonalProjects', res.data));
  },
  getKnowledgeList(context, type) {
    return this.$axios.get(`/${CV}/knowledge`, {
      params: {
        type,
      },
    });
  },
  getProgrammingLanguages({ dispatch, commit }) {
    return dispatch('getKnowledgeList', 'programming_language')
      .then((res) => commit('setProgrammingLanguages', res.data));
  },
  getFrameworks({ dispatch, commit }) {
    return dispatch('getKnowledgeList', 'framework')
      .then((res) => commit('setFrameworks', res.data));
  },
  getWebDesignFrameworks({ dispatch, commit }) {
    return dispatch('getKnowledgeList', 'web_design')
      .then((res) => commit('setWebDesignFrameworks', res.data));
  },
  getTemplateEngines({ dispatch, commit }) {
    return dispatch('getKnowledgeList', 'template_engine')
      .then((res) => commit('setTemplateEngines', res.data));
  },
  getDatabases({ dispatch, commit }) {
    return dispatch('getKnowledgeList', 'database')
      .then((res) => commit('setDatabases', res.data));
  },
  getVersionControlSystems({ dispatch, commit }) {
    return dispatch('getKnowledgeList', 'version_control_system')
      .then((res) => commit('setVersionControlSystems', res.data));
  },
  getProjectManagementTools({ dispatch, commit }) {
    return dispatch('getKnowledgeList', 'project_management_tool')
      .then((res) => commit('setProjectManagementTools', res.data));
  },
  getConfigurationManagementTools({ dispatch, commit }) {
    return dispatch('getKnowledgeList', 'configuration_management_tool')
      .then((res) => commit('setConfigurationManagementTools', res.data));
  },
  destroyCV({ commit }) {
    commit('setProfessionalExperience', []);
    commit('setExtraTraining', []);
    commit('setPersonalProjects', []);
    commit('setProgrammingLanguages', []);
    commit('setFrameworks', []);
    commit('setWebDesignFrameworks', []);
    commit('setTemplateEngines', []);
    commit('setDatabases', []);
    commit('setVersionControlSystems', []);
    commit('setProjectManagementTools', []);
    commit('setConfigurationManagementTools', []);
  },
};

export const mutations = {
  setProfessionalExperience(state, data) {
    Vue.set(state, 'professionalExperience', data);
  },
  setExtraTraining(state, data) {
    Vue.set(state, 'extraTraining', data);
  },
  setPersonalProjects(state, data) {
    Vue.set(state, 'personalProjects', data);
  },
  setProgrammingLanguages(state, data) {
    Vue.set(state.knowledge, 'programmingLanguages', data);
  },
  setFrameworks(state, data) {
    Vue.set(state.knowledge, 'frameworks', data);
  },
  setWebDesignFrameworks(state, data) {
    Vue.set(state.knowledge, 'webDesignFrameworks', data);
  },
  setTemplateEngines(state, data) {
    Vue.set(state.knowledge, 'templateEngines', data);
  },
  setDatabases(state, data) {
    Vue.set(state.knowledge, 'databases', data);
  },
  setVersionControlSystems(state, data) {
    Vue.set(state.knowledge, 'versionControlSystems', data);
  },
  setProjectManagementTools(state, data) {
    Vue.set(state.knowledge, 'projectManagementTools', data);
  },
  setConfigurationManagementTools(state, data) {
    Vue.set(state.knowledge, 'configurationManagementTools', data);
  },
};
