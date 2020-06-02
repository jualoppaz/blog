<template>
  <div id="blog">
    <el-row>
      <el-col>
        <nuxt-content :document="doc" />
      </el-col>
    </el-row>

    <div
      id="posts-list"
    >
      <div>
        <el-tag
          v-for="tag in tags"
          :key="tag.name"
          :style="{
            'background-color': getTagBackgroundColor(tag),
            'border-color': getTagBorderColor(tag),
            color: getTagColor(tag),
          }"
          class="pointer"
          @click="selectTag(tag)"
        >
          {{ tag.label }}
        </el-tag>
      </div>

      <el-row
        v-for="post in posts"
        :key="post.slug"
        class="post-row"
      >
        <el-col
          :xs="24"
          :lg="{ span: 18, offset: 3 }"
        >
          <PostCard :post="post" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex';
import { Loading } from 'element-ui';
import PostCard from '../components/PostCard.vue';
import utils from '../utils';

export default {
  layout: 'blog',
  components: {
    PostCard,
  },
  async fetch() {
    if (process.client) {
      this.loadingInstance = Loading.service({
        target: utils.LOADING.QUERY_SELECTOR,
        background: 'rgba(0, 0, 0, 0.8)',
      });
    }

    return Promise.all([
      this.$store.dispatch('posts/getAll'),
      this.$store.dispatch('posts/getBySlug', {
        slug: null,
      }),
    ])
      .finally(() => {
        if (this.loadingInstance) this.loadingInstance.close();
      });
  },
  computed: {
    ...mapState('posts', {
      doc: 'current',
    }),
    ...mapState('posts', {
      posts: 'all',
    }),
    ...mapState('tags', {
      tags: 'all',
    }),
    ...mapState('tags', {
      currentTag: 'current',
    }),
  },
  methods: {
    getTagBackgroundColor(tag) {
      if (this.$store.getters['tags/isCurrentTag'](tag)) return tag.background_color.selected;
      return tag.background_color.default;
    },
    getTagBorderColor(tag) {
      if (this.$store.getters['tags/isCurrentTag'](tag)) return tag.border_color.selected;
      return tag.border_color.default;
    },
    getTagColor(tag) {
      if (this.$store.getters['tags/isCurrentTag'](tag)) return tag.color.selected;
      return tag.color.default;
    },
    selectTag(tag) {
      this.loadingInstance = Loading.service({
        target: utils.LOADING.QUERY_SELECTOR,
        background: 'rgba(0, 0, 0, 0.8)',
      });

      this.$store.dispatch('tags/selectTag', tag);
      this.$store.dispatch('posts/getAll', { tag: this.currentTag });

      this.loadingInstance.close();
    },
  },
  head() {
    return utils.getCommonMetas(this.doc);
  },
};
</script>

<style lang="scss" scoped>

#blog{
  #posts-list{
    margin: auto;
    .el-tag{
      user-select: none;
      margin: 0 5px;
    }

    .post-row{
      &:not(:first-child){
        margin-top: 15px;
      }
    }
  }
}

</style>
