-- ============================================
-- Catálogo de ítems — Encuesta SUGE v0.2
-- 96 ítems Likert (1-5) + 13 opciones T5
-- Fuente: PDF exacto de la encuesta
-- ============================================

-- INSTRUMENTO A — Administrativo (DigComp 2.2, 21 ítems)

-- Área 1. Información y alfabetización informacional
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('A1.1', 'A', 'Información y alfabetización informacional', 'Busco, navego y filtro datos, información y contenidos en entornos digitales.', NULL),
('A1.2', 'A', 'Información y alfabetización informacional', 'Evalúo la fiabilidad y pertinencia de la información y de sus fuentes.', NULL),
('A1.3', 'A', 'Información y alfabetización informacional', 'Almaceno, organizo y recupero datos, archivos y contenidos digitales.', NULL);

-- Área 2. Comunicación y colaboración
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('A2.1', 'A', 'Comunicación y colaboración', 'Me comunico mediante herramientas digitales (correo, mensajería, videollamadas).', NULL),
('A2.2', 'A', 'Comunicación y colaboración', 'Comparto información y archivos por medios digitales de forma adecuada.', NULL),
('A2.3', 'A', 'Comunicación y colaboración', 'Uso servicios de gobierno y trámites digitales (Mesa de Partes Virtual, plataformas del Estado).', NULL),
('A2.4', 'A', 'Comunicación y colaboración', 'Colaboro y trabajo en documentos compartidos en línea (Drive/OneDrive).', NULL),
('A2.5', 'A', 'Comunicación y colaboración', 'Aplico normas de comportamiento (netiqueta) en entornos digitales.', NULL),
('A2.6', 'A', 'Comunicación y colaboración', 'Gestiono mi identidad y reputación digital institucional.', NULL);

-- Área 3. Creación de contenidos digitales
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('A3.1', 'A', 'Creación de contenidos digitales', 'Elaboro documentos, hojas de cálculo y presentaciones (ofimática).', NULL),
('A3.2', 'A', 'Creación de contenidos digitales', 'Integro y reelaboro contenidos digitales existentes en nuevos productos.', NULL),
('A3.3', 'A', 'Creación de contenidos digitales', 'Reconozco y respeto derechos de autor y licencias de uso.', NULL),
('A3.4', 'A', 'Creación de contenidos digitales', 'Tengo nociones de automatización o programación básica (macros, fórmulas avanzadas, formularios).', NULL);

-- Área 4. Seguridad
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('A4.1', 'A', 'Seguridad', 'Protejo mis dispositivos (antivirus, actualizaciones, bloqueo de pantalla).', NULL),
('A4.2', 'A', 'Seguridad', 'Protejo mis datos personales y mi privacidad en línea.', NULL),
('A4.3', 'A', 'Seguridad', 'Cuido mi salud y bienestar en el uso de tecnologías (ergonomía, tiempo de pantalla).', NULL),
('A4.4', 'A', 'Seguridad', 'Hago un uso sostenible y responsable de las tecnologías (energía, impresión, residuos).', NULL);

-- Área 5. Resolución de problemas
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('A5.1', 'A', 'Resolución de problemas', 'Resuelvo problemas técnicos básicos por mi mismo(a).', NULL),
('A5.2', 'A', 'Resolución de problemas', 'Identifico necesidades y elijo herramientas digitales para resolverlas.', NULL),
('A5.3', 'A', 'Resolución de problemas', 'Uso las tecnologías de forma creativa para mejorar mi trabajo.', NULL),
('A5.4', 'A', 'Resolución de problemas', 'Identifico mis brechas digitales y busco aprender de forma continua.', NULL);

-- Área 6. Bloque institucional
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('A6.1', 'A', 'Bloque institucional', 'Uso los sistemas de información institucionales propios de mi función (trámite documentario, SGD/MGD, sistemas de gestión).', NULL),
('A6.2', 'A', 'Bloque institucional', 'Utilizo la firma digital y/o documentos electrónicos en mis procesos.', NULL),
('A6.3', 'A', 'Bloque institucional', 'Aplico ofimática avanzada para reportes y gestión de datos en mi área.', NULL);

-- INSTRUMENTO B — Docentes (DigCompEdu, 22 ítems)

-- Área 1. Compromiso profesional
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('B1.1', 'B', 'Compromiso profesional', 'Me comunico con estudiantes y colegas mediante tecnologías digitales.', NULL),
('B1.2', 'B', 'Compromiso profesional', 'Colaboro profesionalmente con otros docentes usando medios digitales.', NULL),
('B1.3', 'B', 'Compromiso profesional', 'Reflexiono de forma crítica sobre mi propia práctica digital docente.', NULL),
('B1.4', 'B', 'Compromiso profesional', 'Participo en mi desarrollo profesional continuo en competencias digitales.', NULL);

