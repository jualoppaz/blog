<template>
  <div id="footer">
    <div id="copyright">
      {{ copyrightText }}
    </div>
    <div id="author">
      👨‍💻 <a href="http://www.juanmanuellopezpazos.es" target="_blank" :title="authorTitle">{{ authorText }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      copyrightText: 'Copyright ©2020',
      authorTitle: this.$t('FOOTER.AUTHOR.TITLE'),
      authorText: 'Juan Manuel López Pazos',
    };
  },
};
</script>

<style lang="scss" scoped>
#footer{
  border-top: 1px solid $color-border-gray;
  text-align: center;
  margin: 0;

  @media screen and (min-width: $tablet-min-width){
    line-height: 59px;
  }

  > div{
    line-height: 39.5px;
    @media screen and (min-width: $tablet-min-width){
      display: inline-block;

      &#author{
        margin-left: 5px;
      }
    }
  }
}
</style>
