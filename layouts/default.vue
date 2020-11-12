<template>
  <div id="app">
    <el-container id="layout">
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
      </el-container>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>

import VueAdBlockDetect from 'vue-adblock-detect';
import Menu from '@/components/layout/Menu.vue';
import Footer from '@/components/layout/Footer.vue';

export default {
  name: 'App',
  components: {
    Menu,
    Footer,
  },
  mixins: [VueAdBlockDetect],
  data() {
    return {

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
  mounted() {},
  beforeDestroy() {},
  methods: {},
};
</script>

<style lang="scss">

body{
  margin: 0;
  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;

  #app {
    #layout {
      height:100vh;

      #header{
        padding: 0;
        background-color: $color-background-black;
      }

      #content {
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

              @include for-tablet-up{
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
      }

      .el-footer{
        padding: 0;
        height: 80px !important;

        @include for-tablet-up{
          height: 60px !important;
        }
      }
    }
  }
}
</style>
