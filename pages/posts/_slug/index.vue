<template>
  <div id="post">
    <div id="date">
      <i class="el-icon-date" /> {{ getPostDate() }}
    </div>
    <h1 id="title">{{ doc.title }}</h1>
    <div id="tags">
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
    <el-card id="post-card" class="box-card">
      <div id="post-image">
        <el-image
          style="width: 450px; height: 450px"
          :src="doc.image"
          fit="contain"
        />
      </div>
      <nuxt-content :document="doc" />
    </el-card>
  </div>
</template>

<script>
export default {
  layout: 'blog',
  components: {

  },
  async asyncData({ $content, params, error }) {
    const path = `posts/${params.slug}`;

    const doc = await $content(path)
      .where({ published: true })
      .fetch()
      .catch(() => {
        error({
          statusCode: 404,
          message: 'No encontrado',
        });
      });

    return {
      doc,
    };
  },
  computed: {
    tags() {
      return this.$store.getters['tags/getTagsInfo'](this.doc.tags);
    },
  },
  methods: {
    getPostDate() {
      const day = this.$moment(this.doc.createdAt).date();
      const month = this.$moment(this.doc.createdAt).format('MMMM');
      const year = this.$moment(this.doc.createdAt).year();

      return this.$t('VIEWS.POSTS.DETAIL.POST.DATE', {
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

#post{
  #title{
    font-size: 50px;
    margin: 0;
  }

  #tags{
    margin-top: 5px;

    .el-tag{
      margin: 0 5px;

      &:first-child{
        margin-left: 0;
      }
    }
  }

  #post-card{
    margin-top: 50px;
    padding: $content-padding-mobile;

    @include for-tablet-up{
      padding: $content-padding-tablet;
    }

    #post-image{
      text-align: center;
    }

    .nuxt-content{
      p{
        //margin: 1.5em 0;
        line-height: 1.6;
        text-align: justify;

        & + h3{
          margin-top: 2em;
        }
      }

      a{
        color: $color-text-blue;

        &:hover{
          color: $color-text-orange;
        }
      }

      h2, h3{
        &>a:before{
          content: "#";
          --text-opacity: 1;
          color: #48bb78;
          color: rgba(72,187,120,var(--text-opacity));
          font-weight: 400;
          margin-left: -1.25rem;
          padding-right: .25rem;
          position: absolute;
          opacity: 1;
        }
      }

      ol, ul {
        li{
          margin: 0 0 3px 0;
        }
      }
    }
  }
}

</style>
