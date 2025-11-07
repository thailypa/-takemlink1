import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const SistemaAlertas = () => {
  const [alertas, setAlertas] = useState([]);
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');
  const [filtroLeidas, setFiltroLeidas] = useState('todas');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    umbralCritico: 1000,
    umbralAdvertencia: 500,
    notificacionesEmail: true,
    notificacionesPush: false
  });
  const [nuevaAlerta, setNuevaAlerta] = useState({
    tipo: 'zona_critica',
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    zona: '',
    accion: 'monitorear',
    metricas: {}
  });
  const [loading, setLoading] = useState(false);

  // Cargar alertas desde el backend
  const cargarAlertas = async () => {
    setLoading(true);
    try {
      let url = API_ENDPOINTS.GET_ALERTAS;
      const params = new URLSearchParams();
      
      if (filtroPrioridad !== 'todas') {
        params.append('prioridad', filtroPrioridad);
      }
      
      if (filtroLeidas !== 'todas') {
        params.append('leida', filtroLeidas === 'leidas' ? 'true' : 'false');
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const datos = await response.json();
        setAlertas(datos);
      }
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar configuración
  const cargarConfiguracion = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_CONFIG_ALERTAS);
      if (response.ok) {
        const datos = await response.json();
        setConfiguracion(datos);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  };

  useEffect(() => {
    cargarAlertas();
    cargarConfiguracion();
  }, [filtroPrioridad, filtroLeidas]);

  const marcarComoLeida = async (id) => {
    try {
      const response = await fetch(API_ENDPOINTS.PUT_ALERTA_LEIDA(id), {
        method: 'PUT'
      });
      if (response.ok) {
        cargarAlertas();
      }
    } catch (error) {
      console.error('Error al marcar alerta como leída:', error);
    }
  };

  const eliminarAlerta = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta alerta?')) {
      return;
    }
    
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_ALERTA(id), {
        method: 'DELETE'
      });
      if (response.ok) {
        cargarAlertas();
      }
    } catch (error) {
      console.error('Error al eliminar alerta:', error);
    }
  };

  const crearAlerta = async () => {
    if (!nuevaAlerta.titulo || !nuevaAlerta.descripcion) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.POST_ALERTA, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaAlerta),
      });

      if (response.ok) {
        setMostrarFormulario(false);
        setNuevaAlerta({
          tipo: 'zona_critica',
          titulo: '',
          descripcion: '',
          prioridad: 'media',
          zona: '',
          accion: 'monitorear',
          metricas: {}
        });
        cargarAlertas();
      }
    } catch (error) {
      console.error('Error al crear alerta:', error);
    }
  };

  const actualizarConfiguracion = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PUT_CONFIG_ALERTAS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configuracion),
      });

      if (response.ok) {
        alert('Configuración actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
    }
  };

  const getColorPrioridad = (prioridad) => {
    const colores = {
      alta: 'bg-red-100 text-red-800 border-red-300',
      media: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      baja: 'bg-green-100 text-green-800 border-green-300'
    };
    return colores[prioridad] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getIconoPrioridad = (prioridad) => {
    const iconos = {
      alta: '🚨',
      media: '⚠️',
      baja: 'ℹ️'
    };
    return iconos[prioridad] || '📌';
  };

  const getTipoAlerta = (tipo) => {
    const tipos = {
      zona_critica: 'Zona Crítica',
      baja_participacion: 'Baja Participación',
      meta_superada: 'Meta Superada',
      logro: 'Logro',
      sistema: 'Sistema'
    };
    return tipos[tipo] || tipo;
  };

  const alertasNoLeidas = alertas.filter(a => !a.leida).length;

  return (
    <div className="space-y-6">
      {/* Header y Controles */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">🚨 Sistema de Alertas Inteligentes</h3>
          {alertasNoLeidas > 0 && (
            <p className="text-sm text-red-600 mt-1">
              {alertasNoLeidas} alerta{alertasNoLeidas > 1 ? 's' : ''} sin leer
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setMostrarFormulario(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Nueva Alerta
          </button>
          <button 
            onClick={() => {
              const modal = document.getElementById('configModal');
              if (modal) modal.showModal();
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ⚙️ Configuración
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Prioridad
            </label>
            <select
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Estado
            </label>
            <select
              value={filtroLeidas}
              onChange={(e) => setFiltroLeidas(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas</option>
              <option value="no_leidas">No Leídas</option>
              <option value="leidas">Leídas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Formulario de Nueva Alerta */}
      {mostrarFormulario && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">➕ Crear Nueva Alerta</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                <input
                  type="text"
                  value={nuevaAlerta.titulo}
                  onChange={(e) => setNuevaAlerta({...nuevaAlerta, titulo: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Acumulación crítica en Zona Norte"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zona</label>
                <input
                  type="text"
                  value={nuevaAlerta.zona}
                  onChange={(e) => setNuevaAlerta({...nuevaAlerta, zona: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Zona Norte"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea
                value={nuevaAlerta.descripcion}
                onChange={(e) => setNuevaAlerta({...nuevaAlerta, descripcion: e.target.value})}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción detallada de la alerta..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={nuevaAlerta.tipo}
                  onChange={(e) => setNuevaAlerta({...nuevaAlerta, tipo: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="zona_critica">Zona Crítica</option>
                  <option value="baja_participacion">Baja Participación</option>
                  <option value="meta_superada">Meta Superada</option>
                  <option value="logro">Logro</option>
                  <option value="sistema">Sistema</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                <select
                  value={nuevaAlerta.prioridad}
                  onChange={(e) => setNuevaAlerta({...nuevaAlerta, prioridad: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Acción Requerida</label>
                <select
                  value={nuevaAlerta.accion}
                  onChange={(e) => setNuevaAlerta({...nuevaAlerta, accion: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monitorear">Monitorear</option>
                  <option value="requiere_intervencion">Requiere Intervención</option>
                  <option value="contactar_lider">Contactar Líder</option>
                  <option value="revisar_metrica">Revisar Métrica</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={crearAlerta}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Crear Alerta
              </button>
              <button 
                onClick={() => {
                  setMostrarFormulario(false);
                  setNuevaAlerta({
                    tipo: 'zona_critica',
                    titulo: '',
                    descripcion: '',
                    prioridad: 'media',
                    zona: '',
                    accion: 'monitorear',
                    metricas: {}
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Alertas */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando alertas...</p>
        </div>
      ) : alertas.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-4xl mb-4">🔔</div>
          <h4 className="text-lg font-bold text-gray-900 mb-2">No hay alertas</h4>
          <p className="text-gray-600">No se encontraron alertas con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alertas.map(alerta => (
            <div 
              key={alerta.id} 
              className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                alerta.leida ? 'opacity-75' : ''
              } ${
                alerta.prioridad === 'alta' ? 'border-red-500' :
                alerta.prioridad === 'media' ? 'border-yellow-500' : 'border-green-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getIconoPrioridad(alerta.prioridad)}</span>
                    <h4 className="text-lg font-bold text-gray-900">{alerta.titulo}</h4>
                    {!alerta.leida && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Nueva</span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{alerta.descripcion}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColorPrioridad(alerta.prioridad)}`}>
                      {alerta.prioridad.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {getTipoAlerta(alerta.tipo)}
                    </span>
                    {alerta.zona && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        📍 {alerta.zona}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {alerta.accion.replace('_', ' ')}
                    </span>
                  </div>
                  {alerta.metricas && Object.keys(alerta.metricas).length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">📊 Métricas:</div>
                      <div className="text-xs text-gray-600">
                        {Object.entries(alerta.metricas).map(([key, value]) => (
                          <span key={key} className="mr-4">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    📅 {new Date(alerta.fecha).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  {!alerta.leida && (
                    <button
                      onClick={() => marcarComoLeida(alerta.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      ✓ Marcar Leída
                    </button>
                  )}
                  <button
                    onClick={() => eliminarAlerta(alerta.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Configuración */}
      <dialog id="configModal" className="rounded-2xl shadow-2xl p-6 max-w-2xl">
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-gray-900 mb-4">⚙️ Configuración de Alertas</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Umbral Crítico (kg)
            </label>
            <input
              type="number"
              value={configuracion.umbralCritico}
              onChange={(e) => setConfiguracion({...configuracion, umbralCritico: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Alerta de prioridad alta cuando se supera este umbral</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Umbral de Advertencia (kg)
            </label>
            <input
              type="number"
              value={configuracion.umbralAdvertencia}
              onChange={(e) => setConfiguracion({...configuracion, umbralAdvertencia: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Alerta de prioridad media cuando se supera este umbral</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={configuracion.notificacionesEmail}
                onChange={(e) => setConfiguracion({...configuracion, notificacionesEmail: e.target.checked})}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>📧 Notificaciones por Email</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={configuracion.notificacionesPush}
                onChange={(e) => setConfiguracion({...configuracion, notificacionesPush: e.target.checked})}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>📱 Notificaciones Push</span>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => {
                actualizarConfiguracion();
                document.getElementById('configModal').close();
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Guardar Configuración
            </button>
            <button
              onClick={() => {
                document.getElementById('configModal').close();
                cargarConfiguracion();
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SistemaAlertas;

