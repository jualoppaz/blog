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
          v-if="showAsideColumn()"
          id="aside-column"
          :width="asideColumnWidth"
        >
          <div class="tags-filter-section">
            <TagsFilter @tagChanged="goToBlog()" />
          </div>
          <Advertisement />
        </el-aside>
      </el-container>
      <el-container
        v-if="showAsideRow()"
        id="aside-row"
      >
        <div>
          <div class="tags-filter-section">
            <TagsFilter @tagChanged="goToBlog()" />
          </div>
          <Advertisement />
        </div>
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

import TagsFilter from '@/components/TagsFilter.vue';

import utils from '@/utils';
import Advertisement from '@/components/Advertisement.vue';

export default {
  name: 'App',
  components: {
    Menu,
    Footer,
    TagsFilter,
    Advertisement,
  },
  mixins: [VueAdBlockDetect],
  data() {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: false,
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
        this.isTablet = false;
        this.isDesktop = false;
      } else if (utils.isTablet()) {
        this.asideColumnWidth = '200px';
        this.isMobile = false;
        this.isTablet = true;
        this.isDesktop = false;
      } else {
        this.asideColumnWidth = '350px';
        this.isMobile = false;
        this.isTablet = false;
        this.isDesktop = true;
      }
    },
    showAsideColumn() {
      return this.isDesktop;
    },
    showAsideRow() {
      return this.isMobile || this.isTablet;
    },
    goToBlog() {
      this.$router.push({
        path: '/',
      });
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

        #aside-column{
          padding: 5px;

          .tags-filter-section{
            width: 100%;
            text-align: center;
          }

          .tags-filter{
            .el-tag{
              user-select: none;
              margin: 0 5px;
            }

            .secondary-tags{
              margin-top: 15px;
            }
          }
        }
      }

      #aside-row{
        padding: $content-padding-mobile;

        > div{
          display: block;
          width: 100%;

          .tags-filter-section{
            width: 100%;
            text-align: center;
          }
        }

        .tags-filter{
          .el-tag{
            user-select: none;
            margin: 0 5px;
          }

          .secondary-tags{
            margin-top: 15px;
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
