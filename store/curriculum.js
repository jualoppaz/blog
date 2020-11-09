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
};
