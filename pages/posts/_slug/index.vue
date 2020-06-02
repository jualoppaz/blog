<template>
  <div id="post">
    <div>
      <i class="el-icon-date" /> {{ getPostDate() }}
    </div>
    <h1>{{ doc.title }}</h1>
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
  methods: {
    getPostDate() {
      const day = this.$moment(this.doc.createdAt).date();
      const month = this.$moment(this.doc.createdAt).format('MMMM');
      const year = this.$moment(this.doc.createdAt).year();

      return this.$t('VIEWS.POST.DATE', {
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

#post{
  > h1{
    font-size: 50px;
    margin-top: 0;
  }

  #post-card{
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
    }
  }
}

</style>
