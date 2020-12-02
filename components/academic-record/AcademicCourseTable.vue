<template>
  <div class="academic-course-table">
    <el-table
      :data="data"
      border
      :span-method="spanConfig"
    >
      <el-table-column
        :label="academicCourseLabel"
        align="center"
      >
        <el-table-column
          prop="abreviatura"
          :label="abbreviationLabel"
          align="center"
        />
        <el-table-column
          prop="departamento"
          :label="departmentLabel"
          align="center"
        />
        <el-table-column
          prop="asignatura"
          :label="subjectLabel"
          align="center"
        />
        <el-table-column
          prop="curso"
          :label="courseLabel"
          align="center"
        />
        <el-table-column
          :label="markLabel"
          align="center"
        >
          <template slot-scope="props">
            <el-tag
              v-if="props.row.asignatura && props.row.asignatura.length"
              :type="getMarkType(props.row)"
              effect="dark"
            >
              {{ getMark(props.row.nota) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="passMethodLabel"
          align="center"
        >
          <template slot-scope="props">
            <el-tag
              v-if="props.row.asignatura && props.row.asignatura.length"
              :type="getPassMethodType(props.row.metodoAprobado)"
              effect="dark"
            >
              {{ getPassMethod(props.row.metodoAprobado) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="convocatoriasUtilizadas"
          :label="usedAnnouncementsLabel"
          align="center"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'AcademicCourseTable',
  props: {
    academicCourse: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    spanConfig: {
      type: Function,
      default() {
        return {
          rowSpan: 1,
          colSpan: 1,
        };
      },
    },
  },
  data() {
    return {
      abbreviationLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_TABLE.ABBREVIATION.LABEL'),
      departmentLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_TABLE.DEPARTMENT.LABEL'),
      subjectLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_TABLE.SUBJECT.LABEL'),
      courseLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_TABLE.COURSE.LABEL'),
      markLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_TABLE.MARK.LABEL'),
      passMethodLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_TABLE.PASS_METHOD.LABEL'),
      usedAnnouncementsLabel: this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_TABLE.USED_ANNOUNCEMENTS.LABEL'),
    };
  },
  computed: {
    academicCourseLabel() {
      return `${this.$t('VIEWS.ACADEMIC_RECORD.ACADEMIC_COURSES.ACADEMIC_COURSE_TABLE.HEADER.TEXT')} ${this.academicCourse}`;
    },
  },
  methods: {
    getMarkType(subject) {
      if (subject.matriculaHonor) return 'danger';
      if (subject.nota >= 9) return 'warning';
      if (subject.nota >= 7) return '';
      if (subject.nota >= 5 || subject.nota === 'APTO') return 'success';
      if (subject.nota < 5) return 'fail';
      return 'info';
    },
    getMark(mark) {
      return mark || 'N/A';
    },
    getPassMethodType(passMethod) {
      if (passMethod === 'Convocatoria') return 'warning';
      if (passMethod === 'Parciales') return '';
      return 'info';
    },
    getPassMethod(passMethod) {
      return passMethod || 'N/A';
    },
  },
};
</script>
<style lang="scss" scoped>

.academic-course-table {
  ::v-deep .el-table{
    tr{
      th, td{
        div.cell{
          word-break: normal;
        }
      }
    }
  }
}

</style>
