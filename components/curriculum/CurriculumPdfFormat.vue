<template>
  <div id="curriculum-pdf-format">
    <div id="text">
      {{ curriculumPdfFormatText }}
      <a
        href="/docs/Curriculum.pdf"
        target="_blank"
        :title="seeIconTitle"
        class="file-pdf-icon"
      >
        <font-awesome-icon
          :icon="['far', 'file-pdf']"
          size="lg"
        />
      </a>
      <a
        href="/docs/Curriculum.pdf"
        target="_self"
        download=""
        :title="downloadIconTitle"
        class="download-icon"
      >
        <font-awesome-icon
          :icon="['fas', 'download']"
          size="lg"
        />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CurriculumPdfFormat',
  data() {
    return {
      curriculumPdfFormatText: this.$t('VIEWS.CV.SEE_CV.TEXT'),
      seeIconTitle: this.$t('VIEWS.CV.SEE_CV.SEE_ICON.TITLE'),
      downloadIconTitle: this.$t('VIEWS.CV.SEE_CV.DOWNLOAD_ICON.TITLE'),
    };
  },
};
</script>

<style lang="scss" scoped>

#curriculum-pdf-format{
  > #text {
    font-size: 24px;

    .file-pdf-icon, .download-icon {
      color: $color-text-red-dark;
    }
  }
}
</style>
