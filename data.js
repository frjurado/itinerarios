/*
 * Datos del plan de estudios de 5º y 6º de Enseñanzas Profesionales de Música en Andalucía.
 *
 * Fuente: Orden de 25 de octubre de 2007 (BOJA nº 225, de 15/11/2007).
 *   - Anexo I:   objetivos y contenidos de cada asignatura (base de los textos de ayuda).
 *   - Anexo II:  modalidades e itinerarios por grupo de especialidades.
 *   - Anexo III: horario semanal por especialidad (fuente de las horas).
 *
 * Categorías (se deducen automáticamente, ver app.js):
 *   - "comun":       asignaturas generales del plan (las de COMUNES).
 *   - "especialidad": resto de asignaturas de la especialidad que no dependen del itinerario.
 *   - "itinerario":  asignaturas de modalidad/itinerario iguales para todas las especialidades.
 *   - "cruzada":     asignaturas de modalidad que dependen también de la especialidad
 *                    (marcadas con `especifica: true`).
 */

// Asignaturas generales del plan (categoría "comun" cuando no dependen del itinerario).
const COMUNES = ['ip', 'hmus', 'hpm', 'opt'];

const ASIGNATURAS = {
  ip: {
    nombre: 'Instrumento principal',
    hint: 'Clase individual del instrumento (o de la voz): técnica, repertorio de distintas épocas y estilos e interpretación en público. Es el eje de la especialidad.',
  },
  hmus: {
    nombre: 'Historia de la música',
    hint: 'Recorrido por la historia de la música occidental, relacionando las obras con su contexto cultural y artístico. Da contenido cultural a lo que se interpreta.',
  },
  hpm: {
    nombre: 'Historia del pensamiento musical',
    hint: 'Continuación de Historia de la música desde la estética: las ideas filosóficas y artísticas de cada época y su relación con la creación musical.',
    continua: 'hmus', // se muestra en la misma fila que Historia de la música
  },
  opt: {
    nombre: 'Optativa',
    hint: 'Asignaturas que oferta cada conservatorio en 6º, de las que se elige una. La oferta cambia de un centro a otro: consulta la del tuyo.',
  },
  camara: {
    nombre: 'Música de cámara',
    hint: 'Práctica en pequeños grupos: escucha mutua, afinación, empaste y conocimiento del repertorio camerístico.',
  },
  orq: {
    nombre: 'Orquesta / Banda',
    hint: 'Práctica colectiva en orquesta o banda con director, y conocimiento del repertorio orquestal.',
  },
  idiomas: {
    nombre: 'Idiomas extranjeros aplicados al canto',
    hint: 'Fonética y pronunciación cantada de italiano, alemán, francés e inglés (los idiomas del repertorio vocal habitual) y comprensión de los textos.',
  },
  pianocomp: {
    nombre: 'Piano complementario',
    hint: 'El piano como herramienta para quien no es pianista: lectura a dos pentagramas, acompañamientos sencillos, armonización e improvisación básica.',
    especifica: true,
  },
  teclacomp: {
    nombre: 'Instrumento de tecla complementario',
    hint: 'Equivalente a Piano complementario con otro instrumento de teclado (clave, órgano…), adaptado a su técnica. Sirve para leer, realizar armonías y acompañar.',
    especifica: true,
  },
  cif: {
    nombre: 'Conjunto instrumental flamenco',
    hint: 'Ocupa en flamenco el lugar de Música de cámara: interpretación en grupo de obras de distintos palos cuidando compás, equilibrio sonoro y remates, incluso con instrumentos ajenos al flamenco.',
  },
  eyf: {
    nombre: 'Estilos y formas musicales',
    hint: 'Cómo se construye la música en cada época: procedimientos compositivos y formas desde el gregoriano hasta hoy. Similar a Análisis musical, pero con una hora de clase semanal.',
  },
  fga: {
    nombre: 'Fundamentos de la guitarra de acompañamiento',
    hint: 'Acercamiento práctico a la guitarra flamenca de acompañamiento para cantaores: el papel técnico y estructural de la guitarra respecto al cante y al baile, sin buscar la especialización instrumental.',
  },
  hflam: {
    nombre: 'Historia del flamenco',
    hint: 'Origen y etapas del flamenco, su contexto histórico y social, la diferencia entre flamenco y folclore, y los artistas más representativos de cada época.',
  },
  acomp: {
    nombre: 'Acompañamiento',
    hint: 'Lectura armónica y a primera vista aplicadas al acompañamiento: reconocer la estructura armónica de una obra y realizar fórmulas de acompañamiento con fluidez en el instrumento.',
    especifica: true,
  },
  repent: {
    nombre: 'Repentización y transporte',
    hint: 'Lectura a primera vista de obras de dificultad creciente, en solitario y en grupo, y técnica del transporte a otras tonalidades. Fundamental para acompañar y para la música de conjunto.',
    especifica: true,
  },
  ped: {
    nombre: 'Pedagogía musical',
    hint: 'Introducción a la enseñanza de la música: desarrollo evolutivo, principios y métodos de educación musical y diseño de unidades didácticas. Pensada para quien se plantea la docencia.',
  },
  lit: {
    nombre: 'Literatura e interpretación del instrumento principal',
    hint: 'Historia y repertorio del propio instrumento: su evolución, las obras más representativas, fuentes y ediciones, y audición crítica de grandes intérpretes.',
  },
  comp: {
    nombre: 'Composición',
    hint: 'Escritura en los estilos barroco, clásico y romántico mediante ejercicios de estilo y obras completas, además de composición libre. Base para estudios superiores de Composición o Dirección.',
  },
  anal: {
    nombre: 'Análisis musical',
    hint: 'Análisis de obras desde el gregoriano hasta la actualidad, con partitura y de oído: elementos, procedimientos y forma a pequeña y gran escala.',
  },
  acus: {
    nombre: 'Acústica y organología',
    hint: 'Física del sonido (ondas, timbre, sistemas de afinación, acústica de salas) y estudio de los instrumentos: clasificación, origen y evolución.',
  },
  inf: {
    nombre: 'Informática musical',
    hint: 'Tecnología aplicada a la música: editores de partituras, secuenciadores, programas multimedia y recursos de internet para crear, estudiar y enseñar.',
  },
  fund: {
    nombre: 'Fundamentos de composición',
    hint: 'Procedimientos compositivos de las épocas barroca, clásica y romántica con ejercicios de estilo y realización instrumental, y espacio para la composición libre. Menos exhaustivo que Composición.',
  },
  etno: {
    nombre: 'Etnomusicología',
    hint: 'Música de tradición oral y de otras culturas: métodos de investigación, recopilación y transcripción, música tradicional española y folclore andaluz.',
  },
  impro: {
    nombre: 'Improvisación y acompañamiento',
    hint: 'Improvisación sobre esquemas armónicos y acompañamiento de melodías, a partir o no de un bajo cifrado (en órgano y clave, el bajo cifrado barroco). Desarrolla reflejos y creatividad.',
    especifica: true,
  },
  improPiano: {
    nombre: 'Improvisación y acompañamiento al piano',
    hint: 'Es la misma asignatura que Improvisación y acompañamiento, pensada para quien no es pianista: se trabaja al piano en lugar de con el instrumento principal, normalmente con menor exigencia. Improvisación sobre esquemas armónicos y acompañamiento de melodías, a partir o no de un bajo cifrado.',
    especifica: true,
    equivale: 'impro', // misma asignatura con otro nombre (para explicar dónde más aparece)
  },
  acante: {
    nombre: 'Acompañamiento del cante',
    hint: 'La guitarra al servicio del cante: cantes a compás y libres, sus esquemas rítmicos y armónicos, las palmas, y la clasificación y audición comparada de los cantes.',
    especifica: true,
  },
  abaile: {
    nombre: 'Acompañamiento del baile',
    hint: 'La guitarra al servicio del baile flamenco: estructura de las coreografías (entrada, llamada, falseta, escobilla, desplante…) y ritmos de cada palo para acompañar al bailaor o la bailaora.',
    especifica: true,
  },
  patorg: {
    nombre: 'Patrimonio organístico andaluz',
    hint: 'Historia y conservación del órgano en Andalucía: escuelas de organería, instrumentos históricos conservados, legislación y papel del organista como custodio del instrumento.',
    especifica: true,
  },
  recursos: {
    nombre: 'Recursos escénicos',
    hint: 'Técnicas de interpretación escénica para el cante: voz hablada, gesto, movimiento, uso del espacio y pequeñas secuencias de pasos sobre la base rítmica de un palo flamenco.',
    especifica: true,
  },
};

