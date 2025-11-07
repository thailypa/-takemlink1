import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const NotificacionesTiempoReal = () => {
  const [alertasNoLeidas, setAlertasNoLeidas] = useState(0);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [alertasRecientes, setAlertasRecientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarAlertasNoLeidas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.GET_ALERTAS}?leida=false`);
      if (response.ok) {
        const datos = await response.json();
        setAlertasNoLeidas(datos.length);
        
        // Obtener las 3 más recientes
        const recientes = datos
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 3);
        setAlertasRecientes(recientes);
      }
    } catch (error) {
      console.error('Error al cargar alertas no leídas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlertasNoLeidas();
    
    // Actualizar cada 10 segundos
    const intervalo = setInterval(() => {
      cargarAlertasNoLeidas();
    }, 10000);
    
    return () => clearInterval(intervalo);
  }, []);

  const getColorPrioridad = (prioridad) => {
    const colores = {
      alta: 'bg-red-500',
      media: 'bg-yellow-500',
      baja: 'bg-green-500'
    };
    return colores[prioridad] || 'bg-gray-500';
  };

  const getIconoPrioridad = (prioridad) => {
    const iconos = {
      alta: '🚨',
      media: '⚠️',
      baja: 'ℹ️'
    };
    return iconos[prioridad] || '📌';
  };

  const marcarComoLeida = async (id) => {
    try {
      const response = await fetch(API_ENDPOINTS.PUT_ALERTA_LEIDA(id), {
        method: 'PUT'
      });
      if (response.ok) {
        cargarAlertasNoLeidas();
      }
    } catch (error) {
      console.error('Error al marcar alerta como leída:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setMostrarDropdown(!mostrarDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <div className="relative">
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
            />
          </svg>
          {alertasNoLeidas > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {alertasNoLeidas > 9 ? '9+' : alertasNoLeidas}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown de Notificaciones */}
      {mostrarDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setMostrarDropdown(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-20 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">🔔 Notificaciones</h3>
                {alertasNoLeidas > 0 && (
                  <span className="bg-white text-blue-600 px-2 py-1 rounded-full text-xs font-bold">
                    {alertasNoLeidas} nueva{alertasNoLeidas > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-gray-500">Cargando...</p>
                </div>
              ) : alertasRecientes.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔔</div>
                  <p className="text-sm text-gray-500">No hay notificaciones nuevas</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {alertasRecientes.map(alerta => (
                    <div 
                      key={alerta.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !alerta.leida ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (!alerta.leida) {
                          marcarComoLeida(alerta.id);
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${getColorPrioridad(alerta.prioridad)}`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{getIconoPrioridad(alerta.prioridad)}</span>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {alerta.titulo || alerta.mensaje}
                            </p>
                            {!alerta.leida && (
                              <span className="flex-shrink-0 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                Nueva
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {alerta.descripcion || alerta.mensaje}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {new Date(alerta.fecha).toLocaleDateString()}
                            </span>
                            {alerta.zona && (
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                                📍 {alerta.zona}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setMostrarDropdown(false);
                  // Aquí podrías navegar a la vista de alertas
                  window.location.hash = '#alertas';
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver todas las alertas →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificacionesTiempoReal;

