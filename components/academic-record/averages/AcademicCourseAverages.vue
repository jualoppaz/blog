<template>
  <div id="academic-course-averages">
    <h1 id="academic-course-averages-title">
      xoxMedias por Curso Académico
    </h1>
    <el-divider />
    <el-table
      :data="rows"
      border
    >
      <el-table-column
        label="xoxCurso académico"
        prop="academicCourse"
        align="center"
      />
      <el-table-column
        label="xoxMedia por Asignatura"
        prop="subjectAverage"
        align="center"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'AcademicCourseAverages',
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
    rows() {
      return [
        {
          academicCourse: '2010/2011',
          subjectAverage: this.subjectAverageByAcademicCourse20102011,
        }, {
          academicCourse: '2011/2012',
          subjectAverage: this.subjectAverageByAcademicCourse20112012,
        }, {
          academicCourse: '2012/2013',
          subjectAverage: this.subjectAverageByAcademicCourse20122013,
        }, {
          academicCourse: '2013/2014',
          subjectAverage: this.subjectAverageByAcademicCourse20132014,
        },
      ];
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