const ITINERARIOS = {
  A1: { modalidad: 'A', nombre: 'Composición' },
  A2: { modalidad: 'A', nombre: 'Análisis' },
  B1: { modalidad: 'B', nombre: 'Composición' },
  B2: { modalidad: 'B', nombre: 'Teoría de la música' },
};

/*
 * Constructores de modalidad. Cada entrada es [asignatura, horas] o
 * [[asignatura, asignatura], horas] cuando el alumno elige una de las dos.
 * `extra5` / `extra6`: asignaturas comunes de la modalidad propias de la especialidad.
 */
function modalidadA({ extra5 = [], extra6 = [], a2Opcion = true } = {}) {
  return {
    comun: { 5: [['lit', 1], ...extra5], 6: [['ped', 1], ...extra6] },
    1: { 5: [['comp', 2], ['eyf', 1]], 6: [['comp', 2]] },
    2: { 5: [['anal', 2], a2Opcion ? [['acus', 'inf'], 1] : ['inf', 1]], 6: [['anal', 2]] },
  };
}

function modalidadB({ extra5 = [], extra6 = [], eyf = true } = {}) {
  return {
    comun: {
      5: [...extra5, ['inf', 1], ...(eyf ? [['eyf', 1]] : [])],
      6: [...extra6, ...(eyf ? [['eyf', 1]] : [])],
    },
    1: { 5: [['comp', 2]], 6: [['comp', 2]] },
    2: { 5: [['fund', 1], ['acus', 1]], 6: [['fund', 1], [['ped', 'etno'], 1]] },
  };
}

