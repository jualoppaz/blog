<template>
  <div id="degree-averages">
    <h1 id="degree-averages-title">
      {{ headerTitle }}
    </h1>
    <el-divider />
    <el-table
      :data="rows"
      border
    >
      <el-table-column
        :label="subjectAverageLabel"
        align="center"
      >
        <template slot-scope="props">
          <el-tag
            :type="getMarkType(props.row.subjectAverage)"
            effect="dark"
          >
            {{ props.row.subjectAverage }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="creditAverageLabel"
        align="center"
      >
        <template slot-scope="props">
          <el-tag
            :type="getMarkType(props.row.creditAverage)"
            effect="dark"
          >
            {{ props.row.creditAverage }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DegreeAverages',
  data() {
    return {
      headerTitle: this.$t('VIEWS.ACADEMIC_RECORD.DEGREE_AVERAGES_TABLE.HEADER.TITLE'),
      subjectAverageLabel: this.$t('VIEWS.ACADEMIC_RECORD.DEGREE_AVERAGES_TABLE.SUBJECT_AVERAGE.LABEL'),
      creditAverageLabel: this.$t('VIEWS.ACADEMIC_RECORD.DEGREE_AVERAGES_TABLE.CREDIT_AVERAGE.LABEL'),
    };
  },
  computed: {
    ...mapGetters('academic-records', {
      subjectAverage: 'getSubjectAverage',
    }),
    ...mapGetters('academic-records', {
      creditAverage: 'getCreditAverage',
    }),
    rows() {
      return [
        {
          subjectAverage: this.subjectAverage,
          creditAverage: this.creditAverage,
        },
      ];
    },
  },
  methods: {
    getMarkType(average) {
      if (average >= 9) return 'warning';
      if (average >= 7) return '';
      if (average >= 5) return 'success';
      if (average < 5) return 'fail';
      return 'info';
    },
  },
};
</script>

<style lang="scss" scoped>
#degree-averages{
  #degree-averages-title{
    font-size: 36px;
    margin-top: 50px;
    margin-bottom: 10px;
  }
}
</style>
