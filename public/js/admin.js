/* ===== CONFIG GLOBALES ===== */
const API = '';

const COLORS = ['#3182ce', '#38a169', '#dd6b20', '#e53e3e', '#805ad5', '#319795', '#d69e2e', '#718096'];

/* ===== DOM ELEMENTS ===== */
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const navBtns = document.querySelectorAll('.nav-btn');
const tabs = document.querySelectorAll('.tab-content');
const reporteVariable = document.getElementById('reporteVariable');
const reporteView = document.getElementById('reporteView');
const reportePlaceholder = document.getElementById('reportePlaceholder');

/* ===== AUTH STATE ===== */
let token = localStorage.getItem('suge_token');
let currentPage = 1;
let currentFilter = '';

/* ===== CHART INSTANCES ===== */
let chartInstances = {};

function destroyChart(containerId) {
  if (chartInstances[containerId]) {
    chartInstances[containerId].destroy();
    delete chartInstances[containerId];
  }
}

/* ===== AUTO-LOGIN ===== */
if (token) showDashboard();

/* ===== LOGIN ===== */
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  try {
    const res = await fetch(API + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPass').value,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    token = data.token;
    localStorage.setItem('suge_token', token);
    document.getElementById('userEmail').textContent = data.correo;
    showDashboard();
  } catch (err) {
    loginError.textContent = err.message;
  }
});

/* ===== LOGOUT ===== */
document.getElementById('logoutBtn').addEventListener('click', () => {
  token = null;
  localStorage.removeItem('suge_token');
  dashboardView.classList.add('hidden');
  loginView.classList.remove('hidden');
  loginForm.reset();
});

/* ===== NAV TABS ===== */
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    const tab = btn.dataset.tab;
    if (tab === 'resumen') loadStats();
    if (tab === 'reportes') loadReportes();
    if (tab === 'respuestas') loadRespuestas();
    if (tab === 'promedios') loadPromedios();
  });
});

/* ===== SHOW DASHBOARD ===== */
function showDashboard() {
  loginView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  loadStats();
}

/* ===== API FETCH HELPER ===== */
async function apiFetch(path, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      ...opts.headers,
    },
  });
  if (res.status === 401) {
    token = null;
    localStorage.removeItem('suge_token');
    dashboardView.classList.add('hidden');
    loginView.classList.remove('hidden');
    throw new Error('Sesion expirada');
  }
  return res;
}

/* ===== TOAST ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show';
  setTimeout(() => { toast.className = 'toast'; }, 3500);
}

/* =================================================================
   RESUMEN TAB
   ================================================================= */
async function loadStats() {
  try {
    const res = await apiFetch('/api/admin/reportes');
    const d = await res.json();

    document.getElementById('statTotal').textContent = d.total;
    const pe = {};
    d.por_estamento.forEach(r => { pe[r.estamento] = parseInt(r.cantidad); });
    document.getElementById('statAdmin').textContent = pe.administrativo || 0;
    document.getElementById('statDocente').textContent = pe.docente || 0;
    document.getElementById('statEstudiante').textContent = pe.estudiante || 0;

    renderDonutChart('dashEstamento', d.por_estamento,
      r => r.estamento, r => parseInt(r.cantidad));

    if (d.prom_por_estamento && d.prom_por_estamento.length > 0) {
      const avgGlobal = d.prom_por_estamento.reduce((s, r) => s + parseFloat(r.promedio), 0) / d.prom_por_estamento.length;
      const el = document.getElementById('dashPromGeneral');
      el.innerHTML = '<div class="prom-general-big">' + avgGlobal.toFixed(2) + ' <span style="font-size:1rem;color:#718096">/ 5</span></div>';
    }
  } catch (err) {
    if (err.message !== 'Sesion expirada') console.error(err);
  }
}

/* =================================================================
   REPORTES TAB
   ================================================================= */
reporteVariable.addEventListener('change', loadReportes);

