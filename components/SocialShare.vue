<template>
  <div>
    <h2 class="default">
      {{ title }}
    </h2>
    <social-sharing
      :url="seoConfig.canonical_url"
      :title="seoConfig.title"
      :description="seoConfig.description"
      inline-template
    >
      <div class="networks-inline-list">
        <network network="twitter">
          <font-awesome-icon
            class="twitter-icon"
            :icon="['fab', 'twitter']"
            size="2x"
          />
        </network>
        <network network="facebook">
          <font-awesome-icon
            class="facebook-icon"
            :icon="['fab', 'facebook']"
            size="2x"
          />
        </network>
      </div>
    </social-sharing>
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
    seoConfig: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>