// Planes por grupo de especialidades (Anexo III).
const PLANES = {
  sinfonicas: {
    nombre: 'Instrumentos sinfónicos',
    base: {
      5: [['ip', 1.5], ['hmus', 1], ['orq', 2], ['camara', 1]],
      6: [['ip', 1.5], ['hpm', 1], ['orq', 2], ['camara', 1], ['opt', 1]],
    },
    A: modalidadA(),
    B: modalidadB({ extra5: [['improPiano', 0.5]], extra6: [['improPiano', 0.5]] }),
  },
  piano: {
    nombre: 'Piano',
    base: {
      5: [['ip', 1.5], ['hmus', 1], ['camara', 1], ['repent', 0.5]],
      6: [['ip', 1.5], ['hpm', 1], ['camara', 1], ['repent', 0.5], ['opt', 1]],
    },
    A: modalidadA({ extra5: [['acomp', 0.5]], extra6: [['acomp', 0.5]] }),
    B: modalidadB({ extra5: [['impro', 0.5]], extra6: [['impro', 0.5]] }),
  },
  guitarra: {
    nombre: 'Guitarra',
    base: {
      5: [['ip', 1.5], ['hmus', 1], ['camara', 1], ['acomp', 0.5]],
      6: [['ip', 1.5], ['hpm', 1], ['camara', 1], ['acomp', 0.5], ['opt', 1]],
    },
    A: modalidadA({ extra5: [['repent', 0.5]], extra6: [['repent', 0.5]] }),
    B: modalidadB({ extra5: [['pianocomp', 0.5]], extra6: [['pianocomp', 0.5]] }),
  },
  canto: {
    nombre: 'Canto',
    base: {
      5: [['ip', 1.5], ['hmus', 1], ['camara', 1], ['pianocomp', 0.5], ['idiomas', 1.5]],
      6: [['ip', 1.5], ['hpm', 1], ['camara', 1], ['pianocomp', 0.5], ['idiomas', 1.5], ['opt', 1]],
    },
    A: modalidadA(),
    B: modalidadB(),
  },
  guitarraFlamenca: {
    nombre: 'Guitarra flamenca',
    base: {
      5: [['ip', 1.5], ['hmus', 1], ['cif', 2]],
      6: [['ip', 1.5], ['hpm', 1], ['cif', 2], ['hflam', 2], ['opt', 1]],
    },
    A: modalidadA({ extra5: [['acante', 0.5]], extra6: [['abaile', 0.5]], a2Opcion: false }),
    B: modalidadB({ extra5: [['pianocomp', 0.5]], extra6: [['pianocomp', 0.5]] }),
  },
  canteFlamenco: {
    nombre: 'Cante flamenco',
    base: {
      5: [['ip', 1.5], ['hmus', 1], ['cif', 2], ['fga', 1], ['eyf', 1]],
      6: [['ip', 1.5], ['eyf', 1], ['cif', 2], ['hflam', 2], ['opt', 1]],
    },
    // Modalidad A sin itinerarios.
    A: { sinItinerarios: true, comun: { 5: [['lit', 1], ['recursos', 1.5]], 6: [['ped', 1]] } },
    B: modalidadB({ eyf: false }),
  },
  organo: {
    nombre: 'Órgano',
    base: {
      5: [['ip', 1.5], ['hmus', 1], ['camara', 1]],
      6: [['ip', 1.5], ['hpm', 1], ['camara', 1], ['opt', 1]],
    },
    A: modalidadA({ extra6: [['patorg', 1]] }),
    B: modalidadB({ extra5: [['impro', 0.5]], extra6: [['impro', 0.5]] }),
  },
  clave: {
    nombre: 'Clave',
    base: {
      5: [['ip', 1.5], ['hmus', 1], ['camara', 1]],
      6: [['ip', 1.5], ['hpm', 1], ['camara', 1], ['opt', 1]],
    },
    A: modalidadA({ extra5: [['repent', 0.5]], extra6: [['repent', 0.5]] }),
    B: modalidadB({ extra5: [['impro', 0.5]], extra6: [['impro', 0.5]] }),
  },
  antiguos: {
    nombre: 'Viola da gamba, flauta de pico y cuerda pulsada del Renacimiento y Barroco',
    base: {
      5: [['ip', 1.5], ['hmus', 1], ['camara', 1]],
      6: [['ip', 1.5], ['hpm', 1], ['camara', 1], ['opt', 1]],
    },
    A: modalidadA({ extra5: [['repent', 0.5]], extra6: [['repent', 0.5]] }),
    B: modalidadB({ extra5: [['teclacomp', 0.5]], extra6: [['teclacomp', 0.5]] }),
  },
};

