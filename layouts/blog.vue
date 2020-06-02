<template>
  <div id="app">
    <el-container id="blog-layout">
      <el-header id="header">
        <div class="container">
          <Menu />
        </div>
      </el-header>
      <el-container id="content">
        <el-container>
          <el-main id="main">
            <nuxt />
          </el-main>
        </el-container>
        <el-aside
          id="aside-column"
          class="hidden-xs-only"
          :width="asideColumnWidth"
          :class="{ hide: showAsideRow() }"
        >
          Barra lateral
        </el-aside>
      </el-container>
      <el-container
        id="aside-row"
        class="hidden-sm-and-up"
        :class="{ hide: showAsideColumn() }"
      >
        Barra lateral versión mobile
      </el-container>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>

import VueAdBlockDetect from 'vue-adblock-detect';
import Menu from '../components/layout/Menu.vue';
import Footer from '../components/layout/Footer.vue';

import utils from '../utils';

export default {
  name: 'App',
  components: {
    Menu,
    Footer,
  },
  mixins: [VueAdBlockDetect],
  data() {
    return {
      isMobile: false,
      asideColumnWidth: '350px',
    };
  },
  beforeMount() {
    this.detectAdBlock().then((response) => {
      if (response) {
        this.$alert(this.$t('COMMON.ADBLOCK.TEXT'), this.$t('COMMON.ADBLOCK.TITLE'), {
          showConfirmButton: false,
          showClose: false,
        });
      }
    });
  },
  mounted() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      if (utils.isMobile()) {
        this.isMobile = true;
      } else if (utils.isTablet()) {
        this.isMobile = false;
        this.asideColumnWidth = '200px';
      } else {
        this.asideColumnWidth = '350px';
        this.isMobile = false;
      }
    },
    showAsideColumn() {
      return !this.isMobile;
    },
    showAsideRow() {
      return this.isMobile;
    },
  },
};
</script>

<style lang="scss">

body{
  margin: 0;
  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;

  #app {
    #blog-layout {
      height:100vh;

      #header{
        padding: 0;
        background-color: $color-background-black;
      }

      #content {
        border-left: 1px solid #e6e6e6;

        .el-header{
          width: 100%;
          padding: 0;
          border-bottom: 1px solid $color-border-gray;
        }

        #main {
          padding: $content-padding-mobile;

          @include for-tablet-up{
            padding: $content-padding-tablet;
          }

          @include for-desktop-up{
            padding: $content-padding-default;
          }

          .banner {
            h1 {
              padding: 5px;
              height: 75px;
              line-height: 75px;
              font-size: 20px;
              text-align: center;
              background: $color-text-blue; // #66b3ff;
              box-shadow: inset 0 8px 8px -8px rgba(0,0,0,.3), inset 0 -8px 8px -8px rgba(0,0,0,.3);
              color: $color-text-white;
              margin: 0;

              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;

              @media screen and (min-width: $tablet-min-width){
                height: 150px;
                line-height: 150px;
                font-size: 50px;
              }
            }
          }

          .wrapper {
            padding: $content-padding-mobile;

            @include for-tablet-up{
              padding: $content-padding-tablet;
            }

            @include for-desktop-up{
              padding: $content-padding-default;
            }
          }
        }

        #aside-column{
          @include for-tablet-up{
            padding: $content-padding-tablet;
          }

          @include for-desktop-up{
            padding: $content-padding-default;
          }

          &.hide{
            display: none;
          }
        }
      }

      #aside-row{
        padding: $content-padding-mobile;

        &.hide{
          display: none;
        }
      }

      .el-footer{
        padding: 0;
        height: 80px !important;

        @media screen and (min-width: $tablet-min-width){
          height: 60px !important;
        }
      }
    }
  }
}
</style>
