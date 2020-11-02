<template>
  <el-menu
    id="menu"
    mode="horizontal"
  >
    <el-menu-item index="1">
      <NuxtLink
        to="/"
        :title="homeLinkTitle"
      >
        <span>{{ homeItemText }}</span>
      </NuxtLink>
    </el-menu-item>
    <el-menu-item index="2">
      <NuxtLink
        to="/curriculum"
        :title="cvLinkTitle"
      >
        <span>{{ cvItemText }}</span>
      </NuxtLink>
    </el-menu-item>
    <el-menu-item index="3">
      <NuxtLink
        :to="{ name: `blog___${$i18n.locale}` }"
        :title="blogLinkTitle"
      >
        <span>{{ blogItemText }}</span>
      </NuxtLink>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'Menu',
  components: {},
  data() {
    return {
      homeItemText: this.$t('MENU.HOME.TEXT'),
      cvItemText: this.$t('MENU.CV.TEXT'),
      blogItemText: this.$t('MENU.BLOG.TEXT'),
      homeLinkTitle: this.$t('MENU.HOME.LINK.TITLE'),
      cvLinkTitle: this.$t('MENU.CV.LINK.TITLE'),
      blogLinkTitle: this.$t('MENU.BLOG.LINK.TITLE'),
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {},
};
</script>

<style lang="scss" scoped>

#menu{
  background-color: transparent;

  li.el-menu-item {
    padding: 0;

    a {
      padding: 0 20px;
      display: block;
      font-weight: bold;

      span {
        color: $color-text-white;
      }
    }

    &:hover{
      a {
        span {
          color: $color-text-black;
        }
      }
    }
  }
}

</style>
