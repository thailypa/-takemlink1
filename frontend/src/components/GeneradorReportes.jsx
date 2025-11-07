import React, { useState } from 'react';

const GeneradorReportes = () => {
  const [configReporte, setConfigReporte] = useState({
    tipo: 'mensual',
    periodo: '2024-01',
    metricas: ['residuos', 'co2', 'participantes', 'actividades'],
    formato: 'pdf',
    incluirGraficos: true,
    detalleZonas: true
  });

  const tiposReporte = [
    {
      id: 'mensual',
      nombre: '📅 Reporte Mensual',
      descripcion: 'Resumen completo del mes'
    },
    {
      id: 'trimestral',
      nombre: '📊 Reporte Trimestral',
      descripcion: 'Análisis trimestral de tendencias'
    },
    {
      id: 'anual',
      nombre: '📈 Reporte Anual',
      descripcion: 'Reporte completo del año'
    },
    {
      id: 'zonas_criticas',
      nombre: '🚨 Zonas Críticas',
      descripcion: 'Análisis de áreas problemáticas'
    },
    {
      id: 'impacto_ambiental',
      nombre: '🌱 Impacto Ambiental',
      descripcion: 'Métricas de sostenibilidad'
    }
  ];

  const metricasDisponibles = [
    { id: 'residuos', nombre: '🗑️ Residuos Recolectados', checked: true },
    { id: 'co2', nombre: '🌱 CO₂ Evitado', checked: true },
    { id: 'participantes', nombre: '👥 Participantes', checked: true },
    { id: 'actividades', nombre: '📋 Actividades', checked: true },
    { id: 'comunidades', nombre: '🏘️ Comunidades', checked: false },
    { id: 'costos', nombre: '💰 Análisis de Costos', checked: false },
    { id: 'eficiencia', nombre: '⚡ Eficiencia Operativa', checked: false }
  ];

  const generarReporte = () => {
    // Simular generación de reporte
    console.log('Generando reporte con configuración:', configReporte);
    
    // Aquí iría la lógica real de generación de reportes
    alert(`📄 Reporte ${configReporte.tipo} generado exitosamente!\nSe descargará en formato ${configReporte.formato.toUpperCase()}`);
  };

  const toggleMetrica = (metricaId) => {
    setConfigReporte(prev => ({
      ...prev,
      metricas: prev.metricas.includes(metricaId)
        ? prev.metricas.filter(m => m !== metricaId)
        : [...prev.metricas, metricaId]
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">📊 Generador de Reportes</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuración del Reporte */}
        <div className="space-y-6">
          {/* Tipo de Reporte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Reporte
            </label>
            <div className="grid grid-cols-1 gap-3">
              {tiposReporte.map(tipo => (
                <button
                  key={tipo.id}
                  onClick={() => setConfigReporte(prev => ({ ...prev, tipo: tipo.id }))}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    configReporte.tipo === tipo.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{tipo.nombre}</div>
                  <div className="text-sm text-gray-500 mt-1">{tipo.descripcion}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período del Reporte
            </label>
            <select
              value={configReporte.periodo}
              onChange={(e) => setConfigReporte(prev => ({ ...prev, periodo: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2024-01">Enero 2024</option>
              <option value="2023-12">Diciembre 2023</option>
              <option value="2023-11">Noviembre 2023</option>
              <option value="2023-Q4">4to Trimestre 2023</option>
              <option value="2023">Año 2023</option>
            </select>
          </div>

          {/* Formato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de Salida
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['pdf', 'excel', 'html', 'imagen'].map(formato => (
                <button
                  key={formato}
                  onClick={() => setConfigReporte(prev => ({ ...prev, formato }))}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    configReporte.formato === formato
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="font-medium capitalize">{formato}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Métricas y Opciones */}
        <div className="space-y-6">
          {/* Métricas a Incluir */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Métricas a Incluir
            </label>
            <div className="space-y-2">
              {metricasDisponibles.map(metrica => (
                <label key={metrica.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configReporte.metricas.includes(metrica.id)}
                    onChange={() => toggleMetrica(metrica.id)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex-1">{metrica.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Opciones Adicionales */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={configReporte.incluirGraficos}
                onChange={(e) => setConfigReporte(prev => ({ ...prev, incluirGraficos: e.target.checked }))}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>📈 Incluir gráficos y visualizaciones</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={configReporte.detalleZonas}
                onChange={(e) => setConfigReporte(prev => ({ ...prev, detalleZonas: e.target.checked }))}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>🗺️ Incluir desglose por zonas</span>
            </label>
          </div>

          {/* Vista Previa Rápida */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">👀 Vista Previa Rápida</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• Reporte: {tiposReporte.find(t => t.id === configReporte.tipo)?.nombre}</div>
              <div>• Período: {configReporte.periodo}</div>
              <div>• Métricas: {configReporte.metricas.length} seleccionadas</div>
              <div>• Formato: {configReporte.formato.toUpperCase()}</div>
            </div>
          </div>

          {/* Botón de Generación */}
          <button
            onClick={generarReporte}
            disabled={configReporte.metricas.length === 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            🚀 Generar Reporte
          </button>
        </div>
      </div>

      {/* Reportes Recientes */}
      <div className="mt-8 border-t pt-6">
        <h4 className="font-bold text-gray-900 mb-4">📁 Reportes Recientes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { nombre: 'Reporte Mensual Enero', fecha: '2024-01-31', tipo: 'pdf', tamaño: '2.4 MB' },
            { nombre: 'Análisis Zonas Críticas', fecha: '2024-01-28', tipo: 'excel', tamaño: '1.8 MB' },
            { nombre: 'Impacto Ambiental 2023', fecha: '2024-01-15', tipo: 'pdf', tamaño: '5.2 MB' }
          ].map((reporte, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-gray-900">{reporte.nombre}</div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {reporte.tipo.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <div>📅 {reporte.fecha}</div>
                <div>💾 {reporte.tamaño}</div>
              </div>
              <div className="flex space-x-2 mt-3">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition-colors">
                  📥 Descargar
                </button>
                <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm transition-colors">
                  👁️ Ver
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneradorReportes;

