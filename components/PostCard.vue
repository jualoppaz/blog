<template>
  <el-card
    class="post-card"
    shadow="hover"
  >
    <el-row>
      <div class="image-container">
        <el-image
          :src="post.image"
          fit="contain"
        />
      </div>
      <div class="post-card-info">
        <div class="title">
          <nuxt-link :to="`/posts/${post.slug}`">
            {{ post.title }}
          </nuxt-link>
        </div>
      </div>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'PostsCard',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>

.post-card{
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
