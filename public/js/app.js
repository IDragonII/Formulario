document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('encuestaForm');
  const estamentoSelect = document.getElementById('estamento');

  const adminDocenteFields = document.getElementById('adminDocenteFields');
  const estudianteFields = document.getElementById('estudianteFields');
  const instrumentoSection = document.getElementById('instrumentoSection');
  const transversalesSection = document.getElementById('transversalesSection');
  const t5Section = document.getElementById('t5Section');
  const submitBtn = document.getElementById('submitBtn');

  let t5Count = 0;
  const T5_MAX = 5;

  // --- Fetch catalog from API ---
  let catalogo = [];
  try {
    const res = await fetch(`${API_URL}/api/respuestas/catalogo`);
    if (!res.ok) throw new Error('Error al cargar catálogo');
    catalogo = await res.json();
  } catch (err) {
    showToast('Error al cargar el formulario. Verifique que la API esté activa.');
    console.error(err);
    return;
  }

  // Group items: { A: { 'Información...': [...items] }, B: {...}, C: {...} }
  function agruparPorInstrumento(items) {
    const grouped = {};
    for (const item of items) {
      if (!grouped[item.instrumento]) grouped[item.instrumento] = {};
      if (!grouped[item.instrumento][item.area]) grouped[item.instrumento][item.area] = [];
      grouped[item.instrumento][item.area].push(item);
    }
    return grouped;
  }

  // Group transversal items: { T1: [...items], T2: [...], ... }
  function agruparTransversales(items) {
    const grouped = {};
    for (const item of items) {
      const prefix = item.codigo.split('.')[0];
      if (!grouped[prefix]) grouped[prefix] = [];
      grouped[prefix].push(item);
    }
    return grouped;
  }

  const instrumentos = agruparPorInstrumento(catalogo.filter(i => ['A', 'B', 'C'].includes(i.instrumento)));
  const transversales = agruparTransversales(catalogo.filter(i => i.instrumento === 'T'));

  // --- Estamento change handler ---
  estamentoSelect.addEventListener('change', () => {
    const val = estamentoSelect.value;
    adminDocenteFields.style.display = (val === 'administrativo' || val === 'docente') ? 'block' : 'none';
    estudianteFields.style.display = val === 'estudiante' ? 'block' : 'none';

    if (val) {
      renderInstrumento(val);
      renderTransversales(val);
      instrumentoSection.style.display = 'block';
      transversalesSection.style.display = 'block';
      t5Section.style.display = 'block';
      document.getElementById('comentariosSection').style.display = 'block';
      submitBtn.style.display = 'block';
    } else {
      instrumentoSection.innerHTML = '';
      instrumentoSection.style.display = 'none';
      transversalesSection.innerHTML = '';
      transversalesSection.style.display = 'none';
      t5Section.style.display = 'none';
      document.getElementById('comentariosSection').style.display = 'none';
      submitBtn.style.display = 'none';
    }
  });

  // --- Render instrument (A, B, or C) ---
  function renderInstrumento(estamento) {
    const key = estamento === 'administrativo' ? 'A' : estamento === 'docente' ? 'B' : 'C';
    const inst = INSTRUMENTOS[key];
    const areas = instrumentos[key] || {};

    let html = `<h3>${inst.nombre} <span class="marco">(${inst.marco})</span></h3>`;
    html += '<p class="instruccion-likert">Evalúe su nivel de dominio en una escala del 1 (Muy bajo) al 5 (Muy alto).</p>';

    for (const [area, items] of Object.entries(areas)) {
      html += `<div class="area-bloque">`;
      html += `<h4 class="area-titulo">${area}</h4>`;
      for (const item of items) {
        html += renderLikertItem(item.codigo, item.texto_item);
      }
      html += `</div>`;
    }

    instrumentoSection.innerHTML = html;
  }

  // --- Render transversal blocks ---
  function renderTransversales(estamento) {
    const isAdminOrDocente = estamento === 'administrativo' || estamento === 'docente';
    let html = '';

    for (const config of TRANSVERSALES_CONFIG) {
      if (config.aplica !== 'todos' && !isAdminOrDocente) continue;

      const items = transversales[config.key] || [];
      if (items.length === 0) continue;

      html += `<div class="area-bloque">`;
      html += `<h4 class="area-titulo">${config.nombre}</h4>`;
      for (const item of items) {
        html += renderLikertItem(item.codigo, item.texto_item);
      }
      html += `</div>`;
    }

    transversalesSection.innerHTML = html;
  }

  // --- Render a single Likert item ---
  function renderLikertItem(codigo, texto) {
    let radios = '';
    for (let v = 1; v <= 5; v++) {
      radios += `
        <label class="likert-option">
          <input type="radio" name="item_${codigo}" value="${v}" required>
          <span class="likert-num">${v}</span>
        </label>`;
    }

    return `
      <div class="item-likert" data-codigo="${codigo}">
        <div class="item-texto"><span class="item-codigo">${codigo}</span> ${texto}</div>
        <div class="likert-scale">${radios}</div>
      </div>`;
  }

  // --- Capacitación checkboxes (max 5) ---
  const t5Container = document.getElementById('t5Options');
  if (t5Container) {
    CAPACITACION_OPCIONES.forEach(opcion => {
      const label = document.createElement('label');
      label.className = 't5-option';
      label.innerHTML = `
        <input type="checkbox" name="capacitacion" value="${opcion}" class="t5-checkbox">
        <span>${opcion}</span>`;
      t5Container.appendChild(label);
    });

    t5Container.addEventListener('change', (e) => {
      if (e.target.classList.contains('t5-checkbox')) {
        const checked = t5Container.querySelectorAll('.t5-checkbox:checked');
        t5Count = checked.length;
        if (t5Count > T5_MAX) {
          e.target.checked = false;
          t5Count--;
          showToast(`Máximo ${T5_MAX} opciones`);
        }
        updateT5Count();
      }
    });
  }

  function updateT5Count() {
    const counter = document.getElementById('t5Counter');
    if (counter) {
      counter.textContent = `${t5Count}/${T5_MAX} seleccionados`;
      counter.className = t5Count === T5_MAX ? 't5-counter limit' : 't5-counter';
    }
  }

  // --- Form submission ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const estamento = estamentoSelect.value;
    if (!estamento) {
      showToast('Seleccione su estamento');
      return;
    }

    const data = {
      estamento,
      sexo: getRadio('sexo'),
      rango_edad: getRadio('rango_edad'),
      dependencia: document.getElementById('dependencia')?.value?.trim() || null,
      frecuencia_ia: getRadio('frecuencia_ia'),
      dispositivo_principal: getRadio('dispositivo_principal'),
    };

    if (estamento === 'administrativo' || estamento === 'docente') {
      data.condicion_laboral = getRadio('condicion_laboral');
      data.anios_servicio = getRadio('anios_servicio');
      data.capacitacion_recibida = getRadio('capacitacion_recibida');
    }

    if (estamento === 'estudiante') {
      data.nivel_estudiante = getRadio('nivel_estudiante');
      data.anio_ciclo = getRadio('anio_ciclo');
      data.modalidad_conectividad = getRadio('modalidad_conectividad');
    }

    data.items = [];
    const allItemDivs = document.querySelectorAll('.item-likert');
    let missing = [];
    allItemDivs.forEach(div => {
      const codigo = div.dataset.codigo;
      const checked = div.querySelector('input[type="radio"]:checked');
      if (checked) {
        data.items.push({ codigo, valor: parseInt(checked.value) });
      } else {
        missing.push(codigo);
      }
    });

    if (missing.length > 0) {
      showToast(`Faltan ${missing.length} ítems por responder: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? '...' : ''}`);
      const firstMissing = document.querySelector(`.item-likert[data-codigo="${missing[0]}"]`);
      if (firstMissing) firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const t5Checked = document.querySelectorAll('.t5-checkbox:checked');
    data.t5 = Array.from(t5Checked).map(cb => cb.value);

    const comentarios = document.getElementById('comentarios')?.value?.trim();
    data.comentarios = comentarios || null;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const res = await fetch(`${API_URL}/api/respuestas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error al enviar');

      document.getElementById('encuestaForm').style.display = 'none';
      document.getElementById('successMessage').style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      showToast(`Error: ${err.message}`);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar encuesta';
    }
  });

  function getRadio(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : null;
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast show';
    setTimeout(() => { toast.className = 'toast'; }, 4000);
  }
});
