import Vue from 'vue';

export const state = () => ({
  all: [],
  current: {},
});

export const getters = {
  getFilteredPosts(state) {
    return (currentTag) => state.all.filter((tag) => !currentTag || currentTag.name === tag.name);
  },
};

export const actions = {
  getAll({ commit }, { tag } = {}) {
    const query = this.$content('posts');

    let whereConditions = { published: true };

    if (tag && tag.name) {
      whereConditions = {
        ...whereConditions,
        tags: {
          $containsAny: [tag.name],
        },
      };
    }

    return query
      .where(whereConditions)
      .sortBy('createdAt', 'desc')
      .fetch()
      .then((posts) => commit('setAll', posts));
  },
  getBySlug({ commit }, { slug }) {
    const path = slug ? `posts/${slug}` : 'home';

    return this.$content(path)
      .where({ published: true })
      .fetch()
      .then((post) => commit('setCurrent', post));
  },
  destroyCurrent({ commit }) {
    return commit('setCurrent', {});
  },
  destroyAll({ commit }) {
    return commit('setAll', []);
  },
};

export const mutations = {
  setAll(state, posts) {
    Vue.set(state, 'all', posts);
  },
  setCurrent(state, post) {
    Vue.set(state, 'current', post);
  },
};
