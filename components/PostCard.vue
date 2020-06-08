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
        <div class="date">
          <span>{{ getPostDate() }}</span>
        </div>
        <div class="title">
          <nuxt-link :to="`/posts/${post.slug}`">
            {{ post.title }}
          </nuxt-link>
        </div>
        <div class="tags">
          <el-tag
            v-for="tag in tags"
            :key="tag.name"
            :style="{
              'background-color': getTagBackgroundColor(tag),
              'border-color': getTagBorderColor(tag),
              color: getTagColor(tag),
            }"
            class="default no-select"
          >
            {{ tag.label }}
          </el-tag>
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
  computed: {
    tags() {
      return this.$store.getters['tags/getTagsInfo'](this.post.tags);
    },
  },
  methods: {
    getPostDate() {
      const day = this.$moment(this.post.creationDate).date();
      const month = this.$moment(this.post.creationDate).format('MMMM');
      const year = this.$moment(this.post.creationDate).year();

      return this.$t('VIEWS.POSTS.ITEM.DATE', {
        day,
        month,
        year,
      });
    },
    getTagBackgroundColor(tag) {
      return tag.background_color.selected;
    },
    getTagBorderColor(tag) {
      return tag.border_color.selected;
    },
    getTagColor(tag) {
      return tag.color.selected;
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
        padding: 10px;
      }

      .el-image{
        display: block;
        margin: auto;
        width: 300px;
        height: 300px;
      }
    }

    .post-card-info{
      padding: $content-padding-mobile;

      .date{
        span {
          line-height: 25px;
          font-size: 16px;
          color: $color-text-gray;
        }
      }

      .title{
        font-size: 35px;
      }

      .tags{
        margin-top: 15px;

        .el-tag{
          margin: 0 5px;

          &:first-child{
            margin-left: 0;
          }
        }
      }
    }
  }
}

</style>