-- Área 2. Recursos digitales
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('B2.1', 'B', 'Recursos digitales', 'Selecciono recursos digitales pertinentes para la enseñanza.', NULL),
('B2.2', 'B', 'Recursos digitales', 'Creo y modifico recursos educativos digitales.', NULL),
('B2.3', 'B', 'Recursos digitales', 'Gestiono, protejo y comparto recursos digitales respetando licencias y datos.', NULL);

-- Área 3. Pedagogía: enseñanza y aprendizaje
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('B3.1', 'B', 'Pedagogía: enseñanza y aprendizaje', 'Integro las tecnologías digitales en mis estrategias de enseñanza.', NULL),
('B3.2', 'B', 'Pedagogía: enseñanza y aprendizaje', 'Acompaño y oriento a los estudiantes mediante medios digitales (andamiaje).', NULL),
('B3.3', 'B', 'Pedagogía: enseñanza y aprendizaje', 'Promuevo el aprendizaje colaborativo con tecnologías.', NULL),
('B3.4', 'B', 'Pedagogía: enseñanza y aprendizaje', 'Fomento el aprendizaje autorregulado de los estudiantes con apoyo digital.', NULL);

-- Área 4. Evaluación y retroalimentación
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('B4.1', 'B', 'Evaluación y retroalimentación', 'Uso herramientas digitales para evaluar a los estudiantes.', NULL),
('B4.2', 'B', 'Evaluación y retroalimentación', 'Analizo evidencias y datos de la actividad de los estudiantes (analítica del aprendizaje).', NULL),
('B4.3', 'B', 'Evaluación y retroalimentación', 'Brindo retroalimentación y planifico a partir de información digital.', NULL);

-- Área 5. Empoderamiento de los estudiantes
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('B5.1', 'B', 'Empoderamiento de los estudiantes', 'Garantizo la accesibilidad e inclusión en los recursos y actividades digitales.', NULL),
('B5.2', 'B', 'Empoderamiento de los estudiantes', 'Diferencio y personalizo el aprendizaje con tecnologías.', NULL),
('B5.3', 'B', 'Empoderamiento de los estudiantes', 'Promuevo el compromiso activo de los estudiantes con medios digitales.', NULL);

-- Área 6. Desarrollo de la competencia digital de los estudiantes
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('B6.1', 'B', 'Desarrollo de la competencia digital de los estudiantes', 'Desarrollo en mis estudiantes la búsqueda y evaluación de información digital.', NULL),
('B6.2', 'B', 'Desarrollo de la competencia digital de los estudiantes', 'Desarrollo en mis estudiantes la comunicación y colaboración digital.', NULL),
('B6.3', 'B', 'Desarrollo de la competencia digital de los estudiantes', 'Desarrollo en mis estudiantes la creación de contenidos digitales.', NULL),
('B6.4', 'B', 'Desarrollo de la competencia digital de los estudiantes', 'Promuevo el uso responsable, seguro y el bienestar digital de mis estudiantes.', NULL),
('B6.5', 'B', 'Desarrollo de la competencia digital de los estudiantes', 'Desarrollo en mis estudiantes la resolución de problemas con tecnologías.', NULL);

-- INSTRUMENTO C — Estudiantes (DigComp 2.2, 21 ítems)

-- Área 1. Información y alfabetización informacional
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('C1.1', 'C', 'Información y alfabetización informacional', 'Busco, navego y filtro información en internet para mis estudios.', NULL),
('C1.2', 'C', 'Información y alfabetización informacional', 'Evalúo la fiabilidad de la información y reconozco fuentes confiables.', NULL),
('C1.3', 'C', 'Información y alfabetización informacional', 'Organizo y almaceno mis archivos y contenidos digitales (nube, carpetas).', NULL);

-- Área 2. Comunicación y colaboración
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('C2.1', 'C', 'Comunicación y colaboración', 'Me comunico con docentes y compañeros mediante herramientas digitales.', NULL),
('C2.2', 'C', 'Comunicación y colaboración', 'Comparto información y trabajos por medios digitales adecuadamente.', NULL),
('C2.3', 'C', 'Comunicación y colaboración', 'Uso servicios y plataformas digitales institucionales y del Estado.', NULL),
('C2.4', 'C', 'Comunicación y colaboración', 'Colaboro en trabajos en documentos compartidos en línea.', NULL),
('C2.5', 'C', 'Comunicación y colaboración', 'Aplico normas de comportamiento (netiqueta) en entornos digitales.', NULL),
('C2.6', 'C', 'Comunicación y colaboración', 'Gestiono mi identidad y huella digital de forma responsable.', NULL);

