<template>
  <div id="blog">
    <!--<el-row>
      <el-col>
        <nuxt-content :document="doc" />
      </el-col>
    </el-row>-->
    <el-row
      id="articles-list"
    >
      <el-col
        v-for="article in articles"
        :key="article.slug"
        :xs="24"
      >
        <ArticleCard :article="article" />
      </el-col>
    </el-row>
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
    const articles = await $content('articles').fetch();

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

    /* @media screen and (min-width: $lg-desktop-min-width) {
      width: 80%;
    } */
  }
}

</style>
