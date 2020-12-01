<template>
  <div id="degree-course-averages">
    <h1 id="degree-course-averages-title">
      {{ headerTitle }}
    </h1>
    <el-divider />
    <el-table
      :data="rows"
      border
    >
      <el-table-column
        :label="degreeCourseLabel"
        prop="degreeCourse"
        align="center"
      />
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
export default {
  name: 'DegreeCourseAverages',
  data() {
    return {
      headerTitle: this.$t('VIEWS.ACADEMIC_RECORD.DEGREE_COURSE_AVERAGES_TABLE.HEADER.TITLE'),
      degreeCourseLabel: this.$t('VIEWS.ACADEMIC_RECORD.DEGREE_COURSE_AVERAGES_TABLE.DEGREE_COURSE.LABEL'),
      subjectAverageLabel: this.$t('VIEWS.ACADEMIC_RECORD.DEGREE_COURSE_AVERAGES_TABLE.SUBJECT_AVERAGE.LABEL'),
      creditAverageLabel: this.$t('VIEWS.ACADEMIC_RECORD.DEGREE_COURSE_AVERAGES_TABLE.CREDIT_AVERAGE.LABEL'),
    };
  },
  computed: {
    subjectAverageByDegreeCourse20102011() {
      return this.$store.getters['academic-records/getSubjectAverageByDegreeCourse'](1);
    },
    subjectAverageByDegreeCourse20112012() {
      return this.$store.getters['academic-records/getSubjectAverageByDegreeCourse'](2);
    },
    subjectAverageByDegreeCourse20122013() {
      return this.$store.getters['academic-records/getSubjectAverageByDegreeCourse'](3);
    },
    subjectAverageByDegreeCourse20132014() {
      return this.$store.getters['academic-records/getSubjectAverageByDegreeCourse'](4);
    },
    creditAverageByDegreeCourse20102011() {
      return this.$store.getters['academic-records/getCreditAverageByDegreeCourse'](1);
    },
    creditAverageByDegreeCourse20112012() {
      return this.$store.getters['academic-records/getCreditAverageByDegreeCourse'](2);
    },
    creditAverageByDegreeCourse20122013() {
      return this.$store.getters['academic-records/getCreditAverageByDegreeCourse'](3);
    },
    creditAverageByDegreeCourse20132014() {
      return this.$store.getters['academic-records/getCreditAverageByDegreeCourse'](4);
    },
    rows() {
      return [
        {
          degreeCourse: 1,
          subjectAverage: this.subjectAverageByDegreeCourse20102011,
          creditAverage: this.creditAverageByDegreeCourse20102011,
        }, {
          degreeCourse: 2,
          subjectAverage: this.subjectAverageByDegreeCourse20112012,
          creditAverage: this.creditAverageByDegreeCourse20112012,
        }, {
          degreeCourse: 3,
          subjectAverage: this.subjectAverageByDegreeCourse20122013,
          creditAverage: this.creditAverageByDegreeCourse20122013,
        }, {
          degreeCourse: 4,
          subjectAverage: this.subjectAverageByDegreeCourse20132014,
          creditAverage: this.creditAverageByDegreeCourse20132014,
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
#degree-course-averages{
  #degree-course-averages-title{
    font-size: 36px;
    margin-top: 50px;
    margin-bottom: 10px;
  }
}
</style>
