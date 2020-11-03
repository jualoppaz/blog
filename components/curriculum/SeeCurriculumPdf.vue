<template>
  <div id="curriculum-pdf-format">
    <div id="text">
      {{ curriculumPdfFormatText }} Consultar en formato PDF
      <a
        href="/docs/Curriculum.pdf"
        target="_blank"
        title="xoxVisualizar"
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
        title="xoxDescargar"
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
