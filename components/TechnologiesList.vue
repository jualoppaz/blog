<template>
  <div
    class="technologies-list"
  >
    <div
      v-for="(technology, index) in technologies"
      :key="index"
      class="technology-item"
    >
      <a
        :href="technology.web"
        target="_blank"
      >
        <el-avatar
          class="technology"
          :size="40"
          shape="square"
          :title="technology.name"
          :src="`/images/${technology.image}`"
        />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TechnologiesList',
  props: {
    technologies: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.technologies-list{
  display: inline-block;

  .technology-item{
    padding: 0 4px 0;
    display: inline-block;

    .technology{
      background-color: $color-text-white;
    }
  }
}
</style>
