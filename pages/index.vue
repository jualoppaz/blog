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
      <el-row id="tags-filter-section">
        <el-col
          :xs="24"
          :md="{ span: 12, offset: 6 }"
          :lg="{ span: 8, offset: 8 }"
        >
          <TagsFilter />
        </el-col>
      </el-row>
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
import TagsFilter from '../components/TagsFilter.vue';
import utils from '../utils';

export default {
  // layout: 'blog',
  components: {
    PostCard,
    TagsFilter,
  },
  async fetch() {
    if (process.client) {
      this.loadingInstance = Loading.service({
        target: utils.LOADING.QUERY_SELECTOR,
        background: 'rgba(0, 0, 0, 0.8)',
      });
    }

    const tag = this.$store.state.tags.current;

    return Promise.all([
      this.$store.dispatch('posts/getAll', { tag }),
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
  },
  head() {
    return utils.getCommonMetas(this.doc);
  },
};
</script>

<style lang="scss" scoped>

#blog{
  .nuxt-content{
    #bienvenido-a-mi-blog{
      font-size: 50px;
      margin: 0;
    }
  }

  #tags-filter-section{
    text-align: center;
  }

  #posts-list{
    margin: auto;

    .tags-filter{
      ::v-deep .el-tag{
        user-select: none;
        margin: 0 5px;
      }

      ::v-deep .secondary-tags{
        margin-top: 15px;
      }
    }

    .post-row{
      &:not(:first-child){
        margin-top: 15px;
      }
    }
  }
}

</style>