-- Área 3. Creación de contenidos digitales
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('C3.1', 'C', 'Creación de contenidos digitales', 'Elaboro documentos, hojas de cálculo y presentaciones.', NULL),
('C3.2', 'C', 'Creación de contenidos digitales', 'Integro y reelaboro contenidos digitales en mis trabajos.', NULL),
('C3.3', 'C', 'Creación de contenidos digitales', 'Reconozco y respeto derechos de autor, citas y licencias.', NULL),
('C3.4', 'C', 'Creación de contenidos digitales', 'Tengo nociones de programación o automatización básica.', NULL);

-- Área 4. Seguridad
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('C4.1', 'C', 'Seguridad', 'Protejo mis dispositivos frente a virus y accesos no autorizados.', NULL),
('C4.2', 'C', 'Seguridad', 'Protejo mis datos personales y mi privacidad en línea.', NULL),
('C4.3', 'C', 'Seguridad', 'Cuido mi salud y bienestar en el uso de tecnologías.', NULL),
('C4.4', 'C', 'Seguridad', 'Hago un uso sostenible y responsable de las tecnologías.', NULL);

-- Área 5. Resolución de problemas
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('C5.1', 'C', 'Resolución de problemas', 'Resuelvo problemas técnicos básicos por mí mismo(a).', NULL),
('C5.2', 'C', 'Resolución de problemas', 'Identifico necesidades y elijo herramientas digitales para resolverlas.', NULL),
('C5.3', 'C', 'Resolución de problemas', 'Uso las tecnologías de forma creativa para aprender.', NULL),
('C5.4', 'C', 'Resolución de problemas', 'Reconozco mis brechas digitales y aprendo de forma continua.', NULL);

-- BLOQUES TRANSVERSALES (T)

-- T1. Habilidades y competencias digitales básicas
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('T1.1', 'T', 'Habilidades y competencias digitales básicas', 'Me siento cómodo/a navegando y buscando información en Internet.', NULL),
('T1.2', 'T', 'Habilidades y competencias digitales básicas', 'Sé cómo configurar opciones básicas de mi computadora (idioma, red, actualizaciones).', NULL),
('T1.3', 'T', 'Habilidades y competencias digitales básicas', 'Utilizo contraseñas seguras y entiendo su importancia.', NULL),
('T1.4', 'T', 'Habilidades y competencias digitales básicas', 'Puedo identificar y evitar correos o enlaces sospechosos (phishing).', NULL),
('T1.5', 'T', 'Habilidades y competencias digitales básicas', 'Sé cómo proteger mi información y privacidad en redes sociales y plataformas digitales.', NULL),
('T1.6', 'T', 'Habilidades y competencias digitales básicas', 'Soy capaz de evaluar la veracidad de la información que encuentro en internet.', NULL),
('T1.7', 'T', 'Habilidades y competencias digitales básicas', 'Tengo la capacidad de organizar mis archivos digitales en carpetas y nubes para encontrarlos fácilmente.', NULL);

-- T2. Tecnologías emergentes y transformación digital
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('T2.1', 'T', 'Tecnologías emergentes y transformación digital', 'Conozco los servicios y plataformas del Estado (Ej: Mi Perú, Plataforma virtual del Estado, etc.).', NULL),
('T2.2', 'T', 'Tecnologías emergentes y transformación digital', 'Sé cómo realizar un trámite en línea (certificados, pagos, matrículas) en plataformas oficiales.', NULL),
('T2.3', 'T', 'Tecnologías emergentes y transformación digital', 'Conozco el significado y la importancia del gobierno digital y la transformación digital en mi institución y el país.', NULL),
('T2.4', 'T', 'Tecnologías emergentes y transformación digital', 'He recibido capacitación o formación sobre herramientas digitales o transformación digital.', NULL),
('T2.5', 'T', 'Tecnologías emergentes y transformación digital', 'Utilizo herramientas de IA generativa para tareas específicas (Escribir textos, resúmenes, etc.).', NULL),
('T2.6', 'T', 'Tecnologías emergentes y transformación digital', 'Integro herramientas digitales en mi trabajo para mejorar procesos y optimizar mi tiempo.', NULL);

