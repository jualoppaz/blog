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
          <slot name="body" :item="item" />
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
    &:not(:first-child) {
      margin-top: 20px;
    }

    div{
      &.media-left{

        @include for-phone-only{
          text-align: center;
        }

        @include for-tablet-up{
          display: table-cell;
          padding-right: 10px;
        }

        img{
          width: 100px;
          height: 100px;

          @include for-tablet-up{
            width: 80px;
            height: 80px;
          }
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
