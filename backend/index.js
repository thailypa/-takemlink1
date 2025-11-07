import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware CORS - Permitir todas las solicitudes desde cualquier origen
app.use(cors({
  origin: '*', // Permitir todos los orígenes (en producción, puedes especificar solo tu dominio de Netlify)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Datos temporales (luego se conectará a base de datos)
let usuarios = [];
let instituciones = [];
let ecoRegistros = [];
// Alertas de ejemplo
let alertas = [
  {
    id: '1',
    tipo: 'zona_critica',
    titulo: 'Zona Norte requiere limpieza urgente',
    descripcion: 'Acumulación de residuos plásticos supera el umbral crítico. Se requiere intervención inmediata.',
    prioridad: 'alta',
    zona: 'Zona Norte',
    accion: 'requiere_intervencion',
    metricas: { residuos: 1250, participantes: 45, tendencia: 'creciente' },
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    leida: false
  },
  {
    id: '2',
    tipo: 'baja_participacion',
    titulo: 'Comunidad Oeste con baja actividad',
    descripcion: 'Solo 15 participantes activos. Se recomienda contactar al líder de comunidad para aumentar la participación.',
    prioridad: 'media',
    zona: 'Zona Oeste',
    accion: 'contactar_lider',
    metricas: { residuos: 800, participantes: 15, tendencia: 'estable' },
    fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    leida: false
  },
  {
    id: '3',
    tipo: 'logro',
    titulo: 'Meta mensual superada en 25%',
    descripcion: '¡Excelente trabajo! La meta mensual de recolección ha sido superada en un 25%.',
    prioridad: 'baja',
    zona: 'Zona Centro',
    accion: 'monitorear',
    metricas: { residuos: 1300, participantes: 38, tendencia: 'creciente' },
    fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    leida: true
  }
];

let configuracionAlertas = {
  umbralCritico: 1000,
  umbralAdvertencia: 500,
  notificacionesEmail: true,
  notificacionesPush: false
};

// Sistema de Recompensas
let recompensas = [
  {
    id: "1",
    nombre: "Kit de Jardinería Ecológica",
    descripcion: "Incluye semillas, tierra orgánica y herramientas básicas",
    categoria: "jardineria",
    puntos: 500,
    stock: 15,
    tipo: "fisico",
    proveedor: "EcoGarden",
    popular: true,
    novedad: false,
    nivelRequerido: "novato"
  },
  {
    id: "2",
    nombre: "Descuento 20% en Tienda Verde",
    descripcion: "Cupón de descuento para productos ecológicos",
    categoria: "descuento",
    puntos: 300,
    stock: 50,
    tipo: "digital",
    proveedor: "Tienda Verde",
    popular: true,
    novedad: true,
    nivelRequerido: "novato"
  },
  {
    id: "3",
    nombre: "Curso Online de Compostaje",
    descripcion: "Aprende técnicas avanzadas de compostaje doméstico",
    categoria: "educacion",
    puntos: 800,
    stock: 30,
    tipo: "digital",
    proveedor: "EcoAcademy",
    popular: false,
    novedad: true,
    nivelRequerido: "guardián"
  },
  {
    id: "4",
    nombre: "Bicicleta Reciclada Premium",
    descripcion: "Bicicleta restaurada con materiales reciclados",
    categoria: "transporte",
    puntos: 2500,
    stock: 3,
    tipo: "fisico",
    proveedor: "BikeEco",
    popular: false,
    novedad: false,
    nivelRequerido: "líder verde"
  },
  {
    id: "5",
    nombre: "Certificado de Héroe Ecológico",
    descripcion: "Certificado digital reconocido por instituciones ambientales",
    categoria: "reconocimiento",
    puntos: 1500,
    stock: 100,
    tipo: "digital",
    proveedor: "TákemLink",
    popular: false,
    novedad: false,
    nivelRequerido: "héroe ecológico"
  }
];

let canjes = [];

// Rutas de Usuarios
app.post('/api/usuarios/registro', (req, res) => {
  try {
    const { nombre, email, tipo, zona, residuos } = req.body;
    
    // Validación básica
    if (!nombre || !email || !tipo || !zona) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos',
        camposRequeridos: ['nombre', 'email', 'tipo', 'zona']
      });
    }
    
    const nuevoUsuario = {
      id: Date.now().toString(),
      nombre: String(nombre || '').trim(),
      email: String(email || '').trim(),
      tipo: String(tipo || '').trim(),
      zona: String(zona || '').trim(),
      residuos: Array.isArray(residuos) ? residuos : [],
      ecoPuntos: 0,
      nivel: 'novato',
      fechaRegistro: new Date().toISOString(),
      ranking: Math.floor(Math.random() * 100) + 1,
    };
    
    usuarios.push(nuevoUsuario);
    console.log('✅ Usuario registrado:', nuevoUsuario);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      mensaje: error.message
    });
  }
});

