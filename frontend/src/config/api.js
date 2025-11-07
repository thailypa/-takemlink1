// Configuración de la API
// En desarrollo, usa rutas relativas (el proxy de Vite redirige a localhost:5000)
// En producción, usa la URL completa desde la variable de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:5000');

export const API_ENDPOINTS = {
  // Instituciones
  REGISTRO_INSTITUCION: `${API_BASE_URL}/api/instituciones/registro`,
  GET_INSTITUCION: (id) => `${API_BASE_URL}/api/instituciones/${id}`,
  GET_METRICAS_INSTITUCION: (id) => `${API_BASE_URL}/api/instituciones/${id}/metricas`,
  
  // Usuarios
  REGISTRO_USUARIO: `${API_BASE_URL}/api/usuarios/registro`,
  GET_USUARIO: (id) => `${API_BASE_URL}/api/usuarios/${id}`,
  
  // EcoPuntos
  REGISTRAR_ECOPUNTOS: `${API_BASE_URL}/api/ecopuntos/registrar`,
  
  // Alertas
  GET_ALERTAS: `${API_BASE_URL}/api/alertas`,
  POST_ALERTA: `${API_BASE_URL}/api/alertas`,
  PUT_ALERTA_LEIDA: (id) => `${API_BASE_URL}/api/alertas/${id}/leida`,
  DELETE_ALERTA: (id) => `${API_BASE_URL}/api/alertas/${id}`,
  GET_CONFIG_ALERTAS: `${API_BASE_URL}/api/alertas/configuracion`,
  PUT_CONFIG_ALERTAS: `${API_BASE_URL}/api/alertas/configuracion`,
  POST_GENERAR_ALERTA_AUTOMATICA: `${API_BASE_URL}/api/alertas/generar-automatica`,
  
  // Recompensas
  GET_RECOMPENSAS: `${API_BASE_URL}/api/recompensas`,
  POST_CANJEAR_RECOMPENSA: `${API_BASE_URL}/api/recompensas/canjear`,
  POST_CREAR_RECOMPENSA: `${API_BASE_URL}/api/recompensas`,
  PUT_ACTUALIZAR_RECOMPENSA: (id) => `${API_BASE_URL}/api/recompensas/${id}`,
  GET_CANJES_USUARIO: (id) => `${API_BASE_URL}/api/usuarios/${id}/canjes`,
};

export default API_BASE_URL;

