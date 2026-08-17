-- ============================================
-- SUGE Encuesta Digital — Esquema de base de datos
-- PostgreSQL 16
-- ============================================

-- 1. Cuentas de acceso al panel de resultados
CREATE TABLE usuarios_oti (
    id SERIAL PRIMARY KEY,
    correo TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 2. Catálogo maestro de ítems (~91 ítems)
CREATE TABLE item_catalogo (
    codigo TEXT PRIMARY KEY,
    instrumento TEXT NOT NULL CHECK (instrumento IN ('A', 'B', 'C', 'T')),
    area TEXT NOT NULL,
    texto_item TEXT NOT NULL,
    aplica_a TEXT -- NULL = todos; 'admin,docente' = solo those
);

-- 3. Respuestas — una fila por persona encuestada (metadatos)
CREATE TABLE respuestas (
    id SERIAL PRIMARY KEY,
    estamento TEXT NOT NULL CHECK (estamento IN ('administrativo', 'docente', 'estudiante')),
    sexo TEXT,
    rango_edad TEXT,
    dependencia TEXT,
    frecuencia_ia TEXT,
    dispositivo_principal TEXT,
    condicion_laboral TEXT,
    anios_servicio TEXT,
    capacitacion_recibida TEXT,
    nivel_estudiante TEXT,
    anio_ciclo TEXT,
    modalidad_conectividad TEXT,
    comentarios TEXT,
    enviado_en TIMESTAMP DEFAULT NOW()
);

-- 4. Cada valor Likert marcado (1-5)
CREATE TABLE respuestas_items (
    id SERIAL PRIMARY KEY,
    respuesta_id INTEGER NOT NULL REFERENCES respuestas(id) ON DELETE CASCADE,
    codigo_item TEXT NOT NULL REFERENCES item_catalogo(codigo),
    valor SMALLINT NOT NULL CHECK (valor BETWEEN 1 AND 5),
    UNIQUE (respuesta_id, codigo_item)
);

-- 5. Necesidades de capacitación (selección múltiple, máx 5)
CREATE TABLE respuestas_t5 (
    id SERIAL PRIMARY KEY,
    respuesta_id INTEGER NOT NULL REFERENCES respuestas(id) ON DELETE CASCADE,
    opcion TEXT NOT NULL
);

-- Índices para consultas del dashboard
CREATE INDEX idx_respuestas_estamento ON respuestas(estamento);
CREATE INDEX idx_respuestas_enviado ON respuestas(enviado_en);
CREATE INDEX idx_respuestas_items_respuesta ON respuestas_items(respuesta_id);
CREATE INDEX idx_respuestas_t5_respuesta ON respuestas_t5(respuesta_id);
