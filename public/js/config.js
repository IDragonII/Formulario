const API_URL = '';

const INSTRUMENTOS = {
  A: { nombre: 'Instrumento para Personal Administrativo', marco: 'DigComp 2.2' },
  B: { nombre: 'Instrumento para Docentes', marco: 'DigCompEdu' },
  C: { nombre: 'Instrumento para Estudiantes', marco: 'DigComp 2.2' },
};

const TRANSVERSALES_CONFIG = [
  { key: 'T1', nombre: 'Habilidades y competencias digitales básicas', aplica: 'todos' },
  { key: 'T2', nombre: 'Tecnologías emergentes y transformación digital', aplica: 'todos' },
  { key: 'T3', nombre: 'Inteligencia Artificial Generativa', aplica: 'todos' },
  { key: 'T4', nombre: 'Competencias SGD/MGD', aplica: 'admin,docente' },
  { key: 'T5', nombre: 'Gestión de riesgos y ética en entornos digitales', aplica: 'admin,docente' },
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
