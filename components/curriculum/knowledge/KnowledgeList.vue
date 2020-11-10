<template>
  <div class="knowledge-list">
    <h1 class="knowledge-list-title">
      <slot name="title" />
      <el-row :gutter="20">
        <el-col
          v-for="item in items"
          :key="item.id"
          :sm="{
            span: 8
          }"
        >
          <KnowledgeItem
            :item="item"
          />
        </el-col>
      </el-row>
    </h1>
  </div>
</template>

<script>
import KnowledgeItem from '@/components/curriculum/knowledge/KnowledgeItem.vue';

export default {
  name: 'KnowledgeList',
  components: {
    KnowledgeItem,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>
