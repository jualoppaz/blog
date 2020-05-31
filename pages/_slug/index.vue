<template>
  <div id="article">
    <div>
      <i class="el-icon-date" /> {{ getArticleDate() }}
    </div>
    <h1>{{ doc.title }}</h1>
    <div id="article-image">
      <el-image
        style="width: 450px; height: 450px"
        :src="doc.image"
        fit="contain"
      />
    </div>
    <nuxt-content :document="doc" />
  </div>
</template>

<script>
export default {
  layout: 'blog',
  components: {

  },
  async asyncData({ $content, params }) {
    const articles = await $content('articles').fetch();

    const path = params.slug ? `articles/${params.slug}` : 'home';
    const doc = await $content(path).fetch();

    return {
      articles,
      doc,
    };
  },
  methods: {
    getArticleDate() {
      const day = this.$moment(this.doc.createdAt).date();
      const month = this.$moment(this.doc.createdAt).format('MMMM');
      const year = this.$moment(this.doc.createdAt).year();

      return this.$t('VIEWS.ARTICLE.DATE', {
        day,
        month,
        year,
      });
    },
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

#article{
  > h1{
    font-size: 50px;
    margin-top: 0;
  }

  #article-image{
    text-align: center;
  }
}

</style>
