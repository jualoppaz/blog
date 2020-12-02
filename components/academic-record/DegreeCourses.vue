<template>
  <div id="degree-courses">
    <h1 id="degree-courses-title">
      {{ degreeCoursesTitle }}
    </h1>
    <el-divider />
    <DegreeCourseTable
      degree-course="1º"
      :data="subjectMarksBy1Course"
      :span-config="spanConfig1Course"
    />
    <DegreeCourseTable
      degree-course="2º"
      :data="subjectMarksBy2Course"
      :span-config="spanConfig2Course"
    />
    <DegreeCourseTable
      degree-course="3º"
      :data="subjectMarksBy3Course"
      :span-config="spanConfig3Course"
    />
    <DegreeCourseTable
      degree-course="4º"
      :data="subjectMarksBy4Course"
      :span-config="spanConfig4Course"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import DegreeCourseTable from '@/components/academic-record/DegreeCourseTable.vue';

export default {
  name: 'DegreeCourses',
  components: {
    DegreeCourseTable,
  },
  async fetch() {
    return Promise.all([
      this.$store.dispatch('academic-records/getSubjectMarksByDegreeCourseAndQuarter', {
        degreeCourse: '1',
        quarter: 1,
      }),
      this.$store.dispatch('academic-records/getSubjectMarksByDegreeCourseAndQuarter', {
        degreeCourse: '1',
        quarter: 2,
      }),
      this.$store.dispatch('academic-records/getSubjectMarksByDegreeCourseAndQuarter', {
        degreeCourse: '1',
        quarter: null,
      }),
      this.$store.dispatch('academic-records/getSubjectMarksByDegreeCourseAndQuarter', {
        degreeCourse: '2',
        quarter: 1,
      }),
      this.$store.dispatch('academic-records/getSubjectMarksByDegreeCourseAndQuarter', {
        degreeCourse: '2',
        quarter: 2,
      }),
      this.$store.dispatch('academic-records/getSubjectMarksByDegreeCourseAndQuarter', {
        degreeCourse: '2',
        quarter: null,
      }),
      this.$store.dispatch('academic-records/getSubjectMarksByDegreeCourseAndQuarter', {
        degreeCourse: '3',
        quarter: 1,
      }),
      this.$store.dispatch('academic-records/getSubjectMarksByDegreeCourseAndQuarter', {
        degreeCourse: '3',
        quarter: 2,
      }),
      this.$store.dispatch('academic-records/getSubjectMarksByDegreeCourseAndQuarter', {
        degreeCourse: '3',
        quarter: null,
      }),
      this.$store.dispatch('academic-records/getSubjectMarksByDegreeCourseAndQuarter', {
        degreeCourse: '4',
        quarter: 1,
      }),
      this.$store.dispatch('academic-records/getSubjectMarksByDegreeCourseAndQuarter', {
        degreeCourse: '4',
        quarter: 2,
      }),
      this.$store.dispatch('academic-records/getSubjectMarksByDegreeCourseAndQuarter', {
        degreeCourse: '4',
        quarter: null,
      }),
    ]);
  },
  data() {
    return {
      degreeCoursesTitle: this.$t('VIEWS.ACADEMIC_RECORD.DEGREE_COURSES.TITLE'),
      firstQuarterLabel: this.$t('VIEWS.ACADEMIC_RECORD.DEGREE_COURSES.DEGREE_COURSE_TABLE.FIRST_QUARTER.TEXT'),
      secondQuarterLabel: this.$t('VIEWS.ACADEMIC_RECORD.DEGREE_COURSES.DEGREE_COURSE_TABLE.SECOND_QUARTER.TEXT'),
      noQuarterLabel: this.$t('VIEWS.ACADEMIC_RECORD.DEGREE_COURSES.DEGREE_COURSE_TABLE.NO_QUARTER.TEXT'),
      colsNumber: 6,
    };
  },
  computed: {
    ...mapState('academic-records', {
      subjectMarksBy1CourseAndFirstQuarter: (state) => state.subjectMarksByDegreeCourse[1][1],
    }),
    ...mapState('academic-records', {
      subjectMarksBy1CourseAndSecondQuarter: (state) => state.subjectMarksByDegreeCourse[1][2],
    }),
    ...mapState('academic-records', {
      subjectMarksBy1CourseAndNoQuarter: (state) => state.subjectMarksByDegreeCourse[1].null,
    }),
    ...mapState('academic-records', {
      subjectMarksBy2CourseAndFirstQuarter: (state) => state.subjectMarksByDegreeCourse[2][1],
    }),
    ...mapState('academic-records', {
      subjectMarksBy2CourseAndSecondQuarter: (state) => state.subjectMarksByDegreeCourse[2][2],
    }),
    ...mapState('academic-records', {
      subjectMarksBy2CourseAndNoQuarter: (state) => state.subjectMarksByDegreeCourse[2].null,
    }),
    ...mapState('academic-records', {
      subjectMarksBy3CourseAndFirstQuarter: (state) => state.subjectMarksByDegreeCourse[3][1],
    }),
    ...mapState('academic-records', {
      subjectMarksBy3CourseAndSecondQuarter: (state) => state.subjectMarksByDegreeCourse[3][2],
    }),
    ...mapState('academic-records', {
      subjectMarksBy3CourseAndNoQuarter: (state) => state.subjectMarksByDegreeCourse[3].null,
    }),
    ...mapState('academic-records', {
      subjectMarksBy4CourseAndFirstQuarter: (state) => state.subjectMarksByDegreeCourse[4][1],
    }),
    ...mapState('academic-records', {
      subjectMarksBy4CourseAndSecondQuarter: (state) => state.subjectMarksByDegreeCourse[4][2],
    }),
    ...mapState('academic-records', {
      subjectMarksBy4CourseAndNoQuarter: (state) => state.subjectMarksByDegreeCourse[4].null,
    }),
    subjectMarksBy1Course() {
      const items = [
        {
          abreviatura: this.firstQuarterLabel,
        },
        ...this.subjectMarksBy1CourseAndFirstQuarter,
        {
          abreviatura: this.secondQuarterLabel,
        },
        ...this.subjectMarksBy1CourseAndSecondQuarter,
        {
          abreviatura: this.noQuarterLabel,
        },
        ...this.subjectMarksBy1CourseAndNoQuarter,
      ];

      return items;
    },
    subjectMarksBy2Course() {
      const items = [
        {
          abreviatura: this.firstQuarterLabel,
        },
        ...this.subjectMarksBy2CourseAndFirstQuarter,
        {
          abreviatura: this.secondQuarterLabel,
        },
        ...this.subjectMarksBy2CourseAndSecondQuarter,
        {
          abreviatura: this.noQuarterLabel,
        },
        ...this.subjectMarksBy2CourseAndNoQuarter,
      ];

      return items;
    },
    subjectMarksBy3Course() {
      const items = [
        {
          abreviatura: this.firstQuarterLabel,
        },
        ...this.subjectMarksBy3CourseAndFirstQuarter,
        {
          abreviatura: this.secondQuarterLabel,
        },
        ...this.subjectMarksBy3CourseAndSecondQuarter,
        {
          abreviatura: this.noQuarterLabel,
        },
        ...this.subjectMarksBy3CourseAndNoQuarter,
      ];

      return items;
    },
    subjectMarksBy4Course() {
      const items = [
        {
          abreviatura: this.firstQuarterLabel,
        },
        ...this.subjectMarksBy4CourseAndFirstQuarter,
        {
          abreviatura: this.secondQuarterLabel,
        },
        ...this.subjectMarksBy4CourseAndSecondQuarter,
        {
          abreviatura: this.noQuarterLabel,
        },
        ...this.subjectMarksBy4CourseAndNoQuarter,
      ];

      return items;
    },
  },
  methods: {
    spanConfig1Course({ rowIndex }) {
      const res = {
        rowspan: 1,
        colspan: 1,
      };

      if (rowIndex % 5 === 0) {
        res.colspan = this.colsNumber;
      }

      return res;
    },
    spanConfig2Course({ rowIndex }) {
      const res = {
        rowspan: 1,
        colspan: 1,
      };

      if (rowIndex % 4 === 0) {
        res.colspan = this.colsNumber;
      }

      return res;
    },
    spanConfig3Course({ rowIndex }) {
      const res = {
        rowspan: 1,
        colspan: 1,
      };

      if (rowIndex % 4 === 0) {
        res.colspan = this.colsNumber;
      }

      return res;
    },
    spanConfig4Course({ rowIndex }) {
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
#degree-courses{
  #degree-courses-title{
    font-size: 36px;
    margin-top: 50px;
    margin-bottom: 10px;
  }

  .degree-course-table{
    &:not(:first-child) {
      margin-top: 20px;
    }
  }
}
</style>
