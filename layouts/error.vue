<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">
      {{ error.message }}
    </h1>
    <h1 v-else>
      An error occurred
    </h1>
    <nuxt-link to="/">
      Regresar a la página de inicio
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  layout: 'weird',
};
</script>

<style lang="scss" scoped>
.container{
  text-align: center;
}
</style>
