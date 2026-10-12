(function () {
  'use strict';

  const CATEGORIAS = ['comun', 'especialidad', 'itinerario', 'cruzada'];
  const CAT_ETIQUETA = {
    comun: 'Común',
    especialidad: 'Especialidad',
    itinerario: 'Itinerario',
    cruzada: 'Cruzada',
  };

  const especialidades = {};
  ESPECIALIDADES.forEach((g) =>
    g.items.forEach(([id, nombre, plan]) => (especialidades[id] = { nombre, plan }))
  );

  const state = { esp: 'piano', op: 'A1', comparar: false };

  const $select = document.getElementById('especialidad');
  const $modalidades = document.getElementById('modalidades');
  const $plan = document.getElementById('plan');
  const $compareBtn = document.getElementById('compare-btn');
  const $compare = document.getElementById('compare');

  // ---------- Datos ----------

  function planActual() {
    return PLANES[especialidades[state.esp].plan];
  }

  function opciones(plan) {
    return plan.A.sinItinerarios ? ['A', 'B1', 'B2'] : ['A1', 'A2', 'B1', 'B2'];
  }

  function nombreOpcion(op) {
    return op === 'A' ? 'Modalidad A' : ITINERARIOS[op].nombre;
  }

  function crearEntrada([k, h], origen, op) {
    const claves = Array.isArray(k) ? k : [k];
    let cat;
    if (origen === 'base') cat = COMUNES.includes(claves[0]) ? 'comun' : 'especialidad';
    else cat = claves.some((c) => ASIGNATURAS[c].especifica) ? 'cruzada' : 'itinerario';
    return { id: claves.join('|'), claves, h, cat, origen, op };
  }

  // Asignaturas de un curso para un plan y una opción (A1, A2, B1, B2 o A).
  function asignaturas(plan, op, curso) {
    const mod = plan[op[0]];
    const lista = plan.base[curso].map((e) => crearEntrada(e, 'base', op));
    mod.comun[curso].forEach((e) => lista.push(crearEntrada(e, 'modalidad', op)));
    const it = op[1] && mod[op[1]];
    if (it) it[curso].forEach((e) => lista.push(crearEntrada(e, 'itinerario', op)));
    return lista.sort(porCategoriaYHoras);
  }

  // Por categoría y, dentro de cada una, las de más horas primero (orden estable).
  function porCategoriaYHoras(a, b) {
    return CATEGORIAS.indexOf(a.cat) - CATEGORIAS.indexOf(b.cat) || b.h - a.h;
  }

  // Clave de fila en la vista alineada (p. ej. Hª del pensamiento musical va en la fila de Hª de la música).
  function claveFila(e) {
    return (e.claves.length === 1 && ASIGNATURAS[e.claves[0]].continua) || e.id;
  }

  function total(lista) {
    return lista.reduce((s, e) => s + e.h, 0);
  }

  // Dónde más aparece una asignatura (para explicar las cruzadas).
  function apariciones(clave, planIdActual) {
    const enModalidad = { A: [], B: [] };
    const enBase = [];
    const raiz = (c) => ASIGNATURAS[c].equivale || c;
    Object.entries(PLANES).forEach(([id, plan]) => {
      if (id === planIdActual) return;
      const contiene = (listas) =>
        listas.some((l) => l && l.some(([k]) => (Array.isArray(k) ? k : [k]).some((c) => raiz(c) === raiz(clave))));
      if (contiene([plan.base[5], plan.base[6]])) enBase.push(plan.nombre);
      ['A', 'B'].forEach((m) => {
        if (contiene([plan[m].comun[5], plan[m].comun[6]])) enModalidad[m].push(plan.nombre);
      });
    });
    return { enModalidad, enBase };
  }

  // ---------- Formato ----------

  function horas(h) {
    return String(h).replace('.', ',');
  }

  function nombreEntrada(e) {
    return e.claves.map((c) => ASIGNATURAS[c].nombre).join(' o ');
  }

  function lista(nombres) {
    if (nombres.length < 2) return nombres.join('');
    return nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1];
  }

  function textoOrigen(e) {
    const esp = especialidades[state.esp].nombre;
    const m = e.op[0];
    if (e.cat === 'comun') return 'Asignatura común del plan de estudios.';
    if (e.cat === 'especialidad') return `Propia de ${esp}: se cursa sea cual sea el itinerario.`;
    if (e.cat === 'itinerario') {
      if (e.origen === 'itinerario') return `Del itinerario ${e.op} (${ITINERARIOS[e.op].nombre}).`;
      return planActual().A.sinItinerarios && m === 'A'
        ? 'Propia de la modalidad A.'
        : `Común a la modalidad ${m}: la cursan los dos itinerarios ${m}1 y ${m}2.`;
    }
    // Cruzada
    const ap = apariciones(e.claves[0], especialidades[state.esp].plan);
    let txt = `Cruzada: en ${esp} se cursa solo en la modalidad ${m}.`;
    const otros = ap.enModalidad[m];
    if (otros.length) txt += ` También en la modalidad ${m} de: ${lista(otros)}.`;
    if (ap.enBase.length) txt += ` En ${lista(ap.enBase)} es una asignatura propia de la especialidad.`;
    return txt;
  }

  // ---------- Render: selección ----------

  function renderSelect() {
    $select.innerHTML = ESPECIALIDADES.map(
      (g) =>
        `<optgroup label="${g.grupo}">` +
        g.items.map(([id, nombre]) => `<option value="${id}">${nombre}</option>`).join('') +
        '</optgroup>'
    ).join('');
  }

  function renderModalidades() {
    const ops = opciones(planActual());
    const grupos = { A: ops.filter((o) => o[0] === 'A'), B: ops.filter((o) => o[0] === 'B') };
    $modalidades.innerHTML = ['A', 'B']
      .map(
        (m) => `
      <fieldset class="modalidad">
        <legend>Modalidad ${m}</legend>
        ${grupos[m]
          .map(
            (op) => `
          <label class="op">
            <input type="radio" name="op" value="${op}" ${op === state.op ? 'checked' : ''}>
            <span><b>${op}</b> ${op === 'A' ? 'Sin itinerarios' : ITINERARIOS[op].nombre}</span>
          </label>`
          )
          .join('')}
      </fieldset>`
      )
      .join('');
  }

  // ---------- Render: plan ----------

  function renderCard(e, curso, otraLista) {
    const enOtro = otraLista.some((o) => o.id === e.id);
    let badge = '';
    if (!enOtro) badge = curso === 5 ? '<span class="badge">solo en 5º</span>' : '<span class="badge new">nuevo en 6º</span>';
    const hintId = `hint-${curso}-${e.id.replace('|', '-')}`;
    const eleccion = e.claves.length > 1;
    const cuerpo = eleccion
      ? '<p class="choice-note">Se elige una de las dos:</p>' +
        e.claves.map((c) => `<p><strong>${ASIGNATURAS[c].nombre}.</strong> ${ASIGNATURAS[c].hint}</p>`).join('')
      : `<p>${ASIGNATURAS[e.claves[0]].hint}</p>`;
    return `
      <article class="card cat-${e.cat} c${curso}">
        <button type="button" class="card-head" aria-expanded="false" aria-controls="${hintId}">
          <span class="card-name">${e.claves.map((c) => ASIGNATURAS[c].nombre).join(' <em>o</em> ')}</span>
          <span class="card-hours">${horas(e.h)} h</span>
          <span class="card-tags">
            <span class="chip">${CAT_ETIQUETA[e.cat]}</span>${eleccion ? '<span class="badge">a elegir</span>' : ''}${badge}
          </span>
        </button>
        <div class="card-hint" id="${hintId}" hidden>
          ${cuerpo}
          <p class="origin">${textoOrigen(e)}</p>
        </div>
      </article>`;
  }

  function renderPlan() {
    const plan = planActual();
    const l5 = asignaturas(plan, state.op, 5);
    const l6 = asignaturas(plan, state.op, 6);

    // Filas alineadas: misma asignatura en la misma fila en 5º y 6º.
    const filas = [];
    CATEGORIAS.forEach((cat) => {
      const claves = [];
      [...l5, ...l6].forEach((e) => {
        if (e.cat === cat && !claves.includes(claveFila(e))) claves.push(claveFila(e));
      });
      claves.forEach((k) =>
        filas.push([l5.find((e) => claveFila(e) === k), l6.find((e) => claveFila(e) === k)])
      );
    });

    const titulo = `${especialidades[state.esp].nombre} · ${state.op === 'A' ? 'Modalidad A' : state.op + ' ' + nombreOpcion(state.op)}`;
    const vacio = (curso) => `<div class="card empty c${curso}" aria-hidden="true">—</div>`;

    $plan.innerHTML = `
      <h2 class="plan-title">${titulo}</h2>
      <div class="grid">
        <h3 class="col-head c5">5º curso <span class="total">${horas(total(l5))} h/semana</span></h3>
        <h3 class="col-head c6">6º curso <span class="total">${horas(total(l6))} h/semana</span></h3>
        ${filas
          .map(([a, b]) => (a ? renderCard(a, 5, l6) : vacio(5)) + (b ? renderCard(b, 6, l5) : vacio(6)))
          .join('')}
      </div>`;
  }

  // ---------- Render: comparador ----------

  function renderCompare() {
    const plan = planActual();
    const ops = opciones(plan);
    $compareBtn.textContent = state.comparar
      ? 'Ocultar comparación'
      : ops.length === 4 ? 'Comparar los 4 itinerarios' : 'Comparar las 3 opciones';
    $compareBtn.setAttribute('aria-expanded', String(state.comparar));
    $compare.hidden = !state.comparar;
    if (!state.comparar) return;

    const datos = {};
    const filas = [];
    ops.forEach((op) => {
      datos[op] = {};
      [5, 6].forEach((curso) => {
        asignaturas(plan, op, curso).forEach((e) => {
          datos[op][e.id + '@' + curso] = e.h;
          const fila = filas.find((f) => f.id === e.id);
          if (!fila) filas.push({ ...e });
          else fila.h = Math.max(fila.h, e.h);
        });
      });
    });
    filas.sort(porCategoriaYHoras);

    const celda = (op, id, curso) => {
      const h = datos[op][id + '@' + curso];
      const cls = (op === state.op ? 'current ' : '') + (curso === 5 ? 'c5' : 'c6');
      return h ? `<td class="${cls}">${horas(h)}</td>` : `<td class="${cls} none">·</td>`;
    };
    const totalOp = (op, curso) => horas(total(asignaturas(plan, op, curso)));

    $compare.innerHTML = `
      <h2>${especialidades[state.esp].nombre}: comparación de ${ops.length === 4 ? 'itinerarios' : 'opciones'}</h2>
      <p class="tip">Horas semanales en 5º y 6º. Pulsa una cabecera para ver ese itinerario arriba.</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th rowspan="2" class="subject-col">Asignatura</th>
              ${ops
                .map(
                  (op) => `<th colspan="2" class="${op === state.op ? 'current' : ''}">
                    <button type="button" class="op-btn" data-op="${op}">
                      <b>${op}</b><span>${op === 'A' ? 'Sin itinerarios' : ITINERARIOS[op].nombre}</span>
                    </button></th>`
                )
                .join('')}
            </tr>
            <tr>${ops
              .map((op) => `<th class="c5 ${op === state.op ? 'current' : ''}">5º</th><th class="c6 ${op === state.op ? 'current' : ''}">6º</th>`)
              .join('')}</tr>
          </thead>
          <tbody>
            ${filas
              .map(
                (f) => `<tr>
                  <th scope="row" class="subject-col"><span class="swatch cat-${f.cat}" title="${CAT_ETIQUETA[f.cat]}"></span>${nombreEntrada(f)}</th>
                  ${ops.map((op) => celda(op, f.id, 5) + celda(op, f.id, 6)).join('')}
                </tr>`
              )
              .join('')}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" class="subject-col">Total</th>
              ${ops
                .map(
                  (op) => `<td class="c5 ${op === state.op ? 'current' : ''}">${totalOp(op, 5)}</td><td class="c6 ${op === state.op ? 'current' : ''}">${totalOp(op, 6)}</td>`
                )
                .join('')}
            </tr>
          </tfoot>
        </table>
      </div>`;
  }

  // ---------- Estado / URL ----------

  function normalizarOpcion() {
    const ops = opciones(planActual());
    if (ops.includes(state.op)) return;
    // Al pasar de/a Cante flamenco: A1/A2 <-> A
    state.op = state.op[0] === 'B' ? 'B1' : ops[0];
  }

  function leerURL() {
    const p = new URLSearchParams(location.search);
    if (especialidades[p.get('esp')]) state.esp = p.get('esp');
    if (p.get('op')) state.op = p.get('op').toUpperCase();
    state.comparar = p.get('comparar') === '1';
    normalizarOpcion();
  }

  function escribirURL() {
    const p = new URLSearchParams({ esp: state.esp, op: state.op });
    if (state.comparar) p.set('comparar', '1');
    history.replaceState(null, '', '?' + p.toString());
  }

  function render() {
    $select.value = state.esp;
    renderModalidades();
    renderPlan();
    renderCompare();
    escribirURL();
  }

  // ---------- Eventos ----------

  $select.addEventListener('change', () => {
    state.esp = $select.value;
    normalizarOpcion();
    render();
  });

  $modalidades.addEventListener('change', (ev) => {
    if (ev.target.name !== 'op') return;
    state.op = ev.target.value;
    render();
  });

  $plan.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.card-head');
    if (!btn) return;
    const abierto = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!abierto));
    document.getElementById(btn.getAttribute('aria-controls')).hidden = abierto;
    btn.closest('.card').classList.toggle('open', !abierto);
  });

  $compareBtn.addEventListener('click', () => {
    state.comparar = !state.comparar;
    renderCompare();
    escribirURL();
  });

  $compare.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.op-btn');
    if (!btn) return;
    state.op = btn.dataset.op;
    render();
    $plan.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  renderSelect();
  leerURL();
  render();
})();