app.get('/api/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === req.params.id);
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json(usuario);
});

// Rutas de Instituciones
app.post('/api/instituciones/registro', (req, res) => {
  try {
    console.log('📥 Solicitud recibida:', {
      method: req.method,
      path: req.path,
      body: req.body,
      contentType: req.get('Content-Type')
    });

    const { nombre, tipo, email, telefono, zonaAccion, numeroBeneficiarios, residuosGestionados, descripcion } = req.body;

    // Validación básica
    if (!nombre || !tipo || !email || !zonaAccion) {
      console.log('❌ Validación fallida - campos faltantes:', { nombre: !!nombre, tipo: !!tipo, email: !!email, zonaAccion: !!zonaAccion });
      return res.status(400).json({ 
        error: 'Faltan campos requeridos',
        camposRequeridos: ['nombre', 'tipo', 'email', 'zonaAccion'],
        recibidos: {
          nombre: !!nombre,
          tipo: !!tipo,
          email: !!email,
          zonaAccion: !!zonaAccion
        }
      });
    }

    if (!Array.isArray(residuosGestionados) || residuosGestionados.length === 0) {
      console.log('❌ Validación fallida - residuosGestionados:', residuosGestionados);
      return res.status(400).json({ 
        error: 'Debe seleccionar al menos un tipo de residuo',
        recibido: residuosGestionados
      });
    }

    // Normalizar y limpiar datos de forma segura
    const nuevaInstitucion = {
      id: Date.now().toString(),
      nombre: String(nombre || '').trim(),
      tipo: String(tipo || '').trim(),
      email: String(email || '').trim(),
      telefono: telefono ? String(telefono).trim() : '',
      zonaAccion: String(zonaAccion || '').trim(),
      numeroBeneficiarios: numeroBeneficiarios ? Number(numeroBeneficiarios) : 0,
      residuosGestionados: Array.isArray(residuosGestionados) ? residuosGestionados : [],
      descripcion: descripcion ? String(descripcion).trim() : '',
      fechaRegistro: new Date().toISOString(),
      metricas: {
        totalRecolectado: 0,
        co2Evitado: 0,
        familiasBeneficiadas: 0,
        actividadesRealizadas: 0,
        comunidadesActivas: 1,
        usuariosActivos: 0
      }
    };

    console.log('✅ Institución creada:', nuevaInstitucion);
    instituciones.push(nuevaInstitucion);
    
    console.log('📊 Total de instituciones:', instituciones.length);
    
    res.status(201).json(nuevaInstitucion);
  } catch (error) {
    console.error('❌ Error al registrar institución:', error);
    console.error('Stack trace:', error.stack);
    console.error('Request body:', req.body);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      mensaje: error.message,
      tipo: error.name
    });
  }
});

app.get('/api/instituciones/:id', (req, res) => {
  const institucion = instituciones.find(i => i.id === req.params.id);
  if (!institucion) {
    return res.status(404).json({ error: 'Institución no encontrada' });
  }
  res.json(institucion);
});

