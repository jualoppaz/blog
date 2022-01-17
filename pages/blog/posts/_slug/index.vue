<template>
  <div id="post">
    <article>
      <time id="date" :datetime="getPostDateFormated()">
        <i class="el-icon-date" /> {{ getPostDate() }}
      </time>
      <h1 id="title">
        {{ doc.title }}
      </h1>
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
        <div
          id="post-image"
        >
          <el-image
            v-if="doc.image"
            :src="doc.image"
            fit="contain"
          />
        </div>
        <el-row>
          <el-col
            :xs="{
              span: 24
            }"
            :sm="{
              span: 12,
              offset: 6
            }"
          >
            <el-card
              id="toc-container"
            >
              <p id="toc-title">
                {{ tocTitleText }}
              </p>
              <ul id="toc-list">
                <li
                  v-for="link of doc.toc"
                  :key="link.id"
                  :class="{
                    'toc2': link.depth === 2,
                    'toc3': link.depth === 3,
                    'toc4': link.depth === 4,
                  }"
                >
                  <NuxtLink :to="`#${link.id}`">
                    {{ link.text }}
                  </NuxtLink>
                </li>
              </ul>
            </el-card>
          </el-col>
        </el-row>
        <nuxt-content :document="doc" />
      </el-card>
    </article>
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
import Advertisement from '@/components/Advertisement.vue';

import utils from '@/utils';

export default {
  layout: 'blog',
  components: {
    SocialShare,
    // eslint-disable-next-line vue/no-unused-components
    Advertisement,
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
        slug: this.$route.params.slug,
      }),
    ])
      .finally(() => {
        if (this.loadingInstance) this.loadingInstance.close();
      });
  },
  data() {
    return {
      shareText: this.$t('COMMON.SOCIAL_SHARING.SHARE'),
      tocTitleText: this.$t('VIEWS.POSTS.DETAIL.POST.TOC.TITLE'),
    };
  },
  computed: {
    ...mapState('posts', {
      doc: 'current',
    }),
    tags() {
      return this.$store.getters['tags/getTagsInfo'](this.doc.tags);
    },
  },
  beforeDestroy() {
    this.$store.dispatch('posts/destroyCurrent');
  },
  methods: {
    getPostDate() {
      const day = this.$moment(this.doc.creationDate).date();
      const month = this.$moment(this.doc.creationDate).format('MMMM');
      const year = this.$moment(this.doc.creationDate).year();

      return this.$t('VIEWS.POSTS.DETAIL.POST.DATE', {
        day,
        month,
        year,
      });
    },
    getPostDateFormated() {
      return this.$moment(this.doc.creationDate).format(utils.COMMON.DATE_FORMAT.FOR_SEO);
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
    return utils.getCommonMetas(this.doc);
  },
};
</script>

<style lang="scss" scoped>

#post{
  #title{
    margin: 0;
    font-size: 30px;

    @include for-tablet-up{
      font-size: 50px;
    }
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

      .el-image{
        max-width: 100%;

        @include for-tablet-up{
          width: 450px;
          height: 450px;
        }
      }
    }

    #toc-container{
      background: #F8F8F8;

      @include for-tablet-up{
        padding: 0 30px 0;
      }

      #toc-title{
        text-align: center;
        font-weight: 700;
      }

      #toc-list{
        padding: 0;

        .toc2, .toc3, .toc4{
          list-style: none;
          line-height: 1.8em;
        }

        .toc3{
          padding-left: 15px;

          @include for-tablet-up{
            padding-left: 30px;
          }
        }

        .toc4{
          padding-left: 30px;

          @include for-tablet-up{
            padding-left: 60px;
          }
        }
      }
    }

    ::v-deep .nuxt-content{
      p{
        //margin: 1.5em 0;
        line-height: 1.6;
        text-align: justify;

        & + h3{
          margin-top: 2em;
        }
      }

      h2, h3, h4{
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

        &:not(:first-of-type){
          margin-top: 50px;
        }
      }

      ol, ul {
        li{
          margin: 0 0 3px 0;
        }
      }

      .post-image-container{
        text-align: center;
        margin: 50px 0;

        .post-image-caption {
          color: $color-text-gray;
          text-align: justify;
        }
      }

      .embed-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        margin: 50px 0;
      }

      .embed-container iframe {
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      q{
        font-style: italic;
        color: $color-text-gray;
      }

      ::v-deep .el-table{
        table{
          thead{
            tr{
              th{
                .cell{
                  white-space: nowrap;
                }
              }
            }
          }
          tbody{
            tr{
              td{
                .cell{
                  white-space: nowrap;
                }
              }
            }
          }
        }
      }

      .static-table {
        display: block;
        width: 100%;
        overflow-x: auto;

        table{
          font-family: Arial, Helvetica, sans-serif;
          border-collapse: collapse;
          width: 100%;

          td, th {
            border: 1px solid #ddd;
            padding: 10px;
          }

          tr:nth-child(even){
            background-color: #f2f2f2;
          }

          tr:hover {
            background-color: #ddd;
          }

          th {
            padding-top: 12px;
            padding-bottom: 12px;
            background-color: #04AA6D;
            color: white;
            min-width: 200px;
          }
        }
      }
    }
  }
}

</style>