async function loadReportes() {
  const variable = reporteVariable.value;
  if (!variable) {
    reporteView.classList.add('hidden');
    reportePlaceholder.classList.remove('hidden');
    return;
  }

  try {
    const res = await apiFetch('/api/admin/reportes');
    const d = await res.json();

    reporteView.classList.remove('hidden');
    reportePlaceholder.classList.add('hidden');

    destroyChart('reporteChart');

    switch (variable) {
      case 'estamento':
        renderDonutChart('reporteChart', d.por_estamento, r => r.estamento, r => parseInt(r.cantidad));
        document.getElementById('reporteTitle').textContent = 'Distribucion por estamento';
        document.getElementById('reporteTable').innerHTML = buildTable(
          ['Estamento', 'Cantidad', '%'],
          d.por_estamento,
          r => [r.estamento, r.cantidad, ((parseInt(r.cantidad) / d.total) * 100).toFixed(1) + '%']
        );
        break;

      case 'sexo':
        renderDonutChart('reporteChart', d.por_sexo, r => r.sexo, r => parseInt(r.cantidad));
        document.getElementById('reporteTitle').textContent = 'Distribucion por sexo';
        document.getElementById('reporteTable').innerHTML = buildTable(
          ['Sexo', 'Cantidad', '%'],
          d.por_sexo,
          r => [r.sexo, r.cantidad, ((parseInt(r.cantidad) / d.total) * 100).toFixed(1) + '%']
        );
        break;

      case 'edad':
        renderHBarChart('reporteChart', d.por_edad, r => r.rango_edad, r => parseInt(r.cantidad));
        document.getElementById('reporteTitle').textContent = 'Rango de edad';
        document.getElementById('reporteTable').innerHTML = buildTable(
          ['Rango de edad', 'Cantidad', '%'],
          d.por_edad,
          r => [r.rango_edad, r.cantidad, ((parseInt(r.cantidad) / d.total) * 100).toFixed(1) + '%']
        );
        break;

      case 'frecuencia_ia':
        renderHBarChart('reporteChart', d.por_frecuencia_ia, r => r.frecuencia_ia, r => parseInt(r.cantidad));
        document.getElementById('reporteTitle').textContent = 'Frecuencia de uso de IA';
        document.getElementById('reporteTable').innerHTML = buildTable(
          ['Frecuencia', 'Cantidad', '%'],
          d.por_frecuencia_ia,
          r => [r.frecuencia_ia, r.cantidad, ((parseInt(r.cantidad) / d.total) * 100).toFixed(1) + '%']
        );
        break;

      case 'dispositivo':
        renderHBarChart('reporteChart', d.por_dispositivo, r => r.dispositivo_principal, r => parseInt(r.cantidad));
        document.getElementById('reporteTitle').textContent = 'Dispositivo principal';
        document.getElementById('reporteTable').innerHTML = buildTable(
          ['Dispositivo', 'Cantidad', '%'],
          d.por_dispositivo,
          r => [r.dispositivo_principal, r.cantidad, ((parseInt(r.cantidad) / d.total) * 100).toFixed(1) + '%']
        );
        break;

      case 'dependencia':
        renderHBarChart('reporteChart', d.por_dependencia, r => r.dependencia, r => parseInt(r.cantidad));
        document.getElementById('reporteTitle').textContent = 'Dependencia / Facultad';
        document.getElementById('reporteTable').innerHTML = buildTable(
          ['Dependencia', 'Cantidad', '%'],
          d.por_dependencia,
          r => [r.dependencia, r.cantidad, ((parseInt(r.cantidad) / d.total) * 100).toFixed(1) + '%']
        );
        break;

      case 'prom_instrumento':
        renderDonutChart('reporteChart', d.prom_por_instrumento, r => r.instrumento, r => parseFloat(r.promedio));
        document.getElementById('reporteTitle').textContent = 'Promedio por instrumento';
        document.getElementById('reporteTable').innerHTML = buildTable(
          ['Instrumento', 'Promedio', 'Respondieron'],
          d.prom_por_instrumento,
          r => [r.instrumento, parseFloat(r.promedio).toFixed(2), r.respondieron]
        );
        break;

      case 'prom_area':
        renderHBarChart('reporteChart', d.prom_por_area, r => r.area, r => parseFloat(r.promedio));
        document.getElementById('reporteTitle').textContent = 'Promedio por competencia';
        document.getElementById('reporteTable').innerHTML = buildTable(
          ['Area / Competencia', 'Promedio', 'Respondieron'],
          d.prom_por_area,
          r => [r.area, parseFloat(r.promedio).toFixed(2), r.respondieron]
        );
        break;

      case 'prom_estamento':
        renderDonutChart('reporteChart', d.prom_por_estamento, r => r.estamento, r => parseFloat(r.promedio));
        document.getElementById('reporteTitle').textContent = 'Promedio por estamento';
        document.getElementById('reporteTable').innerHTML = buildTable(
          ['Estamento', 'Promedio', 'Personas'],
          d.prom_por_estamento,
          r => [r.estamento, parseFloat(r.promedio).toFixed(2), r.personas]
        );
        break;

      case 'capacitacion':
        renderHBarChart('reporteChart', d.capacitacion_top, r => r.opcion, r => parseInt(r.cantidad));
        document.getElementById('reporteTitle').textContent = 'Necesidades de capacitacion';
        document.getElementById('reporteTable').innerHTML = buildTable(
          ['Capacitacion', 'Veces seleccionada'],
          d.capacitacion_top,
          r => [r.opcion, r.cantidad]
        );
        break;
    }
  } catch (err) {
    if (err.message !== 'Sesion expirada') console.error(err);
  }
}

