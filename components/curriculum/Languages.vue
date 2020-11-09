<template>
  <div id="languages">
    <h1 class="curriculum-section-title">
      <font-awesome-icon
        :icon="['fas', 'users']"
        size="1x"
      />
      {{ languagesTitle }}
    </h1>
    <el-divider />
    <MediaList
      :items="languages"
    >
      <template v-slot:image="{ item: language }">
        <img :src="`${language.image}`">
      </template>
      <template v-slot:title="{ item: language }">
        {{ language.level }} {{ language.name }} ({{ language.date }})
      </template>
      <template v-slot:body="{ item: language }">
        {{ language.description }}
      </template>
    </MediaList>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MediaList from '@/components/MediaList.vue';

export default {
  name: 'Languages',
  components: {
    MediaList,
  },
  data() {
    return {
      languagesTitle: this.$t('VIEWS.CV.LANGUAGES.TITLE'),
    };
  },
  computed: {
    ...mapState('curriculum', {
      languages: 'languages',
    }),
  },
};
</script>
