<template>
  <el-card
    class="article-card"
    shadow="hover"
  >
    <el-row>
      <el-col
        :xs="24"
        :sm="8"
      >
        <div class="image-container">
          <el-image
            style="height: 300px"
            :src="article.image"
            fit="contain"
          />
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="16"
      >
        <div class="title">
          <nuxt-link :to="article.slug">
            {{ article.title }}
          </nuxt-link>
        </div>
      </el-col>
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
      .el-image{
        display: block;
      }
    }
  }

  .title{
    padding: 20px;
  }
}

</style>
