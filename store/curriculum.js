import Vue from 'vue';

export const state = () => ({
  curriculum: {
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
  },
});

const CV = 'cv';

export const actions = {
  getCVProfessionalExperience({ commit }) {
    return this.$axios.get(`/${CV}/professional-experiences`)
      .then((res) => commit('setProfessionalExperience', res.data));
  },
  getCVExtraTraining({ commit }) {
    return this.$axios.get(`/${CV}/extra-training`)
      .then((res) => commit('setExtraTraining', res.data));
  },
};

export const mutations = {
  setProfessionalExperience(state, data) {
    Vue.set(state.curriculum, 'professionalExperience', data);
  },
  setExtraTraining(state, data) {
    Vue.set(state.curriculum, 'extraTraining', data);
  },
};
