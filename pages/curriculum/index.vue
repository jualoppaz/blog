<template>
  <div id="curriculum">
    Aquí va mi Currículum
  </div>
</template>

<script>
export default {
  beforeDestroy() {
    this.$store.dispatch('posts/destroyCurrent');
  },
};
</script>
