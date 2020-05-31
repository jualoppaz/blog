<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col>
          <el-card
            shadow="hover"
          >
            <nuxt-link
              to="/"
            >
              Inicio
            </nuxt-link>
          </el-card>
          <el-card
            v-for="article in articles"
            :key="article.slug"
            shadow="hover"
          >
            <nuxt-link :to="article.slug">
              {{ article.title }}
            </nuxt-link>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <pre>{{ doc }}</pre>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <nuxt-content :document="doc" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  components: {

  },
  async asyncData ({ $content, params }) {
    const articles = await $content('articles').fetch()

    const path = params.slug ? `articles/${params.slug}` : 'home'
    const doc = await $content(path).fetch()

    return {
      articles,
      doc
    }
  },
  head () {
    return {
      title: this.doc.title,
      meta: [
        {
          hid: 'author',
          name: 'author',
          content: this.doc.author
        }
      ]
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
