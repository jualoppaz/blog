<template>
  <div id="academic-courses">
    <h1 id="academic-courses-title">
      {{ academicCoursesTitle }}
    </h1>
    <el-divider />
    <AcademicCourseTable
      academic-course="2010/2011"
      :data="subjectMarksBy20102011Course"
      :span-config="spanConfig20102011Course"
    />
    <AcademicCourseTable
      academic-course="2011/2012"
      :data="subjectMarksBy20112012Course"
      :span-config="spanConfig20112012Course"
    />
    <AcademicCourseTable
      academic-course="2012/2013"
      :data="subjectMarksBy20122013Course"
      :span-config="spanConfig20122013Course"
    />
    <AcademicCourseTable
      academic-course="2013/2014"
      :data="subjectMarksBy20132014Course"
      :span-config="spanConfig20132014Course"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import AcademicCourseTable from '@/components/academic-record/AcademicCourseTable.vue';

export default {
  name: 'AcademicCourses',
  components: {
    AcademicCourseTable,
  },
  async fetch() {
    return Promise.all([
      this.$store.dispatch('academic-records/getSubjectMarksBy20102011CourseAndFirstQuarter'),
      this.$store.dispatch('academic-records/getSubjectMarksBy20102011CourseAndSecondQuarter'),
      this.$store.dispatch('academic-records/getSubjectMarksBy20102011CourseAndNoQuarter'),
      this.$store.dispatch('academic-records/getSubjectMarksBy20112012CourseAndFirstQuarter'),
      this.$store.dispatch('academic-records/getSubjectMarksBy20112012CourseAndSecondQuarter'),
      this.$store.dispatch('academic-records/getSubjectMarksBy20112012CourseAndNoQuarter'),
      this.$store.dispatch('academic-records/getSubjectMarksBy20122013CourseAndFirstQuarter'),
      this.$store.dispatch('academic-records/getSubjectMarksBy20122013CourseAndSecondQuarter'),
      this.$store.dispatch('academic-records/getSubjectMarksBy20122013CourseAndNoQuarter'),
      this.$store.dispatch('academic-records/getSubjectMarksBy20132014CourseAndFirstQuarter'),
      this.$store.dispatch('academic-records/getSubjectMarksBy20132014CourseAndSecondQuarter'),
      this.$store.dispatch('academic-records/getSubjectMarksBy20132014CourseAndNoQuarter'),
    ]);
  },
  data() {
    return {
      academicCoursesTitle: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.TITLE'),
      firstQuarterLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_TABLE.FIRST_QUARTER.TEXT'),
      secondQuarterLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_TABLE.SECOND_QUARTER.TEXT'),
      noQuarterLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_TABLE.NO_QUARTER.TEXT'),
      colsNumber: 7,
    };
  },
  computed: {
    ...mapState('academic-records', {
      subjectMarksBy20102011CourseAndFirstQuarter: (state) => state.subjectMarksByAcademicCourse['2010/2011'][1],
    }),
    ...mapState('academic-records', {
      subjectMarksBy20102011CourseAndSecondQuarter: (state) => state.subjectMarksByAcademicCourse['2010/2011'][2],
    }),
    ...mapState('academic-records', {
      subjectMarksBy20102011CourseAndNoQuarter: (state) => state.subjectMarksByAcademicCourse['2010/2011'].null,
    }),
    ...mapState('academic-records', {
      subjectMarksBy20112012CourseAndFirstQuarter: (state) => state.subjectMarksByAcademicCourse['2011/2012'][1],
    }),
    ...mapState('academic-records', {
      subjectMarksBy20112012CourseAndSecondQuarter: (state) => state.subjectMarksByAcademicCourse['2011/2012'][2],
    }),
    ...mapState('academic-records', {
      subjectMarksBy20112012CourseAndNoQuarter: (state) => state.subjectMarksByAcademicCourse['2011/2012'].null,
    }),
    ...mapState('academic-records', {
      subjectMarksBy20122013CourseAndFirstQuarter: (state) => state.subjectMarksByAcademicCourse['2012/2013'][1],
    }),
    ...mapState('academic-records', {
      subjectMarksBy20122013CourseAndSecondQuarter: (state) => state.subjectMarksByAcademicCourse['2012/2013'][2],
    }),
    ...mapState('academic-records', {
      subjectMarksBy20122013CourseAndNoQuarter: (state) => state.subjectMarksByAcademicCourse['2012/2013'].null,
    }),
    ...mapState('academic-records', {
      subjectMarksBy20132014CourseAndFirstQuarter: (state) => state.subjectMarksByAcademicCourse['2013/2014'][1],
    }),
    ...mapState('academic-records', {
      subjectMarksBy20132014CourseAndSecondQuarter: (state) => state.subjectMarksByAcademicCourse['2013/2014'][2],
    }),
    ...mapState('academic-records', {
      subjectMarksBy20132014CourseAndNoQuarter: (state) => state.subjectMarksByAcademicCourse['2013/2014'].null,
    }),
    subjectMarksBy20102011Course() {
      const items = [
        {
          abreviatura: this.firstQuarterLabel,
        },
        ...this.subjectMarksBy20102011CourseAndFirstQuarter,
        {
          abreviatura: this.secondQuarterLabel,
        },
        ...this.subjectMarksBy20102011CourseAndSecondQuarter,
        {
          abreviatura: this.noQuarterLabel,
        },
        ...this.subjectMarksBy20102011CourseAndNoQuarter,
      ];

      return items;
    },
    subjectMarksBy20112012Course() {
      const items = [
        {
          abreviatura: this.firstQuarterLabel,
        },
        ...this.subjectMarksBy20112012CourseAndFirstQuarter,
        {
          abreviatura: this.secondQuarterLabel,
        },
        ...this.subjectMarksBy20112012CourseAndSecondQuarter,
        {
          abreviatura: this.noQuarterLabel,
        },
        ...this.subjectMarksBy20112012CourseAndNoQuarter,
      ];

      return items;
    },
    subjectMarksBy20122013Course() {
      const items = [
        {
          abreviatura: this.firstQuarterLabel,
        },
        ...this.subjectMarksBy20122013CourseAndFirstQuarter,
        {
          abreviatura: this.secondQuarterLabel,
        },
        ...this.subjectMarksBy20122013CourseAndSecondQuarter,
        {
          abreviatura: this.noQuarterLabel,
        },
        ...this.subjectMarksBy20122013CourseAndNoQuarter,
      ];

      return items;
    },
    subjectMarksBy20132014Course() {
      const items = [
        {
          abreviatura: this.firstQuarterLabel,
        },
        ...this.subjectMarksBy20132014CourseAndFirstQuarter,
        {
          abreviatura: this.secondQuarterLabel,
        },
        ...this.subjectMarksBy20132014CourseAndSecondQuarter,
        {
          abreviatura: this.noQuarterLabel,
        },
        ...this.subjectMarksBy20132014CourseAndNoQuarter,
      ];

      return items;
    },
  },
  methods: {
    spanConfig20102011Course({ rowIndex }) {
      const res = {
        rowspan: 1,
        colspan: 1,
      };

      if (rowIndex % 5 === 0) {
        res.colspan = this.colsNumber;
      }

      return res;
    },
    spanConfig20112012Course({ rowIndex }) {
      const res = {
        rowspan: 1,
        colspan: 1,
      };

      if (rowIndex % 4 === 0) {
        res.colspan = this.colsNumber;
      }

      return res;
    },
    spanConfig20122013Course({ rowIndex }) {
      const res = {
        rowspan: 1,
        colspan: 1,
      };

      if (rowIndex % 4 === 0) {
        res.colspan = this.colsNumber;
      }

      return res;
    },
    spanConfig20132014Course({ rowIndex }) {
      const res = {
        rowspan: 1,
        colspan: 1,
      };

      if (rowIndex % 5 === 0) {
        res.colspan = this.colsNumber;
      }

      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
#academic-courses{
  #academic-courses-title{
    font-size: 36px;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .academic-course-table{
    &:not(:first-child) {
      margin-top: 20px;
    }
  }
}
</style>
