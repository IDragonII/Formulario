const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const ExcelJS = require('exceljs');

// Todas las rutas requieren autenticación
router.use(auth);

// GET /api/admin/stats — Resumen general
router.get('/stats', async (req, res) => {
  try {
    const [total, porEstamento, porDependencia] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM respuestas'),
      pool.query(
        'SELECT estamento, COUNT(*) as cantidad FROM respuestas GROUP BY estamento ORDER BY estamento'
      ),
      pool.query(
        'SELECT dependencia, COUNT(*) as cantidad FROM respuestas WHERE dependencia IS NOT NULL GROUP BY dependencia ORDER BY cantidad DESC LIMIT 20'
      ),
    ]);

    res.json({
      total: parseInt(total.rows[0].total),
      por_estamento: porEstamento.rows,
      por_dependencia: porDependencia.rows,
    });
  } catch (err) {
    console.error('Error en stats:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/admin/respuestas — Listar respuestas con paginación
router.get('/respuestas', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;
  const estamento = req.query.estamento;

  try {
    let where = '';
    const params = [];

    if (estamento && ['administrativo', 'docente', 'estudiante'].includes(estamento)) {
      where = 'WHERE estamento = $1';
      params.push(estamento);
    }

    const countQuery = `SELECT COUNT(*) as total FROM respuestas ${where}`;
    const dataQuery = `
      SELECT id, estamento, sexo, rango_edad, dependencia, frecuencia_ia,
             dispositivo_principal, comentarios, enviado_en
      FROM respuestas ${where}
      ORDER BY enviado_en DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, params.slice(0, -2)),
      pool.query(dataQuery, params),
    ]);

    res.json({
      page,
      limit,
      total: parseInt(countResult.rows[0].total),
      data: dataResult.rows,
    });
  } catch (err) {
    console.error('Error al listar respuestas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/admin/respuestas/:id — Detalle de una respuesta
router.get('/respuestas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [meta, items, t5] = await Promise.all([
      pool.query('SELECT * FROM respuestas WHERE id = $1', [id]),
      pool.query(
        `SELECT ri.codigo_item, ri.valor, ic.area, ic.texto_item
         FROM respuestas_items ri
         JOIN item_catalogo ic ON ic.codigo = ri.codigo_item
         WHERE ri.respuesta_id = $1
         ORDER BY ri.codigo_item`,
        [id]
      ),
      pool.query('SELECT opcion FROM respuestas_t5 WHERE respuesta_id = $1', [id]),
    ]);

    if (meta.rows.length === 0) {
      return res.status(404).json({ error: 'Respuesta no encontrada' });
    }

    res.json({
      meta: meta.rows[0],
      items: items.rows,
      t5: t5.rows.map((r) => r.opcion),
    });
  } catch (err) {
    console.error('Error al obtener respuesta:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/admin/promedios — Promedios por área e instrumento
router.get('/promedios', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        ic.instrumento,
        ic.area,
        ic.codigo,
        ROUND(AVG(ri.valor)::numeric, 2) as promedio,
        COUNT(ri.valor) as respondieron
      FROM respuestas_items ri
      JOIN item_catalogo ic ON ic.codigo = ri.codigo_item
      GROUP BY ic.instrumento, ic.area, ic.codigo
      ORDER BY ic.instrumento, ic.area, ic.codigo
    `);

    res.json(rows);
  } catch (err) {
    console.error('Error en promedios:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/admin/respuestas/:id — Eliminar respuesta
router.delete('/respuestas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM respuestas WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Respuesta no encontrada' });
    }
    res.json({ message: 'Respuesta eliminada' });
  } catch (err) {
    console.error('Error al eliminar:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/admin/reportes — Datos agregados para gráficos
router.get('/reportes', async (req, res) => {
  try {
    const [
      totalResult,
      porEstamento,
      porEdad,
      porSexo,
      porDispositivo,
      porFrecuenciaIA,
      porDependencia,
      promPorInstrumento,
      promPorArea,
      promPorEstamentoItem,
      capacitacionTop,
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM respuestas'),

      pool.query(`
        SELECT estamento, COUNT(*) as cantidad
        FROM respuestas GROUP BY estamento ORDER BY cantidad DESC
      `),

      pool.query(`
        SELECT rango_edad, COUNT(*) as cantidad
        FROM respuestas WHERE rango_edad IS NOT NULL
        GROUP BY rango_edad ORDER BY rango_edad
      `),

      pool.query(`
        SELECT sexo, COUNT(*) as cantidad
        FROM respuestas WHERE sexo IS NOT NULL
        GROUP BY sexo ORDER BY cantidad DESC
      `),

      pool.query(`
        SELECT dispositivo_principal, COUNT(*) as cantidad
        FROM respuestas WHERE dispositivo_principal IS NOT NULL
        GROUP BY dispositivo_principal ORDER BY cantidad DESC
      `),

      pool.query(`
        SELECT frecuencia_ia, COUNT(*) as cantidad
        FROM respuestas WHERE frecuencia_ia IS NOT NULL
        GROUP BY frecuencia_ia ORDER BY cantidad DESC
      `),

      pool.query(`
        SELECT dependencia, COUNT(*) as cantidad
        FROM respuestas WHERE dependencia IS NOT NULL AND dependencia != ''
        GROUP BY dependencia ORDER BY cantidad DESC LIMIT 15
      `),

      pool.query(`
        SELECT ic.instrumento,
               ROUND(AVG(ri.valor)::numeric, 2) as promedio,
               COUNT(ri.valor) as respondieron
        FROM respuestas_items ri
        JOIN item_catalogo ic ON ic.codigo = ri.codigo_item
        GROUP BY ic.instrumento ORDER BY ic.instrumento
      `),

      pool.query(`
        SELECT ic.area,
               ROUND(AVG(ri.valor)::numeric, 2) as promedio,
               COUNT(ri.valor) as respondieron
        FROM respuestas_items ri
        JOIN item_catalogo ic ON ic.codigo = ri.codigo_item
        GROUP BY ic.area ORDER BY promedio DESC
      `),

      pool.query(`
        SELECT r.estamento,
               ROUND(AVG(ri.valor)::numeric, 2) as promedio,
               COUNT(DISTINCT r.id) as personas,
               COUNT(ri.valor) as items_respondidos
        FROM respuestas r
        JOIN respuestas_items ri ON ri.respuesta_id = r.id
        GROUP BY r.estamento ORDER BY r.estamento
      `),

      pool.query(`
        SELECT opcion, COUNT(*) as cantidad
        FROM respuestas_t5
        GROUP BY opcion ORDER BY cantidad DESC LIMIT 10
      `),
    ]);

    res.json({
      total: parseInt(totalResult.rows[0].total),
      por_estamento: porEstamento.rows,
      por_edad: porEdad.rows,
      por_sexo: porSexo.rows,
      por_dispositivo: porDispositivo.rows,
      por_frecuencia_ia: porFrecuenciaIA.rows,
      por_dependencia: porDependencia.rows,
      prom_por_instrumento: promPorInstrumento.rows,
      prom_por_area: promPorArea.rows,
      prom_por_estamento: promPorEstamentoItem.rows,
      capacitacion_top: capacitacionTop.rows,
    });
  } catch (err) {
    console.error('Error en reportes:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/admin/reportes/excel — Generar y descargar reporte Excel
router.get('/reportes/excel', async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SUGE';
    workbook.created = new Date();

    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A365D' } };
    const headerFont = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    const borderThin = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' },
    };

    // --- Hoja 1: Resumen general ---
    const wsResumen = workbook.addWorksheet('Resumen');
    const [totalRes, estamentoRes, edadRes, sexoRes, frecIARes, dispRes] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM respuestas'),
      pool.query('SELECT estamento, COUNT(*) as cantidad FROM respuestas GROUP BY estamento ORDER BY cantidad DESC'),
      pool.query('SELECT rango_edad, COUNT(*) as cantidad FROM respuestas WHERE rango_edad IS NOT NULL GROUP BY rango_edad ORDER BY rango_edad'),
      pool.query('SELECT sexo, COUNT(*) as cantidad FROM respuestas WHERE sexo IS NOT NULL GROUP BY sexo ORDER BY cantidad DESC'),
      pool.query('SELECT frecuencia_ia, COUNT(*) as cantidad FROM respuestas WHERE frecuencia_ia IS NOT NULL GROUP BY frecuencia_ia ORDER BY cantidad DESC'),
      pool.query('SELECT dispositivo_principal, COUNT(*) as cantidad FROM respuestas WHERE dispositivo_principal IS NOT NULL GROUP BY dispositivo_principal ORDER BY cantidad DESC'),
    ]);

    wsResumen.columns = [
      { header: 'Métrica', key: 'metrica', width: 35 },
      { header: 'Valor', key: 'valor', width: 15 },
    ];
    wsResumen.getRow(1).eachCell(c => { c.fill = headerFill; c.font = headerFont; c.border = borderThin; });
    wsResumen.addRow({ metrica: 'Total de respuestas', valor: parseInt(totalRes.rows[0].total) });
    estamentoRes.rows.forEach(r => wsResumen.addRow({ metrica: `Estamento: ${r.estamento}`, valor: parseInt(r.cantidad) }));
    wsResumen.addRow({ metrica: '', valor: '' });
    edadRes.rows.forEach(r => wsResumen.addRow({ metrica: `Edad: ${r.rango_edad}`, valor: parseInt(r.cantidad) }));
    wsResumen.addRow({ metrica: '', valor: '' });
    sexoRes.rows.forEach(r => wsResumen.addRow({ metrica: `Sexo: ${r.sexo}`, valor: parseInt(r.cantidad) }));
    wsResumen.addRow({ metrica: '', valor: '' });
    frecIARes.rows.forEach(r => wsResumen.addRow({ metrica: `Frecuencia IA: ${r.frecuencia_ia}`, valor: parseInt(r.cantidad) }));
    wsResumen.addRow({ metrica: '', valor: '' });
    dispRes.rows.forEach(r => wsResumen.addRow({ metrica: `Dispositivo: ${r.dispositivo_principal}`, valor: parseInt(r.cantidad) }));
    wsResumen.eachRow(row => { row.eachCell(c => { c.border = borderThin; }); });

    // --- Hoja 2: Distribución por estamento ---
    const wsEstamento = workbook.addWorksheet('Por Estamento');
    wsEstamento.columns = [
      { header: 'Estamento', key: 'estamento', width: 20 },
      { header: 'Cantidad', key: 'cantidad', width: 12 },
      { header: 'Porcentaje', key: 'porcentaje', width: 12 },
    ];
    wsEstamento.getRow(1).eachCell(c => { c.fill = headerFill; c.font = headerFont; c.border = borderThin; });
    const totalEst = parseInt(totalRes.rows[0].total) || 1;
    estamentoRes.rows.forEach(r => {
      wsEstamento.addRow({
        estamento: r.estamento,
        cantidad: parseInt(r.cantidad),
        porcentaje: `${((parseInt(r.cantidad) / totalEst) * 100).toFixed(1)}%`,
      });
    });
    wsEstamento.eachRow(row => { row.eachCell(c => { c.border = borderThin; }); });

    // --- Hoja 3: Promedios por ítem ---
    const wsPromedios = workbook.addWorksheet('Promedios por Ítem');
    wsPromedios.columns = [
      { header: 'Código', key: 'codigo', width: 10 },
      { header: 'Instrumento', key: 'instrumento', width: 14 },
      { header: 'Área', key: 'area', width: 40 },
      { header: 'Ítem', key: 'texto_item', width: 60 },
      { header: 'Promedio', key: 'promedio', width: 10 },
      { header: 'Respondieron', key: 'respondieron', width: 14 },
    ];
    wsPromedios.getRow(1).eachCell(c => { c.fill = headerFill; c.font = headerFont; c.border = borderThin; });
    const promRes = await pool.query(`
      SELECT ic.codigo, ic.instrumento, ic.area, ic.texto_item,
             ROUND(AVG(ri.valor)::numeric, 2) as promedio,
             COUNT(ri.valor) as respondieron
      FROM respuestas_items ri
      JOIN item_catalogo ic ON ic.codigo = ri.codigo_item
      GROUP BY ic.codigo, ic.instrumento, ic.area, ic.texto_item
      ORDER BY ic.instrumento, ic.area, ic.codigo
    `);
    promRes.rows.forEach(r => wsPromedios.addRow({
      codigo: r.codigo, instrumento: r.instrumento, area: r.area,
      texto_item: r.texto_item, promedio: parseFloat(r.promedio), respondieron: parseInt(r.respondieron),
    }));
    wsPromedios.eachRow(row => { row.eachCell(c => { c.border = borderThin; }); });

    // --- Hoja 4: Necesidades de capacitación ---
    const wsCapac = workbook.addWorksheet('Capacitación');
    wsCapac.columns = [
      { header: 'Opción de capacitación', key: 'opcion', width: 60 },
      { header: 'Veces seleccionada', key: 'cantidad', width: 18 },
    ];
    wsCapac.getRow(1).eachCell(c => { c.fill = headerFill; c.font = headerFont; c.border = borderThin; });
    const capRes = await pool.query('SELECT opcion, COUNT(*) as cantidad FROM respuestas_t5 GROUP BY opcion ORDER BY cantidad DESC');
    capRes.rows.forEach(r => wsCapac.addRow({ opcion: r.opcion, cantidad: parseInt(r.cantidad) }));
    wsCapac.eachRow(row => { row.eachCell(c => { c.border = borderThin; }); });

    // --- Hoja 5: Respuestas individuales ---
    const wsResp = workbook.addWorksheet('Respuestas');
    wsResp.columns = [
      { header: 'ID', key: 'id', width: 6 },
      { header: 'Estamento', key: 'estamento', width: 16 },
      { header: 'Sexo', key: 'sexo', width: 10 },
      { header: 'Edad', key: 'rango_edad', width: 14 },
      { header: 'Dependencia', key: 'dependencia', width: 30 },
      { header: 'Frecuencia IA', key: 'frecuencia_ia', width: 18 },
      { header: 'Dispositivo', key: 'dispositivo_principal', width: 16 },
      { header: 'Comentarios', key: 'comentarios', width: 40 },
      { header: 'Fecha', key: 'enviado_en', width: 18 },
    ];
    wsResp.getRow(1).eachCell(c => { c.fill = headerFill; c.font = headerFont; c.border = borderThin; });
    const respRes = await pool.query('SELECT * FROM respuestas ORDER BY enviado_en DESC');
    respRes.rows.forEach(r => wsResp.addRow({
      id: r.id, estamento: r.estamento, sexo: r.sexo, rango_edad: r.rango_edad,
      dependencia: r.dependencia, frecuencia_ia: r.frecuencia_ia,
      dispositivo_principal: r.dispositivo_principal, comentarios: r.comentarios,
      enviado_en: r.enviado_en ? new Date(r.enviado_en).toLocaleDateString('es-PE') : '',
    }));
    wsResp.eachRow(row => { row.eachCell(c => { c.border = borderThin; }); });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=SUGE_Reporte_${new Date().toISOString().slice(0,10)}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error al generar Excel:', err);
    res.status(500).json({ error: 'Error al generar el reporte' });
  }
});

module.exports = router;