// Selector de especialidad: de más a menos frecuente.
const ESPECIALIDADES = [
  { grupo: 'Piano y guitarra', items: [['piano', 'Piano', 'piano'], ['guitarra', 'Guitarra', 'guitarra']] },
  {
    grupo: 'Cuerda frotada',
    items: [
      ['violin', 'Violín', 'sinfonicas'],
      ['viola', 'Viola', 'sinfonicas'],
      ['violonchelo', 'Violonchelo', 'sinfonicas'],
      ['contrabajo', 'Contrabajo', 'sinfonicas'],
    ],
  },
  {
    grupo: 'Viento madera',
    items: [
      ['flauta', 'Flauta travesera', 'sinfonicas'],
      ['clarinete', 'Clarinete', 'sinfonicas'],
      ['saxofon', 'Saxofón', 'sinfonicas'],
      ['oboe', 'Oboe', 'sinfonicas'],
      ['fagot', 'Fagot', 'sinfonicas'],
    ],
  },
  {
    grupo: 'Viento metal',
    items: [
      ['trompeta', 'Trompeta', 'sinfonicas'],
      ['trompa', 'Trompa', 'sinfonicas'],
      ['trombon', 'Trombón', 'sinfonicas'],
      ['tuba', 'Tuba', 'sinfonicas'],
    ],
  },
  { grupo: 'Percusión y arpa', items: [['percusion', 'Percusión', 'sinfonicas'], ['arpa', 'Arpa', 'sinfonicas']] },
  { grupo: 'Voz', items: [['canto', 'Canto', 'canto']] },
  {
    grupo: 'Flamenco',
    items: [['guitarra-flamenca', 'Guitarra flamenca', 'guitarraFlamenca'], ['cante-flamenco', 'Cante flamenco', 'canteFlamenco']],
  },
  {
    grupo: 'Otras especialidades',
    items: [
      ['organo', 'Órgano', 'organo'],
      ['clave', 'Clave', 'clave'],
      ['viola-da-gamba', 'Viola da gamba', 'antiguos'],
      ['flauta-de-pico', 'Flauta de pico', 'antiguos'],
      ['cuerda-pulsada', 'Instrumentos de cuerda pulsada del Renacimiento y Barroco', 'antiguos'],
    ],
  },
];
