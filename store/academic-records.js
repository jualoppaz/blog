import Vue from 'vue';

export const state = () => ({
  subjectMarksByAcademicCourse: {
    '2010/2011': {
      1: [],
      2: [],
      null: [],
    },
    '2011/2012': {
      1: [],
      2: [],
      null: [],
    },
    '2012/2013': {
      1: [],
      2: [],
      null: [],
    },
    '2013/2014': {
      1: [],
      2: [],
      null: [],
    },
  },
});

export const actions = {
  getRecords({ commit }) {
    const records = [
      {
        curso: '1',
        cursoAcademico: '2010/2011',
        cuatrimestre: 1,
        abreviatura: 'FFI',
        departamento: 'FA1',
        asignatura: 'Fundamentos Físicos de la Informática',
        nota: 5,
        metodoAprobado: 'Convocatoria',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Troncal/Formación básica',
        numeroConvocatoria: 1,
      },
      {
        curso: '1',
        cursoAcademico: '2010/2011',
        cuatrimestre: null,
        abreviatura: 'FP',
        departamento: 'LSI',
        asignatura: 'Fundamentos de Programación',
        nota: null, // No me presenté en junio
        metodoAprobado: null,
        convocatoriaUtilizada: false,
        creditos: 12,
        tipoCreditos: 'Troncal/Formación básica',
        numeroConvocatoria: 1,
      },
      {
        curso: '1',
        cursoAcademico: '2010/2011',
        cuatrimestre: null,
        abreviatura: 'FP',
        departamento: 'LSI',
        asignatura: 'Fundamentos de Programación',
        nota: 3,
        metodoAprobado: null,
        convocatoriaUtilizada: true,
        creditos: 12,
        tipoCreditos: 'Troncal/Formación básica',
        numeroConvocatoria: 2,
      },
      {
        curso: '1',
        cursoAcademico: '2011/2012',
        cuatrimestre: null,
        abreviatura: 'FP',
        departamento: 'LSI',
        asignatura: 'Fundamentos de Programación',
        nota: 9.6,
        matriculaHonor: true,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 12,
        tipoCreditos: 'Troncal/Formación básica',
        numeroConvocatoria: 3,
      },
      {
        curso: '1',
        cursoAcademico: '2010/2011',
        cuatrimestre: 1,
        abreviatura: 'CED',
        departamento: 'TE',
        asignatura: 'Circuitos Electrónicos Digitales',
        nota: 5.5,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Troncal/Formación básica',
        numeroConvocatoria: 1,
      },
      {
        curso: '1',
        cursoAcademico: '2010/2011',
        cuatrimestre: 1,
        abreviatura: 'CIN',
        departamento: 'MA1',
        asignatura: 'Cálculo Infinitesimal y Numérico',
        nota: 5.9,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Troncal/Formación básica',
        numeroConvocatoria: 1,
      },
      {
        curso: '1',
        cursoAcademico: '2010/2011',
        cuatrimestre: 1,
        abreviatura: 'IMD',
        departamento: 'MA1',
        asignatura: 'Introducción a la Matemática Discreta',
        nota: 6.5,
        metodoAprobado: 'Convocatoria',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Troncal/Formación básica',
        numeroConvocatoria: 1,
      },
      {
        curso: '1',
        cursoAcademico: '2010/2011',
        cuatrimestre: 2,
        abreviatura: 'EC',
        departamento: 'TE',
        asignatura: 'Estructura de Computadores',
        nota: 6.3,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Troncal/Formación básica',
        numeroConvocatoria: 1,
      },
      {
        curso: '1',
        cursoAcademico: '2010/2011',
        cuatrimestre: 2,
        abreviatura: 'E',
        departamento: 'EIO',
        asignatura: 'Estadística',
        nota: 5.5,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Troncal/Formación básica',
        numeroConvocatoria: 1,
      },
      {
        curso: '1',
        cursoAcademico: '2010/2011',
        cuatrimestre: 2,
        abreviatura: 'ALN',
        departamento: 'MA1',
        asignatura: 'Álgebra Lineal y Numérica',
        nota: 5.4,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Troncal/Formación básica',
        numeroConvocatoria: 1,
      },
      {
        curso: '1',
        cursoAcademico: '2010/2011',
        cuatrimestre: 2,
        abreviatura: 'AE',
        departamento: 'OIGE',
        asignatura: 'Administración de Empresas',
        nota: 5.3,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Troncal/Formación básica',
        numeroConvocatoria: 1,
      },
      {
        curso: '2',
        cursoAcademico: '2011/2012',
        cuatrimestre: 1,
        abreviatura: 'LI',
        departamento: 'CCIA',
        asignatura: 'Lógica Informática',
        nota: 8,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '2',
        cursoAcademico: '2011/2012',
        cuatrimestre: 1,
        abreviatura: 'RC',
        departamento: 'TE',
        asignatura: 'Redes de Computadores',
        nota: null,
        metodoAprobado: null,
        convocatoriaUtilizada: false,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '2',
        cursoAcademico: '2011/2012',
        cuatrimestre: 1,
        abreviatura: 'RC',
        departamento: 'TE',
        asignatura: 'Redes de Computadores',
        nota: 5.3,
        metodoAprobado: 'Convocatoria',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 2,
      },
      {
        curso: '2',
        cursoAcademico: '2011/2012',
        cuatrimestre: 1,
        abreviatura: 'SO',
        departamento: 'LSI',
        asignatura: 'Sistemas Operativos',
        nota: 7,
        metodoAprobado: 'Convocatoria',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '2',
        cursoAcademico: '2011/2012',
        cuatrimestre: 2,
        abreviatura: 'AC',
        departamento: 'ATC',
        asignatura: 'Arquitectura de Computadores',
        nota: null,
        metodoAprobado: null,
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '2',
        cursoAcademico: '2011/2012',
        cuatrimestre: 2,
        abreviatura: 'AC',
        departamento: 'ATC',
        asignatura: 'Arquitectura de Computadores',
        nota: 5.5,
        metodoAprobado: 'Convocatoria',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 2,
      },
      {
        curso: '2',
        cursoAcademico: '2011/2012',
        cuatrimestre: 2,
        abreviatura: 'AISS',
        departamento: 'LSI',
        asignatura:
              'Arquitectura e Integración de Sistemas Software',
        nota: 7.1,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '2',
        cursoAcademico: '2011/2012',
        cuatrimestre: 2,
        abreviatura: 'MD',
        departamento: 'MA1',
        asignatura: 'Matemática Discreta',
        nota: 7.7,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '2',
        cursoAcademico: '2011/2012',
        cuatrimestre: null,
        abreviatura: 'ADDA',
        departamento: 'LSI',
        asignatura: 'Análisis y Diseño de Datos y Algoritmos',
        nota: 6.4,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 12,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '2',
        cursoAcademico: '2011/2012',
        cuatrimestre: null,
        abreviatura: 'IISSI',
        departamento: 'LSI',
        asignatura:
              'Inroducción a la Ingeniería del Software y Sistemas de la Información',
        nota: 5.5,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 12,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '3',
        cursoAcademico: '2012/2013',
        cuatrimestre: 1,
        abreviatura: 'IR',
        departamento: 'LSI',
        asignatura: 'Ingeniería de Requisitos',
        nota: 7,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '3',
        cursoAcademico: '2012/2013',
        cuatrimestre: 1,
        abreviatura: 'MSN',
        departamento: 'MA1',
        asignatura: 'Modelado y Simulación Numérica',
        nota: 7.5,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '3',
        cursoAcademico: '2012/2013',
        cuatrimestre: 1,
        abreviatura: 'PSM',
        departamento: 'TE',
        asignatura: 'Procesamiento de Señales Multimedia',
        nota: null,
        metodoAprobado: null,
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '3',
        cursoAcademico: '2012/2013',
        cuatrimestre: 1,
        abreviatura: 'PSM',
        departamento: 'TE',
        asignatura: 'Procesamiento de Señales Multimedia',
        nota: 6.2,
        metodoAprobado: 'Convocatoria',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 2,
      },
      {
        curso: '3',
        cursoAcademico: '2012/2013',
        cuatrimestre: 2,
        abreviatura: 'ASR',
        departamento: 'TE',
        asignatura: 'Arquitectura y Servicios de Redes',
        nota: null,
        metodoAprobado: null,
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '3',
        cursoAcademico: '2012/2013',
        cuatrimestre: 2,
        abreviatura: 'ASR',
        departamento: 'TE',
        asignatura: 'Arquitectura y Servicios de Redes',
        nota: 5.2,
        metodoAprobado: 'Convocatoria',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 2,
      },
      {
        curso: '3',
        cursoAcademico: '2012/2013',
        cuatrimestre: 2,
        abreviatura: 'IA',
        departamento: 'CCIA',
        asignatura: 'Inteligencia Artificial',
        nota: null,
        metodoAprobado: null,
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '3',
        cursoAcademico: '2012/2013',
        cuatrimestre: 2,
        abreviatura: 'IA',
        departamento: 'CCIA',
        asignatura: 'Inteligencia Artificial',
        nota: 5.9,
        metodoAprobado: 'Convocatoria',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 2,
      },
      {
        curso: '3',
        cursoAcademico: '2012/2013',
        cuatrimestre: 2,
        abreviatura: 'MVG',
        departamento: 'MA1',
        asignatura: 'Modelado y Visualización Gráfica',
        nota: 10,
        matriculaHonor: true,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 2,
      },
      {
        curso: '3',
        cursoAcademico: '2012/2013',
        cuatrimestre: null,
        abreviatura: 'DP',
        departamento: 'LSI',
        asignatura: 'Diseño y Pruebas',
        nota: 4,
        metodoAprobado: null,
        convocatoriaUtilizada: true,
        creditos: 12,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '3',
        cursoAcademico: '2012/2013',
        cuatrimestre: null,
        abreviatura: 'DP',
        departamento: 'LSI',
        asignatura: 'Diseño y Pruebas',
        nota: 6,
        metodoAprobado: 'Convocatoria',
        convocatoriaUtilizada: true,
        creditos: 12,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 2,
      },
      {
        curso: '3',
        cursoAcademico: '2012/2013',
        cuatrimestre: null,
        abreviatura: 'PSG',
        departamento: 'LSI',
        asignatura: 'Proceso Software y Gestión',
        nota: 6.5,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 12,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '4',
        cursoAcademico: '2013/2014',
        cuatrimestre: 1,
        abreviatura: 'AII',
        departamento: 'LSI',
        asignatura: 'Acceso Inteligente a la Información',
        nota: 6.5,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '4',
        cursoAcademico: '2013/2014',
        cuatrimestre: 1,
        abreviatura: 'C',
        departamento: 'MA1',
        asignatura: 'Criptografía',
        nota: 7.1,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '4',
        cursoAcademico: '2013/2014',
        cuatrimestre: 1,
        abreviatura: 'EGC',
        departamento: 'LSI',
        asignatura: 'Evolución y Gestión de la Configuración',
        nota: 9.4,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '4',
        cursoAcademico: '2013/2014',
        cuatrimestre: 1,
        abreviatura: 'PGPI',
        departamento: 'LSI',
        asignatura:
              'Planificación y Gestión de Proyectos Informáticos',
        nota: 7,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '4',
        cursoAcademico: '2013/2014',
        cuatrimestre: 2,
        abreviatura: 'CBD',
        departamento: 'LSI',
        asignatura: 'Complementos de Bases de Datos',
        nota: 8.1,
        metodoAprobado: 'Convocatoria',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '4',
        cursoAcademico: '2013/2014',
        cuatrimestre: 2,
        abreviatura: 'ISPP',
        departamento: 'LSI',
        asignatura:
              'Ingeniería del Software y Práctica Profesional',
        nota: 10,
        metodoAprobado: 'Convocatoria',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '4',
        cursoAcademico: '2013/2014',
        cuatrimestre: 2,
        abreviatura: 'PE',
        departamento: '-',
        asignatura: 'Prácticas Externas',
        nota: 'APTO',
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '4',
        cursoAcademico: '2013/2014',
        cuatrimestre: 2,
        abreviatura: 'SSII',
        departamento: 'LSI',
        asignatura:
              'Seguridad en Sistemas Informáticos y en Internet',
        nota: 5.5,
        metodoAprobado: 'Parciales',
        convocatoriaUtilizada: true,
        creditos: 6,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '4',
        cursoAcademico: '2013/2014',
        cuatrimestre: null,
        abreviatura: 'TFG',
        departamento: 'LSI',
        asignatura: 'Trabajo de Fin de Grado',
        nota: null,
        metodoAprobado: null,
        convocatoriaUtilizada: false,
        creditos: 12,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 1,
      },
      {
        curso: '4',
        cursoAcademico: '2013/2014',
        cuatrimestre: null,
        abreviatura: 'TFG',
        departamento: 'LSI',
        asignatura: 'Trabajo de Fin de Grado',
        nota: 7.5,
        metodoAprobado: 'Convocatoria',
        convocatoriaUtilizada: true,
        creditos: 12,
        tipoCreditos: 'Obligatorias',
        numeroConvocatoria: 2,
      },
    ];

    commit('setRecords', records);
  },
  getSubjectMarksByAcademicCourseAndQuarter({ state }, {
    academicCourse,
    quarter,
  }) {
    const aux = state.records.filter(
      (element) => element.cursoAcademico === academicCourse && element.cuatrimestre === quarter,
    );

    aux.sort((a, b) => b.numeroConvocatoria - a.numeroConvocatoria);

    const res = [];

    aux.forEach((item) => {
      const elem = res.find((element) => element.abreviatura === item.abreviatura);
      if (elem) {
        if (item.convocatoriaUtilizada) {
          const resIndex = res.indexOf(elem);
          res[resIndex].convocatoriasUtilizadas += 1;
        }
      } else if (item.convocatoriaUtilizada) {
        const auxItem = { ...item };
        auxItem.convocatoriasUtilizadas = 1;
        res.push(auxItem);
      }
    });

    return res;
  },
  getSubjectMarksBy20102011CourseAndFirstQuarter({ dispatch, commit }) {
    const academicCourse = '2010/2011';
    const quarter = 1;

    return dispatch('getSubjectMarksByAcademicCourseAndQuarter', {
      academicCourse,
      quarter,
    })
      .then((data) => commit('setSubjectMarksByAcademicCourse', {
        academicCourse,
        quarter,
        data,
      }));
  },
  getSubjectMarksBy20102011CourseAndSecondQuarter({ dispatch, commit }) {
    const academicCourse = '2010/2011';
    const quarter = 2;

    return dispatch('getSubjectMarksByAcademicCourseAndQuarter', {
      academicCourse,
      quarter,
    })
      .then((data) => commit('setSubjectMarksByAcademicCourse', {
        academicCourse,
        quarter,
        data,
      }));
  },
  getSubjectMarksBy20102011CourseAndNoQuarter({ dispatch, commit }) {
    const academicCourse = '2010/2011';
    const quarter = null;

    return dispatch('getSubjectMarksByAcademicCourseAndQuarter', {
      academicCourse,
      quarter,
    })
      .then((data) => commit('setSubjectMarksByAcademicCourse', {
        academicCourse,
        quarter,
        data,
      }));
  },
  getSubjectMarksBy20112012CourseAndFirstQuarter({ dispatch, commit }) {
    const academicCourse = '2011/2012';
    const quarter = 1;

    return dispatch('getSubjectMarksByAcademicCourseAndQuarter', {
      academicCourse,
      quarter,
    })
      .then((data) => commit('setSubjectMarksByAcademicCourse', {
        academicCourse,
        quarter,
        data,
      }));
  },
  getSubjectMarksBy20112012CourseAndSecondQuarter({ dispatch, commit }) {
    const academicCourse = '2011/2012';
    const quarter = 2;

    return dispatch('getSubjectMarksByAcademicCourseAndQuarter', {
      academicCourse,
      quarter,
    })
      .then((data) => commit('setSubjectMarksByAcademicCourse', {
        academicCourse,
        quarter,
        data,
      }));
  },
  getSubjectMarksBy20112012CourseAndNoQuarter({ dispatch, commit }) {
    const academicCourse = '2011/2012';
    const quarter = null;

    return dispatch('getSubjectMarksByAcademicCourseAndQuarter', {
      academicCourse,
      quarter,
    })
      .then((data) => commit('setSubjectMarksByAcademicCourse', {
        academicCourse,
        quarter,
        data,
      }));
  },
  getSubjectMarksBy20122013CourseAndFirstQuarter({ dispatch, commit }) {
    const academicCourse = '2012/2013';
    const quarter = 1;

    return dispatch('getSubjectMarksByAcademicCourseAndQuarter', {
      academicCourse,
      quarter,
    })
      .then((data) => commit('setSubjectMarksByAcademicCourse', {
        academicCourse,
        quarter,
        data,
      }));
  },
  getSubjectMarksBy20122013CourseAndSecondQuarter({ dispatch, commit }) {
    const academicCourse = '2012/2013';
    const quarter = 2;

    return dispatch('getSubjectMarksByAcademicCourseAndQuarter', {
      academicCourse,
      quarter,
    })
      .then((data) => commit('setSubjectMarksByAcademicCourse', {
        academicCourse,
        quarter,
        data,
      }));
  },
  getSubjectMarksBy20122013CourseAndNoQuarter({ dispatch, commit }) {
    const academicCourse = '2012/2013';
    const quarter = null;

    return dispatch('getSubjectMarksByAcademicCourseAndQuarter', {
      academicCourse,
      quarter,
    })
      .then((data) => commit('setSubjectMarksByAcademicCourse', {
        academicCourse,
        quarter,
        data,
      }));
  },
  getSubjectMarksBy20132014CourseAndFirstQuarter({ dispatch, commit }) {
    const academicCourse = '2013/2014';
    const quarter = 1;

    return dispatch('getSubjectMarksByAcademicCourseAndQuarter', {
      academicCourse,
      quarter,
    })
      .then((data) => commit('setSubjectMarksByAcademicCourse', {
        academicCourse,
        quarter,
        data,
      }));
  },
  getSubjectMarksBy20132014CourseAndSecondQuarter({ dispatch, commit }) {
    const academicCourse = '2013/2014';
    const quarter = 2;

    return dispatch('getSubjectMarksByAcademicCourseAndQuarter', {
      academicCourse,
      quarter,
    })
      .then((data) => commit('setSubjectMarksByAcademicCourse', {
        academicCourse,
        quarter,
        data,
      }));
  },
  getSubjectMarksBy20132014CourseAndNoQuarter({ dispatch, commit }) {
    const academicCourse = '2013/2014';
    const quarter = null;

    return dispatch('getSubjectMarksByAcademicCourseAndQuarter', {
      academicCourse,
      quarter,
    })
      .then((data) => commit('setSubjectMarksByAcademicCourse', {
        academicCourse,
        quarter,
        data,
      }));
  },
};

export const mutations = {
  setRecords(state, data) {
    Vue.set(state, 'records', data);
  },
  setSubjectMarksByAcademicCourse(state, {
    academicCourse,
    quarter,
    data,
  }) {
    Vue.set(state.subjectMarksByAcademicCourse[academicCourse], quarter, data);
  },
};
