<template>
  <div class="tags-filter">
    <h2> {{ title }}</h2>
    <div class="main-tags">
      <el-tag
        v-for="tag in mainTags"
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
    <el-divider />
    <div class="secondary-tags">
      <el-tag
        v-for="tag in secondaryTags"
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
  </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex';
import { Loading } from 'element-ui';

import utils from '@/utils';

export default {
  name: 'TagsFilter',
  data() {
    return {
      title: this.$t('COMPONENTS.TAGS_FILTER.TITLE'),
    };
  },
  computed: {
    ...mapGetters({
      mainTags: 'tags/getMainTags',
    }),
    ...mapGetters({
      secondaryTags: 'tags/getSecondaryTags',
    }),
    ...mapState('tags', {
      currentTag: 'current',
    }),
  },
  methods: {
    getTagBackgroundColor(tag) {
      if (this.$store.getters['tags/isCurrentTag'](tag)) return tag.background_color.selected;
      return tag.background_color.default;
    },
    getTagBorderColor(tag) {
      if (this.$store.getters['tags/isCurrentTag'](tag)) return tag.border_color.selected;
      return tag.border_color.default;
    },
    getTagColor(tag) {
      if (this.$store.getters['tags/isCurrentTag'](tag)) return tag.color.selected;
      return tag.color.default;
    },
    selectTag(tag) {
      if (!this.$store.getters['tags/isCurrentTag'](tag)) {
        this.loadingInstance = Loading.service({
          target: utils.LOADING.QUERY_SELECTOR,
          background: 'rgba(0, 0, 0, 0.8)',
        });

        this.$store.dispatch('tags/selectTag', tag);

        this.loadingInstance.close();
        this.$emit('tagChanged');
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.el-tag{
  &:hover{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .15);
  }
}

</style>
