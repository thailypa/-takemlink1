import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import API_BASE_URL from '../config/api';

const RegistroInstitucion = ({ onVolver, onRegistroCompleto }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    email: '',
    telefono: '',
    zonaAccion: '',
    numeroBeneficiarios: '',
    residuosGestionados: [],
    descripcion: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);

  // Verificar conexión con el servidor al cargar el componente
  useEffect(() => {
    let timeoutId = null;
    let controller = null;
    
    const verificarServidor = async () => {
      // Crear un nuevo controller para cada verificación
      controller = new AbortController();
      
      try {
        // Usar API_BASE_URL para que funcione tanto en desarrollo como en producción
        // En desarrollo, API_BASE_URL está vacío, así que usamos ruta relativa (el proxy de Vite redirige)
        // En producción, API_BASE_URL contiene la URL completa del backend
        const healthUrl = API_BASE_URL ? `${API_BASE_URL}/api/health` : '/api/health';
        
        console.log('🔍 Verificando servidor en:', healthUrl);
        
        // Timeout de 3 segundos
        timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(healthUrl, {
          method: 'GET',
          signal: controller.signal
        });
        
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        if (response.ok) {
          setServerStatus('conectado');
        } else {
          setServerStatus('error');
        }
      } catch (err) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        // Si es un error de timeout o conexión, marcar como desconectado
        if (err.name === 'AbortError' || err.name === 'TypeError' || err.message.includes('fetch')) {
          setServerStatus('desconectado');
        } else {
          setServerStatus('error');
        }
      }
    };
    
    verificarServidor();
    
    // Verificar periódicamente cada 5 segundos
    const intervalo = setInterval(() => {
      verificarServidor();
    }, 5000);
    
    return () => {
      clearInterval(intervalo);
      if (timeoutId) clearTimeout(timeoutId);
      if (controller) controller.abort();
    };
  }, []);

  const tiposInstitucion = [
    { value: 'municipalidad', label: '🏛️ Municipalidad', emoji: '🏛️' },
    { value: 'ong', label: '🤝 ONG Ambiental', emoji: '🤝' },
    { value: 'empresa', label: '🏢 Empresa Privada', emoji: '🏢' },
    { value: 'cooperativa', label: '👥 Cooperativa', emoji: '👥' },
    { value: 'asociacion', label: '📍 Asociación Comunitaria', emoji: '📍' },
    { value: 'educativa', label: '🎓 Institución Educativa', emoji: '🎓' }
  ];

  const tiposResiduo = [
    { id: 'plastico', nombre: 'Plástico', emoji: '🥤' },
    { id: 'vidrio', nombre: 'Vidrio', emoji: '🍶' },
    { id: 'carton', nombre: 'Cartón/Papel', emoji: '📦' },
    { id: 'organico', nombre: 'Orgánico', emoji: '🍂' },
    { id: 'metal', nombre: 'Metal', emoji: '🥫' },
    { id: 'electronico', nombre: 'Electrónico', emoji: '📱' },
    { id: 'peligroso', nombre: 'Peligroso', emoji: '⚠️' },
    { id: 'textil', nombre: 'Textil', emoji: '👕' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Mostrar en consola los datos que se van a enviar
    console.log('📤 Enviando datos al servidor:', formData);
    console.log('🔗 URL:', API_ENDPOINTS.REGISTRO_INSTITUCION);

    try {
      const response = await fetch(API_ENDPOINTS.REGISTRO_INSTITUCION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📥 Respuesta recibida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Error al parsear respuesta de error:', parseError);
        }
        
        const errorMessage = errorData.error || errorData.mensaje || `Error ${response.status}: ${response.statusText}`;
        const errorDetails = errorData.camposRequeridos || errorData.recibidos ? 
          `\nDetalles: ${JSON.stringify(errorData, null, 2)}` : '';
        
        throw new Error(errorMessage + errorDetails);
      }

      const institucionRegistrada = await response.json();
      console.log('✅ Institución registrada exitosamente:', institucionRegistrada);
      onRegistroCompleto && onRegistroCompleto(institucionRegistrada);
    } catch (err) {
      // Detectar errores de conexión
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('No se pudo conectar con el servidor. Por favor, verifique que el backend esté disponible.');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Error de conexión. Asegúrese de que el servidor backend esté corriendo.');
      } else {
        setError(err.message || 'Error al registrar la institución');
      }
      console.error('❌ Error en registro:', err);
      console.error('Error completo:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleResiduo = (residuoId) => {
    setFormData(prev => ({
      ...prev,
      residuosGestionados: prev.residuosGestionados.includes(residuoId)
        ? prev.residuosGestionados.filter(r => r !== residuoId)
        : [...prev.residuosGestionados, residuoId]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={onVolver}
            className="text-blue-600 hover:text-blue-800 mb-4 text-lg font-medium"
          >
            ← Volver al inicio
          </button>
          <h2 className="text-4xl font-bold text-blue-800 mb-2">
            Registro de Institución 🏛️
          </h2>
          <p className="text-gray-600">Únase a nuestra red de impacto ambiental</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Institución *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Municipalidad de Lima, ONG Verde..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Institución *
              </label>
              <select
                required
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione tipo</option>
                {tiposInstitucion.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Institucional *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contacto@institucion.org"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+51 123 456 789"
              />
            </div>
          </div>

          {/* Zona de Acción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona de Acción/Influencia *
            </label>
            <input
              type="text"
              required
              value={formData.zonaAccion}
              onChange={(e) => setFormData({...formData, zonaAccion: e.target.value})}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Distrito Miraflores, Región Arequipa..."
            />
          </div>

          {/* Beneficiarios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número Aproximado de Beneficiarios
            </label>
            <select
              value={formData.numeroBeneficiarios}
              onChange={(e) => setFormData({...formData, numeroBeneficiarios: e.target.value})}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccione rango</option>
              <option value="1-100">1-100 personas</option>
              <option value="101-500">101-500 personas</option>
              <option value="501-1000">501-1,000 personas</option>
              <option value="1001-5000">1,001-5,000 personas</option>
              <option value="5001+">Más de 5,000 personas</option>
            </select>
          </div>

          {/* Residuos Gestionados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Tipos de Residuos que Gestiona *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tiposResiduo.map(residuo => (
                <button
                  key={residuo.id}
                  type="button"
                  onClick={() => toggleResiduo(residuo.id)}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    formData.residuosGestionados.includes(residuo.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="text-2xl mb-2">{residuo.emoji}</div>
                  <div className="text-sm font-medium">{residuo.nombre}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de Actividades
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows="4"
              className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describa las principales actividades ambientales que realiza..."
            />
          </div>

          {/* Estado del Servidor */}
          {serverStatus === 'desconectado' && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-2xl mb-4">
              <p className="font-medium">⚠️ Servidor no disponible</p>
              <p className="text-sm mt-1">
                El servidor backend no está respondiendo. Por favor:
              </p>
              <ul className="text-sm mt-2 list-disc list-inside space-y-1">
                <li>Asegúrese de que el servidor esté corriendo: <code className="bg-yellow-100 px-2 py-1 rounded">cd takemlink/backend && npm start</code></li>
                <li>Verifique que el backend esté disponible y configurado correctamente</li>
                <li>Revise la consola del navegador (F12) para más detalles</li>
              </ul>
            </div>
          )}

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
              <p className="font-medium">⚠️ {error}</p>
              {error.includes('conectar') && (
                <div className="text-sm mt-2 space-y-1">
                  <p><strong>Pasos para solucionar:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Abrir una terminal y ejecutar: <code className="bg-red-100 px-2 py-1 rounded">cd takemlink/backend</code></li>
                    <li>Iniciar el servidor: <code className="bg-red-100 px-2 py-1 rounded">npm start</code></li>
                    <li>Esperar a ver el mensaje de que el servidor está corriendo</li>
                    <li>Recargar esta página e intentar nuevamente</li>
                  </ol>
                </div>
              )}
              <div className="mt-3 p-3 bg-red-100 rounded-lg text-xs">
                <p className="font-bold mb-1">💡 Para obtener ayuda:</p>
                <p>1. Presiona <strong>F12</strong> en tu navegador</p>
                <p>2. Ve a la pestaña <strong>"Console"</strong></p>
                <p>3. Copia todos los mensajes que aparecen (especialmente los rojos)</p>
                <p>4. También revisa la terminal donde corre el servidor backend</p>
              </div>
            </div>
          )}

          {/* Botón de Registro */}
          <button
            type="submit"
            disabled={loading || !formData.nombre || !formData.tipo || !formData.email || !formData.zonaAccion || formData.residuosGestionados.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 px-6 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all transform hover:scale-105"
          >
            {loading ? '⏳ Registrando...' : '🚀 Completar Registro Institucional'}
          </button>
        </form>

        {/* Información Adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
            <div className="font-bold text-blue-800 mb-1">📊 Dashboard Completo</div>
            <div className="text-blue-600">Métricas de impacto en tiempo real</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
            <div className="font-bold text-blue-800 mb-1">🗺️ Mapa Interactivo</div>
            <div className="text-blue-600">Visualice zonas críticas y progreso</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
            <div className="font-bold text-blue-800 mb-1">📈 Reportes Automáticos</div>
            <div className="text-blue-600">Genere reportes de impacto ambiental</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroInstitucion;


