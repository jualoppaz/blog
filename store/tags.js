import Vue from 'vue';

export const state = () => ({
  all: [
    {
      name: 'technologies',
      label: 'tecnologías',
      background_color: {
        default: '#ffffff',
        selected: '#303133',
      },
      border_color: {
        default: '#303133',
        selected: '#303133',
      },
      color: {
        default: '#303133',
        selected: '#ffffff',
      },
    },
    {
      name: 'esencia',
      label: 'CCyTT Esencia',
      background_color: {
        default: '#ffffff',
        selected: '#0B3B0B',
      },
      border_color: {
        default: '#0B3B0B',
        selected: '#0B3B0B',
      },
      color: {
        default: '#0B3B0B',
        selected: '#ffffff',
      },
    },
  ],
  current: {},
});

export const getters = {
  isCurrentTag(state) {
    return (tag) => state.current && state.current.name === tag.name;
  },
};

export const actions = {
  selectTag({ state, commit }, tag) {
    let nextTag;

    if (getters.isCurrentTag(state)(tag)) {
      nextTag = null;
    } else {
      nextTag = tag;
    }

    commit('setCurrent', nextTag);
  },
};

export const mutations = {
  setAll(state, tags) {
    Vue.set(state, 'all', tags);
  },
  setCurrent(state, tag) {
    Vue.set(state, 'current', tag);
  },
};
