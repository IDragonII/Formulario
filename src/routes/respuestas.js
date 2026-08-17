const express = require('express');
const router = express.Router();
const pool = require('../db');
const { respuestaSchema } = require('../validators/respuesta');

// POST /api/respuestas — Guardar encuesta completa
router.post('/', async (req, res) => {
  const parsed = respuestaSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const data = parsed.data;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insertar metadatos (respuestas)
    const metaQuery = `
      INSERT INTO respuestas (
        estamento, sexo, rango_edad, dependencia, frecuencia_ia,
        dispositivo_principal, condicion_laboral, anios_servicio,
        capacitacion_recibida, nivel_estudiante, anio_ciclo,
        modalidad_conectividad, comentarios
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING id
    `;
    const metaValues = [
      data.estamento,
      data.sexo || null,
      data.rango_edad || null,
      data.dependencia || null,
      data.frecuencia_ia || null,
      data.dispositivo_principal || null,
      data.condicion_laboral || null,
      data.anios_servicio || null,
      data.capacitacion_recibida || null,
      data.nivel_estudiante || null,
      data.anio_ciclo || null,
      data.modalidad_conectividad || null,
      data.comentarios || null,
    ];
    const { rows } = await client.query(metaQuery, metaValues);
    const respuestaId = rows[0].id;

    // 2. Insertar ítems Likert en batch
    if (data.items.length > 0) {
      const values = [];
      const placeholders = [];
      data.items.forEach((item, i) => {
        const offset = i * 3;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);
        values.push(respuestaId, item.codigo, item.valor);
      });

      const itemsQuery = `
        INSERT INTO respuestas_items (respuesta_id, codigo_item, valor)
        VALUES ${placeholders.join(', ')}
      `;
      await client.query(itemsQuery, values);
    }

    // 3. Insertar selecciones T5
    if (data.t5 && data.t5.length > 0) {
      const values = [];
      const placeholders = [];
      data.t5.forEach((opcion, i) => {
        placeholders.push(`($${i * 2 + 1}, $${i * 2 + 2})`);
        values.push(respuestaId, opcion);
      });

      const t5Query = `
        INSERT INTO respuestas_t5 (respuesta_id, opcion)
        VALUES ${placeholders.join(', ')}
      `;
      await client.query(t5Query, values);
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Encuesta guardada correctamente',
      respuesta_id: respuestaId,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al guardar respuesta:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// GET /api/respuestas/catalogo — Catálogo de ítems (para el frontend)
router.get('/catalogo', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT codigo, instrumento, area, texto_item, aplica_a FROM item_catalogo ORDER BY codigo'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener catálogo:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/respuestas/catalogo/t5 — Opciones de T5 para el frontend
router.get('/catalogo/t5', async (req, res) => {
  // T5 son opciones de texto, no de catálogo. Se definen en el frontend.
  // Endpoint por si se quiere servir desde la DB en el futuro.
  res.json({ message: 'Las opciones T5 se definen en el frontend' });
});

module.exports = router;
