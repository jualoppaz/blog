<template>
  <div id="app">
    <el-container id="layout">
      <el-container id="content">
        <el-header>
          <Menu />
        </el-header>

        <el-main id="main">
          <nuxt />
        </el-main>

        <el-footer>
          <Footer />
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import VueAdBlockDetect from 'vue-adblock-detect';
import Menu from '../components/layout/Menu.vue';
import Footer from '../components/layout/Footer.vue';

export default {
  name: 'App',
  components: {
    Menu,
    Footer,
  },
  mixins: [VueAdBlockDetect],
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
};
</script>

<style lang="scss">

body{
  margin: 0;
  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;

  #app {
    #layout {
      height:100vh;

      #content {
        border-left: 1px solid #e6e6e6;

        .el-header{
          width: 100%;
          padding: 0;
          border-bottom: 1px solid $color-border-gray;
        }

        #main {
          padding: $content-padding-default;

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
            padding: 20px;

            @media screen and (min-width: $tablet-min-width){
              padding: $content-padding-default;
            }
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

  .el-menu--vertical {
    ul{
      &.el-menu--popup-right-start{
        li {
          padding: 0 !important;
          > a {
            color: #303133;
            display: block;
            text-decoration: none;
            padding: 0 20px;

            &.router-link-exact-active, &:focus{
              color: #409EFF;

              i {
                color: #409EFF;
              }
            }
          }
        }
      }
    }
  }
}
</style>
