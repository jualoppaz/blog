<template>
  <div id="blog">
    <el-row>
      <el-col>
        <nuxt-content :document="doc" />
      </el-col>
    </el-row>
    <div
      id="articles-list"
    >
      <el-row
        v-for="article in articles"
        :key="article.slug"
        class="article-row"
      >
        <el-col
          :xs="24"
          :lg="{ span: 18, offset: 3 }"
        >
          <ArticleCard :article="article" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import ArticleCard from '../components/ArticleCard.vue';

export default {
  layout: 'blog',
  components: {
    ArticleCard,
  },
  async asyncData({ $content }) {
    const articles = await $content('articles')
      .where({ published: true })
      .fetch();

    const path = 'home';
    const doc = await $content(path).fetch();

    return {
      articles,
      doc,
    };
  },
  head() {
    return {
      title: this.doc.title,
      meta: [
        {
          hid: 'author',
          name: 'author',
          content: this.doc.author,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>

#blog{
  #articles-list{
    margin: auto;

    .article-row{
      &:not(:first-child){
        margin-top: 15px;
      }
    }
  }
}

</style>
