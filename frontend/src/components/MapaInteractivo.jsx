import React, { useState, useEffect } from 'react';

const MapaInteractivo = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [filtro, setFiltro] = useState('todas');
  const [nivelZoom, setNivelZoom] = useState(1);

  // Datos de ejemplo para las zonas
  const zonas = [
    {
      id: 1,
      nombre: 'Zona Norte',
      tipo: 'critica',
      residuos: 1250,
      participantes: 45,
      nivelContaminacion: 'alto',
      coordenadas: { x: 30, y: 20, ancho: 25, alto: 30 },
      alertas: ['Acumulación plásticos', 'Falta recolección'],
      ultimaActividad: '2024-01-15'
    },
    {
      id: 2,
      nombre: 'Zona Centro',
      tipo: 'estable',
      residuos: 800,
      participantes: 38,
      nivelContaminacion: 'medio',
      coordenadas: { x: 40, y: 40, ancho: 20, alto: 25 },
      alertas: ['Participación estable'],
      ultimaActividad: '2024-01-20'
    },
    {
      id: 3,
      nombre: 'Zona Sur',
      tipo: 'limpia',
      residuos: 450,
      participantes: 32,
      nivelContaminacion: 'bajo',
      coordenadas: { x: 25, y: 60, ancho: 30, alto: 25 },
      alertas: ['Ejemplo comunidad'],
      ultimaActividad: '2024-01-18'
    },
    {
      id: 4,
      nombre: 'Zona Este',
      tipo: 'critica',
      residuos: 1800,
      participantes: 28,
      nivelContaminacion: 'alto',
      coordenadas: { x: 65, y: 30, ancho: 25, alto: 35 },
      alertas: ['Residuos electrónicos', 'Baja participación'],
      ultimaActividad: '2024-01-10'
    },
    {
      id: 5,
      nombre: 'Zona Oeste',
      tipo: 'mejorando',
      residuos: 600,
      participantes: 15,
      nivelContaminacion: 'medio',
      coordenadas: { x: 10, y: 45, ancho: 20, alto: 20 },
      alertas: ['En progreso'],
      ultimaActividad: '2024-01-22'
    }
  ];

  const getColorZona = (tipo) => {
    const colores = {
      critica: 'bg-red-500 border-red-700',
      estable: 'bg-yellow-500 border-yellow-700',
      limpia: 'bg-green-500 border-green-700',
      mejorando: 'bg-blue-500 border-blue-700'
    };
    return colores[tipo] || 'bg-gray-500';
  };

  const getIconoContaminacion = (nivel) => {
    const iconos = {
      alto: '🔴',
      medio: '🟡',
      bajo: '🟢'
    };
    return iconos[nivel] || '⚪';
  };

  const zonasFiltradas = filtro === 'todas' 
    ? zonas 
    : zonas.filter(zona => zona.tipo === filtro);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header del Mapa */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">🗺️ Mapa Interactivo de Zonas</h3>
        <div className="flex items-center space-x-4">
          {/* Filtros */}
          <select 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="todas">Todas las zonas</option>
            <option value="critica">Zonas críticas</option>
            <option value="estable">Zonas estables</option>
            <option value="limpia">Zonas limpias</option>
            <option value="mejorando">Zonas mejorando</option>
          </select>

          {/* Controles de Zoom */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setNivelZoom(prev => Math.max(0.5, prev - 0.1))}
              className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center"
            >
              −
            </button>
            <span className="text-sm text-gray-600">{Math.round(nivelZoom * 100)}%</span>
            <button 
              onClick={() => setNivelZoom(prev => Math.min(2, prev + 0.1))}
              className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex space-x-6">
        {/* Mapa */}
        <div className="flex-1 relative">
          <div 
            className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl border-2 border-gray-300 relative overflow-hidden"
            style={{ height: '500px', transform: `scale(${nivelZoom})`, transformOrigin: 'top left' }}
          >
            {/* Leyenda */}
            <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg z-10">
              <div className="text-sm font-medium mb-2">Leyenda:</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Crítica</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Estable</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Limpia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Mejorando</span>
                </div>
              </div>
            </div>

            {/* Zonas del Mapa */}
            {zonasFiltradas.map(zona => (
              <div
                key={zona.id}
                className={`absolute border-2 cursor-pointer transition-all hover:shadow-lg hover:z-10 ${
                  getColorZona(zona.tipo)
                } ${zonaSeleccionada?.id === zona.id ? 'ring-4 ring-purple-400 ring-opacity-50' : ''}`}
                style={{
                  left: `${zona.coordenadas.x}%`,
                  top: `${zona.coordenadas.y}%`,
                  width: `${zona.coordenadas.ancho}%`,
                  height: `${zona.coordenadas.alto}%`,
                  opacity: zonaSeleccionada && zonaSeleccionada.id !== zona.id ? 0.6 : 1
                }}
                onClick={() => setZonaSeleccionada(zona)}
              >
                <div className="p-2 text-white text-sm">
                  <div className="font-bold">{zona.nombre}</div>
                  <div className="flex items-center space-x-1">
                    <span>{getIconoContaminacion(zona.nivelContaminacion)}</span>
                    <span>{(zona.residuos / 1000).toFixed(1)}T</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Puntos de interés */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
                <div className="text-lg font-bold">🌆 Ciudad Central</div>
                <div className="text-sm text-gray-600">Área metropolitana</div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Información de Zona */}
        <div className="w-80">
          {zonaSeleccionada ? (
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                {zonaSeleccionada.nombre}
              </h4>
              
              <div className="space-y-4">
                {/* Estado */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                    zonaSeleccionada.tipo === 'critica' ? 'bg-red-500' :
                    zonaSeleccionada.tipo === 'estable' ? 'bg-yellow-500' :
                    zonaSeleccionada.tipo === 'limpia' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {zonaSeleccionada.tipo.charAt(0).toUpperCase() + zonaSeleccionada.tipo.slice(1)}
                  </span>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {(zonaSeleccionada.residuos / 1000).toFixed(1)}T
                    </div>
                    <div className="text-xs text-gray-500">Residuos</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {zonaSeleccionada.participantes}
                    </div>
                    <div className="text-xs text-gray-500">Participantes</div>
                  </div>
                </div>

                {/* Alertas */}
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">🚨 Alertas Activas:</h5>
                  <div className="space-y-2">
                    {zonaSeleccionada.alertas.map((alerta, index) => (
                      <div key={index} className="bg-white p-2 rounded-lg text-sm border-l-4 border-yellow-400">
                        {alerta}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Última Actividad */}
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">📅 Última Actividad:</h5>
                  <div className="text-sm text-gray-600">
                    {new Date(zonaSeleccionada.ultimaActividad).toLocaleDateString()}
                  </div>
                </div>

                {/* Acciones */}
                <div className="space-y-2">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors">
                    📋 Plan de Acción
                  </button>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">
                    👥 Asignar Equipo
                  </button>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors">
                    📊 Ver Reporte Detallado
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300 text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h4 className="text-lg font-bold text-gray-700 mb-2">
                Selecciona una Zona
              </h4>
              <p className="text-gray-500 text-sm">
                Haz clic en cualquier área del mapa para ver información detallada y métricas específicas de esa zona.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapaInteractivo;

