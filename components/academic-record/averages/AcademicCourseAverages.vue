<template>
  <div id="academic-course-averages">
    <h1 id="academic-course-averages-title">
      {{ headerTitle }}
    </h1>
    <el-divider />
    <el-table
      :data="rows"
      border
    >
      <el-table-column
        :label="academicCourseLabel"
        prop="academicCourse"
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
  name: 'AcademicCourseAverages',
  data() {
    return {
      headerTitle: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_AVERAGES_TABLE.HEADER.TITLE'),
      academicCourseLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_AVERAGES_TABLE.ACADEMIC_COURSE.LABEL'),
      subjectAverageLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_AVERAGES_TABLE.SUBJECT_AVERAGE.LABEL'),
      creditAverageLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_AVERAGES_TABLE.CREDIT_AVERAGE.LABEL'),
    };
  },
  computed: {
    subjectAverageByAcademicCourse20102011() {
      return this.$store.getters['academic-records/getSubjectAverageByAcademicCourse']('2010/2011');
    },
    subjectAverageByAcademicCourse20112012() {
      return this.$store.getters['academic-records/getSubjectAverageByAcademicCourse']('2011/2012');
    },
    subjectAverageByAcademicCourse20122013() {
      return this.$store.getters['academic-records/getSubjectAverageByAcademicCourse']('2012/2013');
    },
    subjectAverageByAcademicCourse20132014() {
      return this.$store.getters['academic-records/getSubjectAverageByAcademicCourse']('2013/2014');
    },
    creditAverageByAcademicCourse20102011() {
      return this.$store.getters['academic-records/getCreditAverageByAcademicCourse']('2010/2011');
    },
    creditAverageByAcademicCourse20112012() {
      return this.$store.getters['academic-records/getCreditAverageByAcademicCourse']('2011/2012');
    },
    creditAverageByAcademicCourse20122013() {
      return this.$store.getters['academic-records/getCreditAverageByAcademicCourse']('2012/2013');
    },
    creditAverageByAcademicCourse20132014() {
      return this.$store.getters['academic-records/getCreditAverageByAcademicCourse']('2013/2014');
    },
    rows() {
      return [
        {
          academicCourse: '2010/2011',
          subjectAverage: this.subjectAverageByAcademicCourse20102011,
          creditAverage: this.creditAverageByAcademicCourse20102011,
        }, {
          academicCourse: '2011/2012',
          subjectAverage: this.subjectAverageByAcademicCourse20112012,
          creditAverage: this.creditAverageByAcademicCourse20112012,
        }, {
          academicCourse: '2012/2013',
          subjectAverage: this.subjectAverageByAcademicCourse20122013,
          creditAverage: this.creditAverageByAcademicCourse20122013,
        }, {
          academicCourse: '2013/2014',
          subjectAverage: this.subjectAverageByAcademicCourse20132014,
          creditAverage: this.creditAverageByAcademicCourse20132014,
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
#academic-course-averages{
  #academic-course-averages-title{
    font-size: 36px;
    margin-top: 50px;
    margin-bottom: 10px;
  }
}
</style>
