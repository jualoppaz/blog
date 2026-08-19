<template>
  <div>
    <h2 class="default">
      {{ title }}
    </h2>
    <div class="networks-inline-list">
      <ShareNetwork
        network="twitter"
        :url="seoConfig.canonical_url"
        :title="docTitle"
        :description="seoConfig.description"
      >
        <font-awesome-icon
          class="twitter-icon"
          :icon="['fab', 'twitter']"
          size="2x"
        />
      </ShareNetwork>
      <ShareNetwork
        network="facebook"
        :url="seoConfig.canonical_url"
        :title="docTitle"
        :description="seoConfig.description"
      >
        <font-awesome-icon
          class="facebook-icon"
          :icon="['fab', 'facebook']"
          size="2x"
        />
      </ShareNetwork>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SocialShare',
  props: {
    title: {
      type: String,
      default: '',
    },
    docTitle: {
      type: String,
      default: '',
    },
    seoConfig: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>
