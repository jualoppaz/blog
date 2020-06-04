import Vue from 'vue';

export const state = () => ({
  all: [],
  current: {},
});

export const getters = {
  isCurrentTag(state) {
    return (tag) => state.current && state.current.name === tag.name;
  },
  getMainTags(state) {
    return state.all.filter((tag) => tag.level === 1);
  },
  getSecondaryTags(state) {
    return state.all.filter((tag) => tag.level === 2);
  },
  getTagsInfo(state) {
    return (tags) => state.all.filter((tag) => tags.includes(tag.name));
  },
};

export const actions = {
  loadAllTags({ commit }) {
    const tags = [
      {
        name: null,
        label: this.$i18n.t('COMPONENTS.TAGS_FILTER.TAGS.ALL.LABEL'),
        level: 1,
        background_color: {
          default: '#ffffff',
          selected: '#409eff',
        },
        border_color: {
          default: '#409eff',
          selected: '#409eff',
        },
        color: {
          default: '#409eff',
          selected: '#ffffff',
        },
      },
      {
        name: 'technologies',
        label: this.$i18n.t('COMPONENTS.TAGS_FILTER.TAGS.TECHNOLOGIES.LABEL'),
        level: 1,
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
        name: 'holy_week',
        label: this.$i18n.t('COMPONENTS.TAGS_FILTER.TAGS.HOLY_WEEK.LABEL'),
        level: 1,
        background_color: {
          default: '#ffffff',
          selected: '#473371',
        },
        border_color: {
          default: '#473371',
          selected: '#473371',
        },
        color: {
          default: '#473371',
          selected: '#ffffff',
        },
      },
      {
        name: 'esencia',
        label: this.$i18n.t('COMPONENTS.TAGS_FILTER.TAGS.ESENCIA.LABEL'),
        level: 2,
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
    ];

    commit('setAll', tags);
  },
  selectTag({ commit, dispatch }, tag) {
    commit('setCurrent', tag);
    return dispatch('posts/getAll', { tag }, { root: true });
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
