<template>
  <el-card
    class="article-card"
    shadow="hover"
  >
    <el-row>
      <div class="image-container">
        <el-image
          :src="article.image"
          fit="contain"
        />
      </div>
      <div class="article-card-info">
        <div class="title">
          <nuxt-link :to="`/posts/${article.slug}`">
            {{ article.title }}
          </nuxt-link>
        </div>
      </div>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>

.article-card{
  ::v-deep .el-card__body{
    padding: 0;

    .image-container{
      @include for-tablet-up{
        float: left;
      }

      .el-image{
        display: block;
        margin: auto;
        width: 300px;
        height: 300px;
      }
    }
  }

  .title{
    padding: 20px;
  }
}

</style>
