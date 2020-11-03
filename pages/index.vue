<template>
  <div id="home">
    <el-row>
      <el-col
        style="text-align: center"
      >
        <el-avatar
          id="personal-image"
          :size="200"
          src="http://juanmanuellopezpazos.es/images/yo_2018.jpg"
          fit="fill"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col
        :xs="24"
        :lg="{
          span: 16,
          offset: 4
        }"
      >
        <nuxt-content :document="doc" />
      </el-col>
    </el-row>
    <el-row
      class="social-networks"
    >
      <social-share
        :title="shareText"
        :seo-config="doc.metas"
      />
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Loading } from 'element-ui';
import SocialShare from '@/components/SocialShare.vue';
import utils from '@/utils';

export default {
  components: {
    SocialShare,
  },
  async fetch() {
    if (process.client) {
      this.loadingInstance = Loading.service({
        target: utils.LOADING.QUERY_SELECTOR,
        background: 'rgba(0, 0, 0, 0.8)',
      });
    }

    return Promise.all([
      this.$store.dispatch('posts/getBySlug', {
        slug: 'home',
      }),
    ])
      .finally(() => {
        if (this.loadingInstance) this.loadingInstance.close();
      });
  },
  data() {
    return {
      shareText: this.$t('COMMON.SOCIAL_SHARING.SHARE'),
    };
  },
  computed: {
    ...mapState('posts', {
      doc: 'current',
    }),
  },
  beforeDestroy() {
    this.$store.dispatch('posts/destroyCurrent');
  },
  head() {
    return utils.getCommonMetas(this.doc);
  },
};
</script>

<style lang="scss" scoped>

#home {
  ::v-deep #personal-image{
    border: 4px solid $color-text-blue;

    > img {
      width: 100%;
    }
  }
}
</style>
