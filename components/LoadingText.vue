<template>
  <div class="loading-text">
    <font-awesome-icon
      :icon="['fas', 'spinner']"
      spin
      size="lg"
    />
    {{ loadingText }}
  </div>
</template>

<script>
export default {
  name: 'LoadingText',
  data() {
    return {
      loadingText: this.$t('COMMON.LOADING'),
    };
  },
};
</script>

<style lang="scss" scoped>
.loading-text{
  text-align: center;
  font-size: 18px;
  font-weight: 700;
}
</style>