/* =================================================================
   CHART.JS FUNCTIONS
   ================================================================= */
function renderDonutChart(containerId, data, labelFn, valueFn) {
  destroyChart(containerId);
  const el = document.getElementById(containerId);
  el.innerHTML = '';

  const canvas = document.createElement('canvas');
  canvas.style.maxHeight = '280px';
  el.appendChild(canvas);

  chartInstances[containerId] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: data.map(r => labelFn(r)),
      datasets: [{
        data: data.map(r => valueFn(r)),
        backgroundColor: COLORS.slice(0, data.length),
        borderWidth: 2,
        borderColor: '#fff',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.raw / total) * 100).toFixed(1);
              return ctx.label + ': ' + ctx.raw + ' (' + pct + '%)';
            }
          }
        }
      },
      cutout: '55%',
    },
  });
}

function renderHBarChart(containerId, data, labelFn, valueFn) {
  destroyChart(containerId);
  const el = document.getElementById(containerId);
  el.innerHTML = '';

  const canvas = document.createElement('canvas');
  canvas.style.maxHeight = '320px';
  el.appendChild(canvas);

  const sorted = data.slice().sort((a, b) => valueFn(b) - valueFn(a));

  chartInstances[containerId] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: sorted.map(r => labelFn(r)),
      datasets: [{
        data: sorted.map(r => valueFn(r)),
        backgroundColor: COLORS.slice(0, sorted.length),
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        x: { beginAtZero: true, grid: { color: '#f0f0f0' } },
        y: {
          ticks: {
            font: { size: 11 },
            callback: function(val) {
              const lbl = this.getLabelForValue(val);
              return lbl.length > 30 ? lbl.substring(0, 28) + '...' : lbl;
            }
          },
          grid: { display: false },
        },
      },
    },
  });
}

/* =================================================================
   TABLE BUILDER
   ================================================================= */
function buildTable(headers, data, rowFn) {
  if (!data || data.length === 0) return '<p class="empty-state">Sin datos</p>';
  let html = '<table class="detail-tbl"><thead><tr>';
  headers.forEach(h => { html += '<th>' + h + '</th>'; });
  html += '</tr></thead><tbody>';
  data.forEach(row => {
    const cells = rowFn(row);
    html += '<tr>';
    cells.forEach((cell, i) => {
      const numVal = parseFloat(cell);
      let cls = '';
      if (i > 0 && !isNaN(numVal)) {
        if (numVal >= 4) cls = ' class="val-high"';
        else if (numVal >= 3) cls = ' class="val-mid"';
        else cls = ' class="val-low"';
      }
      html += '<td' + cls + '>' + cell + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

/* =================================================================
   RESPUESTAS TAB
   ================================================================= */
document.getElementById('filterEstamento').addEventListener('change', (e) => {
  currentFilter = e.target.value;
  currentPage = 1;
  loadRespuestas();
});

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) { currentPage--; loadRespuestas(); }
});

document.getElementById('nextPage').addEventListener('click', () => {
  currentPage++;
  loadRespuestas();
});

async function loadRespuestas() {
  try {
    let url = '/api/admin/respuestas?page=' + currentPage + '&limit=20';
    if (currentFilter) url += '&estamento=' + currentFilter;
    const res = await apiFetch(url);
    const d = await res.json();

    document.getElementById('respCount').textContent = d.total + ' respuestas';
    const tbody = document.getElementById('respBody');
    tbody.innerHTML = '';

    d.data.forEach(r => {
      const tr = document.createElement('tr');
      const fecha = r.enviado_en ? new Date(r.enviado_en).toLocaleDateString('es-PE') : '-';
      tr.innerHTML =
        '<td>' + r.id + '</td>' +
        '<td>' + r.estamento + '</td>' +
        '<td>' + (r.sexo || '-') + '</td>' +
        '<td>' + (r.rango_edad || '-') + '</td>' +
        '<td>' + (r.dependencia || '-') + '</td>' +
        '<td>' + fecha + '</td>' +
        '<td><button class="btn-view" data-id="' + r.id + '">Ver</button> <button class="btn-delete" data-id="' + r.id + '">Eliminar</button></td>';
      tbody.appendChild(tr);
    });

    const totalPages = Math.ceil(d.total / 20);
    document.getElementById('pageInfo').textContent = 'Pagina ' + d.page + ' de ' + (totalPages || 1);
    document.getElementById('prevPage').disabled = d.page <= 1;
    document.getElementById('nextPage').disabled = d.page >= totalPages;

    tbody.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => viewRespuesta(btn.dataset.id));
    });
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteRespuesta(btn.dataset.id));
    });
  } catch (err) {
    if (err.message !== 'Sesion expirada') console.error(err);
  }
}

