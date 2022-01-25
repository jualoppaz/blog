<template>
  <div class="knowledge-item">
    <a
      :href="item.technology.web"
      target="_blank"
      rel="nofollow"
    >
      <img
        :title="item.technology.name"
        :src="`/images/${item.technology.image}`"
      >
    </a>
    <div class="progress-bar">
      <el-progress
        :stroke-width="24"
        :percentage="getPercentage(item.level)"
        :text-inside="true"
        :format="getFormat"
        :status="getStatus(item.level)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'KnowledgeItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getPercentage(level) {
      if (level === 3) return 100;
      if (level === 2) return 60;
      return 30;
    },
    getStatus(level) {
      if (level === 3) return 'success';
      if (level === 2) return null;
      return 'exception';
    },
    getFormat(percentage) {
      if (percentage === 100) return this.$t('VIEWS.CV.KNOWLEDGE.LEVEL.HIGH');
      if (percentage === 60) return this.$t('VIEWS.CV.KNOWLEDGE.LEVEL.MEDIUM');
      return this.$t('VIEWS.CV.KNOWLEDGE.LEVEL.LOW');
    },
  },
};
</script>

<style lang="scss" scoped>

.knowledge-item{
  text-align: center;

  a {
    img{
      padding-top: 10px;
      width: 80px;
      height: 80px;
    }

    &+.progress-bar{
      ::v-deep .el-progress-bar__inner{
        text-align: center;
      }
    }
  }
}
</style>