// Obtener métricas agregadas
app.get('/api/instituciones/:id/metricas', (req, res) => {
  const institucion = instituciones.find(i => i.id === req.params.id);
  if (!institucion) {
    return res.status(404).json({ error: 'Institución no encontrada' });
  }

  // Simular métricas en tiempo real
  const metricas = {
    totalRecolectado: 12500 + Math.floor(Math.random() * 1000),
    co2Evitado: 25.6 + (Math.random() * 2),
    familiasBeneficiadas: 450 + Math.floor(Math.random() * 20),
    actividadesRealizadas: 28 + Math.floor(Math.random() * 5),
    comunidadesActivas: 12,
    usuariosActivos: 1250 + Math.floor(Math.random() * 50),
    tendenciaMensual: [
      { mes: 'Ene', recolectado: 800, co2: 1.6 },
      { mes: 'Feb', recolectado: 950, co2: 1.9 },
      { mes: 'Mar', recolectado: 1100, co2: 2.2 },
      { mes: 'Abr', recolectado: 1300, co2: 2.6 },
      { mes: 'May', recolectado: 1500, co2: 3.0 },
      { mes: 'Jun', recolectado: 1800, co2: 3.6 }
    ]
  };

  res.json(metricas);
});

// Rutas de EcoPuntos
app.post('/api/ecopuntos/registrar', (req, res) => {
  const { usuarioId, tipoResiduo, cantidad } = req.body;
  const puntosPorKg = {
    plastico: 10, vidrio: 10, carton: 10,
    organico: 5, metal: 12, electronico: 15,
  };
  const puntos = (puntosPorKg[tipoResiduo] || 0) * Number(cantidad || 0);

  // Actualizar usuario
  const usuario = usuarios.find(u => u.id === usuarioId);
  if (usuario) {
    usuario.ecoPuntos += puntos;
    // Subir de nivel
    if (usuario.ecoPuntos >= 5000) usuario.nivel = 'leyenda';
    else if (usuario.ecoPuntos >= 3000) usuario.nivel = 'héroe ecológico';
    else if (usuario.ecoPuntos >= 1500) usuario.nivel = 'líder verde';
    else if (usuario.ecoPuntos >= 500) usuario.nivel = 'guardián';
  }

  // Registrar la transacción
  const registro = {
    id: Date.now().toString(),
    usuarioId,
    tipoResiduo,
    cantidad,
    puntos,
    fecha: new Date(),
  };
  ecoRegistros.push(registro);

  res.json({
    puntosGanados: puntos,
    puntosTotales: usuario?.ecoPuntos ?? 0,
    nivel: usuario?.nivel ?? 'novato',
  });
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  try {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      usuariosRegistrados: usuarios.length,
      institucionesRegistradas: instituciones.length,
    });
  } catch (error) {
    console.error('Error en /api/health:', error);
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// Rutas de Alertas
app.get('/api/alertas', (req, res) => {
  try {
    const { prioridad, leida } = req.query;
    
    let alertasFiltradas = alertas;
    
    if (prioridad) {
      alertasFiltradas = alertasFiltradas.filter(a => a.prioridad === prioridad);
    }
    
    if (leida !== undefined) {
      alertasFiltradas = alertasFiltradas.filter(a => a.leida === (leida === 'true'));
    }
    
    res.json(alertasFiltradas);
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({ error: 'Error al obtener alertas', mensaje: error.message });
  }
});

app.post('/api/alertas', (req, res) => {
  try {
    const { tipo, titulo, descripcion, prioridad, zona, accion, metricas } = req.body;
    
    const nuevaAlerta = {
      id: Date.now().toString(),
      tipo,
      titulo,
      descripcion,
      prioridad,
      zona,
      accion,
      metricas,
      fecha: new Date().toISOString(),
      leida: false
    };
    
    alertas.push(nuevaAlerta);
    
    // Aquí iría la lógica para enviar notificaciones
    if (configuracionAlertas.notificacionesEmail) {
      console.log('📧 Enviando notificación por email:', titulo);
    }
    
    if (configuracionAlertas.notificacionesPush) {
      console.log('📱 Enviando notificación push:', titulo);
    }
    
    res.status(201).json(nuevaAlerta);
  } catch (error) {
    console.error('Error al crear alerta:', error);
    res.status(500).json({ error: 'Error al crear alerta', mensaje: error.message });
  }
});

app.put('/api/alertas/:id/leida', (req, res) => {
  try {
    const alerta = alertas.find(a => a.id === req.params.id);
    if (alerta) {
      alerta.leida = true;
      res.json(alerta);
    } else {
      res.status(404).json({ error: 'Alerta no encontrada' });
    }
  } catch (error) {
    console.error('Error al marcar alerta como leída:', error);
    res.status(500).json({ error: 'Error al actualizar alerta', mensaje: error.message });
  }
});

app.delete('/api/alertas/:id', (req, res) => {
  try {
    const index = alertas.findIndex(a => a.id === req.params.id);
    if (index !== -1) {
      alertas.splice(index, 1);
      res.json({ message: 'Alerta eliminada' });
    } else {
      res.status(404).json({ error: 'Alerta no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar alerta:', error);
    res.status(500).json({ error: 'Error al eliminar alerta', mensaje: error.message });
  }
});

// Configuración de Alertas
app.get('/api/alertas/configuracion', (req, res) => {
  try {
    res.json(configuracionAlertas);
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener configuración', mensaje: error.message });
  }
});

app.put('/api/alertas/configuracion', (req, res) => {
  try {
    configuracionAlertas = { ...configuracionAlertas, ...req.body };
    res.json(configuracionAlertas);
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'Error al actualizar configuración', mensaje: error.message });
  }
});

// Generar alerta automática basada en métricas
app.post('/api/alertas/generar-automatica', (req, res) => {
  try {
    const { zona, residuosAcumulados, participantes, tendencia } = req.body;
    
    let tipo, prioridad, titulo, accion;
    
    if (residuosAcumulados > configuracionAlertas.umbralCritico) {
      tipo = 'zona_critica';
      prioridad = 'alta';
      titulo = `Acumulación crítica en ${zona}`;
      accion = 'requiere_intervencion';
    } else if (residuosAcumulados > configuracionAlertas.umbralAdvertencia) {
      tipo = 'zona_critica';
      prioridad = 'media';
      titulo = `Advertencia: Acumulación en ${zona}`;
      accion = 'monitorear';
    } else if (participantes < 10) {
      tipo = 'baja_participacion';
      prioridad = 'media';
      titulo = `Baja participación en ${zona}`;
      accion = 'contactar_lider';
    } else {
      return res.status(200).json({ message: 'No se genera alerta' });
    }
    
    const nuevaAlerta = {
      id: Date.now().toString(),
      tipo,
      titulo,
      descripcion: `Métricas: ${residuosAcumulados}kg acumulados, ${participantes} participantes, tendencia ${tendencia}`,
      prioridad,
      zona,
      accion,
      metricas: { residuos: residuosAcumulados, participantes, tendencia },
      fecha: new Date().toISOString(),
      leida: false
    };
    
    alertas.push(nuevaAlerta);
    res.status(201).json(nuevaAlerta);
  } catch (error) {
    console.error('Error al generar alerta automática:', error);
    res.status(500).json({ error: 'Error al generar alerta', mensaje: error.message });
  }
});

// Rutas de Recompensas
app.get('/api/recompensas', (req, res) => {
  try {
    const { categoria, nivel } = req.query;
    
    let recompensasFiltradas = recompensas;
    
    if (categoria && categoria !== 'todas') {
      recompensasFiltradas = recompensasFiltradas.filter(r => r.categoria === categoria);
    }
    
    if (nivel) {
      const niveles = ['novato', 'guardián', 'líder verde', 'héroe ecológico', 'leyenda'];
      const nivelIndexUsuario = niveles.indexOf(nivel);
      
      recompensasFiltradas = recompensasFiltradas.filter(recompensa => {
        const nivelIndexRequerido = niveles.indexOf(recompensa.nivelRequerido);
        return nivelIndexUsuario >= nivelIndexRequerido;
      });
    }
    
    res.json(recompensasFiltradas);
  } catch (error) {
    console.error('Error al obtener recompensas:', error);
    res.status(500).json({ error: 'Error al obtener recompensas', mensaje: error.message });
  }
});

app.post('/api/recompensas/canjear', (req, res) => {
  try {
    const { usuarioId, recompensaId } = req.body;
    
    const usuario = usuarios.find(u => u.id === usuarioId);
    const recompensa = recompensas.find(r => r.id === recompensaId);
    
    if (!usuario || !recompensa) {
      return res.status(404).json({ error: 'Usuario o recompensa no encontrado' });
    }
    
    if (usuario.ecoPuntos < recompensa.puntos) {
      return res.status(400).json({ error: 'EcoPuntos insuficientes' });
    }
    
    if (recompensa.stock <= 0) {
      return res.status(400).json({ error: 'Recompensa agotada' });
    }
    
    // Realizar canje
    usuario.ecoPuntos -= recompensa.puntos;
    recompensa.stock -= 1;
    
    const canje = {
      id: Date.now().toString(),
      usuarioId,
      recompensaId,
      recompensaNombre: recompensa.nombre,
      puntos: recompensa.puntos,
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    };
    
    canjes.push(canje);
    
    res.json({
      canje,
      puntosRestantes: usuario.ecoPuntos,
      mensaje: '¡Recompensa canjeada exitosamente!'
    });
  } catch (error) {
    console.error('Error al canjear recompensa:', error);
    res.status(500).json({ error: 'Error al canjear recompensa', mensaje: error.message });
  }
});

app.get('/api/usuarios/:id/canjes', (req, res) => {
  try {
    const usuarioCanjes = canjes.filter(c => c.usuarioId === req.params.id);
    res.json(usuarioCanjes);
  } catch (error) {
    console.error('Error al obtener canjes del usuario:', error);
    res.status(500).json({ error: 'Error al obtener canjes', mensaje: error.message });
  }
});

// Rutas para administrar recompensas (para instituciones)
app.post('/api/recompensas', (req, res) => {
  try {
    const nuevaRecompensa = {
      id: Date.now().toString(),
      ...req.body,
      fechaCreacion: new Date().toISOString()
    };
    
    recompensas.push(nuevaRecompensa);
    res.status(201).json(nuevaRecompensa);
  } catch (error) {
    console.error('Error al crear recompensa:', error);
    res.status(500).json({ error: 'Error al crear recompensa', mensaje: error.message });
  }
});

app.put('/api/recompensas/:id', (req, res) => {
  try {
    const index = recompensas.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
      recompensas[index] = { ...recompensas[index], ...req.body };
      res.json(recompensas[index]);
    } else {
      res.status(404).json({ error: 'Recompensa no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar recompensa:', error);
    res.status(500).json({ error: 'Error al actualizar recompensa', mensaje: error.message });
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API TákemLink',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      usuarios: {
        registro: 'POST /api/usuarios/registro',
        obtener: 'GET /api/usuarios/:id'
      },
      instituciones: {
        registro: 'POST /api/instituciones/registro',
        obtener: 'GET /api/instituciones/:id',
        metricas: 'GET /api/instituciones/:id/metricas'
      },
      ecopuntos: {
        registrar: 'POST /api/ecopuntos/registrar'
      },
      alertas: {
        listar: 'GET /api/alertas',
        crear: 'POST /api/alertas',
        marcarLeida: 'PUT /api/alertas/:id/leida',
        eliminar: 'DELETE /api/alertas/:id',
        configuracion: 'GET /api/alertas/configuracion',
        actualizarConfig: 'PUT /api/alertas/configuracion',
        generarAutomatica: 'POST /api/alertas/generar-automatica'
      },
      recompensas: {
        listar: 'GET /api/recompensas',
        canjear: 'POST /api/recompensas/canjear',
        crear: 'POST /api/recompensas',
        actualizar: 'PUT /api/recompensas/:id',
        canjesUsuario: 'GET /api/usuarios/:id/canjes'
      }
    }
  });
});

// Middleware de manejo de errores para JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      error: 'JSON malformado',
      mensaje: 'El cuerpo de la solicitud no es un JSON válido'
    });
  }
  next(err);
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    mensaje: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor TákemLink corriendo en http://localhost:${PORT}`);
  console.log(`📝 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Endpoints disponibles:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/instituciones/registro`);
  console.log(`   - GET  /api/instituciones/:id`);
  console.log(`   - GET  /api/instituciones/:id/metricas`);
  console.log(`   - GET  /api/recompensas`);
  console.log(`   - POST /api/recompensas/canjear`);
  console.log(`   - GET  /api/usuarios/:id/canjes`);
});