-- T3. Inteligencia Artificial Generativa
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('T3.1', 'T', 'Inteligencia Artificial Generativa', 'Utilizo herramientas de IA (ChatGPT, Gemini, Copilot, etc.) de manera efectiva.', NULL),
('T3.2', 'T', 'Inteligencia Artificial Generativa', 'Evalúo la calidad y veracidad de los contenidos o información generada por la IA.', NULL),
('T3.3', 'T', 'Inteligencia Artificial Generativa', 'Aplico técnicas de prompting (creación de instrucciones claras y precisas para la IA).', NULL),
('T3.4', 'T', 'Inteligencia Artificial Generativa', 'Uso la IA de manera ética y responsable (evitando el plagio, considerando derechos de autor, etc.).', NULL),
('T3.5', 'T', 'Inteligencia Artificial Generativa', 'He explorado herramientas de IA para la creación de contenido creativo (videos, imágenes, música, presentaciones).', NULL),
('T3.6', 'T', 'Inteligencia Artificial Generativa', 'Identifico los riesgos y limitaciones de la IA (sesgo, alucinaciones, brechas digitales, privacidad).', NULL),
('T3.7', 'T', 'Inteligencia Artificial Generativa', 'Me mantengo actualizado/a sobre los avances, aplicaciones y ética en el uso de la IA.', NULL),
('T3.8', 'T', 'Inteligencia Artificial Generativa', 'Conozco los marcos legales y éticos vigentes sobre el uso de la IA.', NULL);

-- T4. Competencias SGD/MGD (solo admin/docente)
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('T4.1', 'T', 'Competencias SGD/MGD', 'Identifico las unidades y componentes del SGD/MGD que corresponden a mi área.', 'admin,docente'),
('T4.2', 'T', 'Competencias SGD/MGD', 'Utilizo el SGD/MGD para gestionar de manera efectiva los documentos electrónicos.', 'admin,docente'),
('T4.3', 'T', 'Competencias SGD/MGD', 'Utilizo el SGD/MGD para gestionar los documentos y archivos de mi área.', 'admin,docente'),
('T4.4', 'T', 'Competencias SGD/MGD', 'Aplico los principios del SGD/MGD en mi trabajo diario.', 'admin,docente'),
('T4.5', 'T', 'Competencias SGD/MGD', 'Conozco los tipos de documentos electrónicos según la normativa vigente (D.S. N° 029-2021-PCM).', 'admin,docente'),
('T4.6', 'T', 'Competencias SGD/MGD', 'Conozco las normas y principios del SGD/MGD para la gestión documental de acuerdo a la normativa vigente (D.S. N° 029-2021-PCM, R.D. N° 015-2021-PCM-SGD, R.D. N° 009-2024-SGD/MGD-MC).', 'admin,docente'),
('T4.7', 'T', 'Competencias SGD/MGD', 'Aplico los criterios de seguridad, integridad y conservación de la documentación y los datos en el SGD/MGD.', 'admin,docente'),
('T4.8', 'T', 'Competencias SGD/MGD', 'Aplico correctamente la firma digital o electrónica en la gestión documental y trámites en el SGD/MGD.', 'admin,docente');

-- T5. Gestión de riesgos y ética en entornos digitales (solo admin/docente)
INSERT INTO item_catalogo (codigo, instrumento, area, texto_item, aplica_a) VALUES
('T5.1', 'T', 'Gestión de riesgos y ética en entornos digitales', 'Identifico y evalúo los riesgos asociados al uso de tecnologías digitales en mi ámbito laboral.', 'admin,docente'),
('T5.2', 'T', 'Gestión de riesgos y ética en entornos digitales', 'Aplico medidas preventivas para proteger la información institucional y personal ante amenazas digitales (phishing, malware, etc.).', 'admin,docente'),
('T5.3', 'T', 'Gestión de riesgos y ética en entornos digitales', 'Reconozco la importancia de la ética profesional en el manejo de datos y la comunicación digital.', 'admin,docente'),
('T5.4', 'T', 'Gestión de riesgos y ética en entornos digitales', 'Actúo conforme a las políticas institucionales y normativas legales sobre protección de datos y seguridad digital.', 'admin,docente'),
('T5.5', 'T', 'Gestión de riesgos y ética en entornos digitales', 'Sé cómo actuar ante un incidente de seguridad informática o filtración de datos.', 'admin,docente'),
('T5.6', 'T', 'Gestión de riesgos y ética en entornos digitales', 'Fomento en mi equipo de trabajo una cultura de ciberseguridad y buenas prácticas digitales.', 'admin,docente');
