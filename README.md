# Itinerarios 5º y 6º · EE.PP. de Música (Andalucía)

Página estática que muestra las asignaturas de 5º y 6º de Enseñanzas Profesionales de Música según la especialidad y el itinerario (A1, A2, B1, B2; en Cante flamenco: A, B1, B2).

- `index.html`: estructura de la página.
- `data.js`: **todos los datos** (asignaturas, textos de ayuda, horas y planes por especialidad). Para corregir algo, se edita aquí.
- `app.js`: lógica (selección, tarjetas, comparador, estado en la URL).
- `styles.css`: estilos (claro/oscuro, móvil, impresión).

No necesita compilación: basta abrir `index.html` o publicar la carpeta tal cual (p. ej. en GitHub Pages).

La selección se guarda en la URL, por lo que se puede compartir un enlace directo: `?esp=violin&op=A2&comparar=1`.

## Fuente

Orden de 25 de octubre de 2007, por la que se desarrolla el currículo de las enseñanzas profesionales de música en Andalucía (BOJA nº 225, 15/11/2007):

- Anexo I: base de los textos de ayuda (resumidos, no copiados).
- Anexo II: modalidades e itinerarios.
- Anexo III: horas semanales por especialidad.

Notas:

- El apartado 7 del Anexo II aparece titulado «Especialidades sinfónicas», pero según el Anexo III corresponde a Instrumentos de cuerda pulsada del Renacimiento y Barroco.
- Guitarra flamenca, 6º: el Anexo III da 10,5 h de total, pero la suma de sus asignaturas da 11 h. La página muestra la suma.
