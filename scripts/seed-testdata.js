const API = 'http://localhost:3000/api/respuestas';

const DEPENDENCIAS = [
  'Facultad de Ingeniería',
  'Facultad de Medicina',
  'Facultad de Ciencias',
  'Facultad de Educación',
  'Facultad de Derecho',
  'Facultad de Ciencias Económicas',
  'Facultad de Ciencias Sociales',
  'Facultad de Enfermería',
  'Facultad de Farmacia',
  'Facultad de Odontología',
  'Facultad de Humana',
  'Facultad de Turismo',
  'Facultad de Arquitectura',
  'Oficina de Tecnologías de la Información',
  'Oficina de Planeamiento',
];

const CAPACITACION_OPCIONES = [
  'Ofimática (Word, Excel, PowerPoint)',
  'Herramientas de trabajo colaborativo (Google Workspace, Microsoft Teams, Drive/OneDrive, pizarras virtuales)',
  'Seguridad digital y ciberseguridad (protección de datos, contraseñas, phishing)',
  'Gobierno digital y servicios del Estado (plataformas institucionales, trámites virtuales)',
  'Sistemas de Gestión Documental (SGD/MGD) y trámite documentario',
  'Aulas virtuales y plataformas educativas (Moodle, Blackboard, etc.)',
  'Creación de contenidos y recursos digitales (videos educativos, infografías, Canva, diseño gráfico)',
  'Inteligencia Artificial generativa (ChatGPT, Gemini, Copilot - prompting y uso aplicado)',
  'Herramientas para la automatización de tareas (Power Automate, Macros, gestores de bases de datos)',
  'Análisis y visualización de datos (Power BI, Tableau)',
  'Búsqueda y evaluación de información (búsqueda avanzada en Google, uso de fuentes académicas)',
  'Ética, privacidad y uso responsable de la IA',
  'Otros',
];

// Item codes per instrument
const ITEMS_A = [
  'A1.1','A1.2','A1.3',
  'A2.1','A2.2','A2.3','A2.4','A2.5','A2.6',
  'A3.1','A3.2','A3.3','A3.4',
  'A4.1','A4.2','A4.3','A4.4',
  'A5.1','A5.2','A5.3','A5.4',
  'A6.1','A6.2','A6.3',
];
const ITEMS_B = [
  'B1.1','B1.2','B1.3','B1.4',
  'B2.1','B2.2','B2.3',
  'B3.1','B3.2','B3.3','B3.4',
  'B4.1','B4.2','B4.3',
  'B5.1','B5.2','B5.3',
  'B6.1','B6.2','B6.3','B6.4','B6.5',
];
const ITEMS_C = [
  'C1.1','C1.2','C1.3',
  'C2.1','C2.2','C2.3','C2.4','C2.5','C2.6',
  'C3.1','C3.2','C3.3','C3.4',
  'C4.1','C4.2','C4.3','C4.4',
  'C5.1','C5.2','C5.3','C5.4',
];
const ITEMS_T_ALL = [
  'T1.1','T1.2','T1.3','T1.4','T1.5','T1.6','T1.7',
  'T2.1','T2.2','T2.3','T2.4','T2.5','T2.6',
  'T3.1','T3.2','T3.3','T3.4','T3.5','T3.6','T3.7','T3.8',
  'T4.1','T4.2','T4.3','T4.4','T4.5','T4.6','T4.7','T4.8',
  'T5.1','T5.2','T5.3','T5.4','T5.5','T5.6',
];
const ITEMS_T_STUDENT = [
  'T1.1','T1.2','T1.3','T1.4','T1.5','T1.6','T1.7',
  'T2.1','T2.2','T2.3','T2.4','T2.5','T2.6',
  'T3.1','T3.2','T3.3','T3.4','T3.5','T3.6','T3.7','T3.8',
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function randomLikertValue() {
  // Weighted distribution: more 2-4, fewer 1 and 5
  const weights = [1, 3, 5, 5, 2];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i + 1;
  }
  return 3;
}

function generateItems(codes) {
  return codes.map(c => ({ codigo: c, valor: randomLikertValue() }));
}

function generateT5(count) {
  const shuffled = [...CAPACITACION_OPCIONES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, randInt(1, Math.min(count, 5)));
}

function randomDate() {
  const start = new Date('2026-07-01');
  const end = new Date('2026-08-17');
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString();
}

function generateResponse(estamento) {
  const Sexo = ['Masculino', 'Femenino'];
  const Edades = ['18-25', '26-35', '36-45', '46-55', '56+'];
  const FrecIA = ['Diariamente', 'Semanalmente', 'A veces', 'Raramente', 'Nunca'];
  const Dispositivos = ['Computadora de escritorio', 'Laptop', 'Celular', 'Tablet'];
  const Condicion = ['Nombrado', 'Contratado', 'CAS', 'Locador'];
  const Anios = ['0-5', '6-10', '11-20', '21-30', '30+'];
  const Nivel = ['Pregrado', 'Posgrado'];
  const Ciclo = ['1er ciclo', '2do ciclo', '3er ciclo', '4to ciclo', '5to ciclo', '6to ciclo', '7mo ciclo', '8vo ciclo', '9no ciclo', '10mo ciclo'];
  const Conectividad = ['Wi-Fi institucional', 'Datos móviles', 'Ambos', 'Casa particular'];

  const data = {
    estamento,
    Sexo: pick(Sexo),
    rango_edad: pick(Edades),
    dependencia: pick(DEPENDENCIAS),
    frecuencia_ia: pick(FrecIA),
    dispositivo_principal: pick(Dispositivos),
  };

  if (estamento === 'administrativo' || estamento === 'docente') {
    data.condicion_laboral = pick(Condicion);
    data.anios_servicio = pick(Anios);
    data.capacitacion_recibida = pick(['Sí', 'No']);
  }

  if (estamento === 'estudiante') {
    data.nivel_estudiante = pick(Nivel);
    data.anio_ciclo = pick(Ciclo);
    data.modalidad_conectividad = pick(Conectividad);
  }

  // Items
  if (estamento === 'administrativo') {
    data.items = [...generateItems(ITEMS_A), ...generateItems(ITEMS_T_ALL)];
  } else if (estamento === 'docente') {
    data.items = [...generateItems(ITEMS_B), ...generateItems(ITEMS_T_ALL)];
  } else {
    data.items = [...generateItems(ITEMS_C), ...generateItems(ITEMS_T_STUDENT)];
  }

  // T5 capacitación
  data.t5 = generateT5(3);

  // Random date
  data.enviado_en = randomDate();

  return data;
}

async function sendResponse(data) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    console.error(`Error: ${result.error}`, result.details || '');
    return false;
  }
  return true;
}

async function main() {
  console.log('Iniciando generación de datos de prueba...\n');

  const estamentos = [
    ...Array(15).fill('administrativo'),
    ...Array(18).fill('docente'),
    ...Array(17).fill('estudiante'),
  ].sort(() => Math.random() - 0.5);

  let ok = 0, fail = 0;

  for (let i = 0; i < estamentos.length; i++) {
    const est = estamentos[i];
    const data = generateResponse(est);
    const success = await sendResponse(data);
    if (success) {
      ok++;
      console.log(`[${i + 1}/${estamentos.length}] ✓ ${est}`);
    } else {
      fail++;
      console.log(`[${i + 1}/${estamentos.length}] ✗ ${est} - ERROR`);
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n--- Finalizado ---`);
  console.log(`Exitosas: ${ok}`);
  console.log(`Fallidas: ${fail}`);
  console.log(`Total: ${estamentos.length}`);
}

main().catch(console.error);
