const { z } = require('zod');

const estamentoEnum = z.enum(['administrativo', 'docente', 'estudiante']);

const respuestaSchema = z.object({
  estamento: estamentoEnum,
  sexo: z.string().optional(),
  rango_edad: z.string().optional(),
  dependencia: z.string().optional(),
  frecuencia_ia: z.string().optional(),
  dispositivo_principal: z.string().optional(),

  // Admin/Docente
  condicion_laboral: z.string().optional(),
  anios_servicio: z.string().optional(),
  capacitacion_recibida: z.string().optional(),

  // Estudiante
  nivel_estudiante: z.string().optional(),
  anio_ciclo: z.string().optional(),
  modalidad_conectividad: z.string().optional(),

  // Texto libre
  comentarios: z.string().max(2000).optional(),

  // Array de ítems Likert: [{ codigo: 'A1.1', valor: 3 }, ...]
  items: z.array(
    z.object({
      codigo: z.string().regex(/^[A-C]\d\.\d|T[1-5]\d?\.\d$/),
      valor: z.number().int().min(1).max(5),
    })
  ).min(1, 'Debe responder al menos un ítem'),

  // Selección múple T5 (máx 5)
  t5: z.array(z.string()).max(5, 'Máximo 5 opciones de capacitación').optional(),
});

module.exports = { respuestaSchema };