async function viewRespuesta(id) {
  try {
    const res = await apiFetch('/api/admin/respuestas/' + id);
    const d = await res.json();
    const m = d.meta;

    document.getElementById('modalId').textContent = id;
    let html = '';

    html += '<div class="detail-section"><h4>Datos generales</h4><div class="detail-grid">';
    const fields = [
      ['Estamento', m.estamento], ['Sexo', m.sexo], ['Edad', m.rango_edad],
      ['Dependencia', m.dependencia], ['Frecuencia IA', m.frecuencia_ia],
      ['Dispositivo', m.dispositivo_principal],
    ];
    fields.forEach(([label, val]) => {
      html += '<div class="label">' + label + '</div><div class="value">' + (val || '-') + '</div>';
    });
    html += '</div></div>';

    if (d.items && d.items.length > 0) {
      const grouped = {};
      d.items.forEach(item => {
        if (!grouped[item.area]) grouped[item.area] = [];
        grouped[item.area].push(item);
      });

      for (const [area, items] of Object.entries(grouped)) {
        html += '<div class="detail-section"><h4>' + area + '</h4>';
        items.forEach(item => {
          html += '<div class="item-row"><span><span class="item-codigo">' + item.codigo + '</span> ' + item.texto_item + '</span><span class="item-valor">' + item.valor + '</span></div>';
        });
        html += '</div>';
      }
    }

    if (d.t5 && d.t5.length > 0) {
      html += '<div class="detail-section"><h4>Capacitacion / T5</h4><div class="t5-tags">';
      d.t5.forEach(t => { html += '<span class="t5-tag">' + t + '</span>'; });
      html += '</div></div>';
    }

    if (m.comentarios) {
      html += '<div class="detail-section"><h4>Comentarios</h4><p>' + m.comentarios + '</p></div>';
    }

    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalOverlay').classList.remove('hidden');
  } catch (err) {
    if (err.message !== 'Sesion expirada') showToast('Error: ' + err.message);
  }
}

async function deleteRespuesta(id) {
  if (!confirm('Eliminar respuesta #' + id + '?')) return;
  try {
    await apiFetch('/api/admin/respuestas/' + id, { method: 'DELETE' });
    showToast('Respuesta eliminada');
    loadRespuestas();
  } catch (err) {
    if (err.message !== 'Sesion expirada') showToast('Error: ' + err.message);
  }
}

document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.add('hidden');
});

document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    document.getElementById('modalOverlay').classList.add('hidden');
  }
});

/* =================================================================
   PROMEDIOS TAB
   ================================================================= */
document.getElementById('filterInstrumento').addEventListener('change', loadPromedios);

async function loadPromedios() {
  try {
    const res = await apiFetch('/api/admin/promedios');
    const data = await res.json();
    const filtro = document.getElementById('filterInstrumento').value;
    const filtered = filtro ? data.filter(r => r.instrumento === filtro) : data;

    const tbody = document.getElementById('promBody');
    tbody.innerHTML = '';
    filtered.forEach(r => {
      const tr = document.createElement('tr');
      const prom = parseFloat(r.promedio);
      let cls = '';
      if (prom >= 4) cls = 'val-high';
      else if (prom >= 3) cls = 'val-mid';
      else cls = 'val-low';
      tr.innerHTML =
        '<td>' + r.codigo + '</td>' +
        '<td>' + r.area + '</td>' +
        '<td>' + (r.texto_item || '-') + '</td>' +
        '<td class="' + cls + '">' + prom.toFixed(2) + '</td>' +
        '<td>' + r.respondieron + '</td>';
      tbody.appendChild(tr);
    });
  } catch (err) {
    if (err.message !== 'Sesion expirada') console.error(err);
  }
}

/* =================================================================
   EXCEL DOWNLOAD
   ================================================================= */
document.getElementById('btnDownloadExcel').addEventListener('click', async () => {
  try {
    if (!token) { showToast('Sesion expirada'); return; }
    const res = await fetch(API + '/api/admin/reportes/excel', {
      headers: { 'Authorization': 'Bearer ' + token },
    });
    if (!res.ok) {
      if (res.status === 401) {
        token = null;
        localStorage.removeItem('suge_token');
        dashboardView.classList.add('hidden');
        loginView.classList.remove('hidden');
        showToast('Sesion expirada');
        return;
      }
      throw new Error('Error al descargar');
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SUGE_Reporte_' + new Date().toISOString().slice(0, 10) + '.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showToast('Reporte descargado');
  } catch (err) {
    showToast(err.message);
  }
});
