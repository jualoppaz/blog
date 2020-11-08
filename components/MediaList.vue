<template>
  <ul class="media-list">
    <li
      v-for="(item, index) in items"
      :key="index"
      class="media"
    >
      <div
        class="media-left"
      >
        <slot name="image" :item="item" />
      </div>
      <div class="media-body">
        <h4>
          <slot name="title" :item="item" />
        </h4>
        <div>
          <slot name="description" :item="item" />
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'MediaList',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
ul.media-list{
  list-style: none;
  padding: 0;

  li.media{
    div{
      &.media-left{
        display: table-cell;
        padding-right: 10px;

        img{
          width: 80px;
          height: 80px;
        }
      }

      &.media-body{
        display: table-cell;
        vertical-align: top;

        h4 {
          margin-top:10px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
