import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import MapaInteractivo from '../components/MapaInteractivo';
import GeneradorReportes from '../components/GeneradorReportes';
import GestionComunidades from '../components/GestionComunidades';
import SistemaAlertas from '../components/SistemaAlertas';
import NotificacionesTiempoReal from '../components/NotificacionesTiempoReal';

const DashboardInstitucion = ({ onVolver, institucion }) => {
  const [metricas, setMetricas] = useState({
    totalRecolectado: 0,
    co2Evitado: 0,
    familiasBeneficiadas: 0,
    actividadesRealizadas: 0,
    comunidadesActivas: 0,
    usuariosActivos: 0,
    residuosPorTipo: {
      plastico: 0,
      vidrio: 0,
      carton: 0,
      organico: 0,
      metal: 0,
      electronico: 0
    },
    tendenciaMensual: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [vistaActual, setVistaActual] = useState('general');
  const [comunidades, setComunidades] = useState([
    { nombre: 'Comunidad Norte', activos: 45, recolectado: 2500, nivel: 'alto' },
    { nombre: 'Zona Sur', activos: 32, recolectado: 1800, nivel: 'medio' },
    { nombre: 'Barrio Este', activos: 28, recolectado: 1500, nivel: 'medio' },
    { nombre: 'Área Oeste', activos: 15, recolectado: 800, nivel: 'bajo' },
    { nombre: 'Centro Ciudad', activos: 38, recolectado: 2100, nivel: 'alto' }
  ]);

  const [alertas, setAlertas] = useState([
    { id: 1, tipo: 'zona_critica', mensaje: 'Zona Norte requiere limpieza urgente', prioridad: 'alta' },
    { id: 2, tipo: 'baja_participacion', mensaje: 'Comunidad Oeste con baja actividad', prioridad: 'media' },
    { id: 3, tipo: 'logro', mensaje: 'Meta mensual superada en 25%', prioridad: 'baja' }
  ]);

  // Cargar métricas desde el backend
  const cargarMetricas = async () => {
    if (!institucion?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.GET_METRICAS_INSTITUCION(institucion.id));
      if (!response.ok) {
        throw new Error('Error al cargar métricas');
      }
      const datosMetricas = await response.json();
      
      // Calcular residuos por tipo basado en el total recolectado
      // Si no hay datos, usar valores por defecto
      const total = datosMetricas.totalRecolectado || 0;
      const residuosPorTipo = total > 0 ? {
        plastico: Math.floor(total * 0.42),
        vidrio: Math.floor(total * 0.14),
        carton: Math.floor(total * 0.25),
        organico: Math.floor(total * 0.12),
        metal: Math.floor(total * 0.05),
        electronico: Math.floor(total * 0.02)
      } : {
        plastico: 0,
        vidrio: 0,
        carton: 0,
        organico: 0,
        metal: 0,
        electronico: 0
      };

      setMetricas({
        ...datosMetricas,
        residuosPorTipo
      });
      setError(null);
    } catch (err) {
      console.error('Error al cargar métricas:', err);
      setError('No se pudieron cargar las métricas. Usando datos de ejemplo.');
      // Mantener datos por defecto si hay error
      setMetricas({
        totalRecolectado: 12500,
        co2Evitado: 25.6,
        familiasBeneficiadas: 450,
        actividadesRealizadas: 28,
        comunidadesActivas: 12,
        usuariosActivos: 1250,
        residuosPorTipo: {
          plastico: 5200,
          vidrio: 1800,
          carton: 3100,
          organico: 1500,
          metal: 600,
          electronico: 300
        },
        tendenciaMensual: [
          { mes: 'Ene', recolectado: 800, co2: 1.6 },
          { mes: 'Feb', recolectado: 950, co2: 1.9 },
          { mes: 'Mar', recolectado: 1100, co2: 2.2 },
          { mes: 'Abr', recolectado: 1300, co2: 2.6 },
          { mes: 'May', recolectado: 1500, co2: 3.0 },
          { mes: 'Jun', recolectado: 1800, co2: 3.6 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar métricas al montar y actualizar periódicamente
  useEffect(() => {
    cargarMetricas();
    
    const intervalo = setInterval(() => {
      cargarMetricas();
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(intervalo);
  }, [institucion?.id]);

  const calcularPorcentaje = (valor, total) => {
    if (total === 0) return '0.0';
    return ((valor / total) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onVolver}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Volver
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Panel de Gestión Institucional 🏛️
                </h1>
                <p className="text-gray-600">
                  {institucion?.nombre || 'Institución Registrada'} • {institucion?.zonaAccion || 'Zona de acción'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificacionesTiempoReal />
              <div className="text-right">
                <div className="text-sm text-gray-500">Actualizado ahora</div>
                <div className="text-lg font-bold text-blue-600">
                  {metricas.usuariosActivos.toLocaleString()} usuarios
                </div>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <div className="border-t border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'general', label: '📊 Vista General', emoji: '📊' },
                { id: 'mapa', label: '🗺️ Mapa Interactivo', emoji: '🗺️' },
                { id: 'comunidades', label: '👥 Comunidades', emoji: '👥' },
                { id: 'reportes', label: '📈 Reportes', emoji: '📈' },
                { id: 'alertas', label: '🚨 Alertas', emoji: '🚨' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setVistaActual(item.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    vistaActual === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Mensaje de Error */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-2xl">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Cargando métricas...</p>
          </div>
        )}

        {/* Renderizar vista según selección */}
        {vistaActual === 'mapa' ? (
          <MapaInteractivo />
        ) : vistaActual === 'general' ? (
          <>
            {/* Alertas Urgentes */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alertas.map(alerta => (
              <div key={alerta.id} className={`p-4 rounded-lg border-l-4 ${
                alerta.prioridad === 'alta' 
                  ? 'bg-red-50 border-red-400' 
                  : alerta.prioridad === 'media'
                  ? 'bg-yellow-50 border-yellow-400'
                  : 'bg-green-50 border-green-400'
              }`}>
                <div className="flex items-center">
                  <span className="text-lg mr-2">
                    {alerta.prioridad === 'alta' ? '🚨' : alerta.prioridad === 'media' ? '⚠️' : '✅'}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">{alerta.mensaje}</div>
                    <div className="text-sm text-gray-500 capitalize">{alerta.tipo.replace('_', ' ')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl mr-4">
                <span className="text-2xl">🗑️</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(metricas.totalRecolectado / 1000).toFixed(1)}T
                </div>
                <div className="text-sm text-gray-500">Total Recolectado</div>
                <div className="text-xs text-green-600 font-medium">+12.5% este mes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl mr-4">
                <span className="text-2xl">🌱</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {metricas.co2Evitado.toFixed(1)}T
                </div>
                <div className="text-sm text-gray-500">CO₂ Evitado</div>
                <div className="text-xs text-blue-600 font-medium">Equivale a 520 árboles</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl mr-4">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {metricas.familiasBeneficiadas}
                </div>
                <div className="text-sm text-gray-500">Familias Beneficiadas</div>
                <div className="text-xs text-purple-600 font-medium">+45 este trimestre</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl mr-4">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {metricas.actividadesRealizadas}
                </div>
                <div className="text-sm text-gray-500">Actividades Realizadas</div>
                <div className="text-xs text-orange-600 font-medium">5 en curso</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Distribución de Residuos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                📦 Distribución por Tipo de Residuo
              </h3>
              <div className="space-y-4">
                {Object.entries(metricas.residuosPorTipo).map(([tipo, cantidad]) => (
                  <div key={tipo} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">
                        {tipo === 'plastico' && '🥤'}
                        {tipo === 'vidrio' && '🍶'}
                        {tipo === 'carton' && '📦'}
                        {tipo === 'organico' && '🍂'}
                        {tipo === 'metal' && '🥫'}
                        {tipo === 'electronico' && '📱'}
                      </span>
                      <span className="font-medium capitalize">{tipo}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full"
                          style={{ 
                            width: `${calcularPorcentaje(cantidad, metricas.totalRecolectado)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {calcularPorcentaje(cantidad, metricas.totalRecolectado)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ranking de Comunidades */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                🏆 Comunidades Más Activas
              </h3>
              <div className="space-y-4">
                {comunidades.sort((a, b) => b.recolectado - a.recolectado).map((comunidad, index) => (
                  <div key={comunidad.nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{comunidad.nombre}</div>
                        <div className="text-xs text-gray-500">{comunidad.activos} usuarios</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{(comunidad.recolectado / 1000).toFixed(1)}T</div>
                      <div className={`text-xs font-medium ${
                        comunidad.nivel === 'alto' ? 'text-green-600' :
                        comunidad.nivel === 'medio' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {comunidad.nivel === 'alto' ? 'Alto' : comunidad.nivel === 'medio' ? 'Medio' : 'Bajo'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Tendencia */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            📈 Tendencia Mensual de Recolección
          </h3>
          <div className="flex items-end space-x-2 h-40">
            {metricas.tendenciaMensual.map((mes, index) => (
              <div key={mes.mes} className="flex-1 flex flex-col items-center">
                <div 
                  className="bg-gradient-to-t from-green-400 to-green-600 rounded-t w-full max-w-16 transition-all hover:opacity-80 cursor-pointer"
                  style={{ height: `${(mes.recolectado / 2000) * 100}%` }}
                  title={`${mes.recolectado}kg - ${mes.co2}T CO₂`}
                ></div>
                <div className="text-xs text-gray-500 mt-2">{mes.mes}</div>
                <div className="text-xs font-medium text-green-600">
                  {(mes.recolectado / 1000).toFixed(1)}T
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl text-center transition-colors">
            <div className="text-2xl mb-2">📥</div>
            <div className="font-medium">Importar Datos</div>
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl text-center transition-colors">
            <div className="text-2xl mb-2">📄</div>
            <div className="font-medium">Generar Reporte</div>
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-2xl text-center transition-colors">
            <div className="text-2xl mb-2">👥</div>
            <div className="font-medium">Gestionar Comunidades</div>
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl text-center transition-colors">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium">Crear Campaña</div>
          </button>
        </div>
          </>
        ) : vistaActual === 'comunidades' ? (
          <GestionComunidades />
        ) : vistaActual === 'reportes' ? (
          <GeneradorReportes />
        ) : vistaActual === 'alertas' ? (
          <SistemaAlertas />
        ) : (
          <>
            {/* Vista General por defecto */}
            {/* Alertas Urgentes */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {alertas.map(alerta => (
                  <div key={alerta.id} className={`p-4 rounded-lg border-l-4 ${
                    alerta.prioridad === 'alta' 
                      ? 'bg-red-50 border-red-400' 
                      : alerta.prioridad === 'media'
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-green-50 border-green-400'
                  }`}>
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {alerta.prioridad === 'alta' ? '🚨' : alerta.prioridad === 'media' ? '⚠️' : '✅'}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900">{alerta.mensaje}</div>
                        <div className="text-sm text-gray-500 capitalize">{alerta.tipo.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-xl mr-4">
                    <span className="text-2xl">🗑️</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {(metricas.totalRecolectado / 1000).toFixed(1)}T
                    </div>
                    <div className="text-sm text-gray-500">Total Recolectado</div>
                    <div className="text-xs text-green-600 font-medium">+12.5% este mes</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-xl mr-4">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {metricas.co2Evitado.toFixed(1)}T
                    </div>
                    <div className="text-sm text-gray-500">CO₂ Evitado</div>
                    <div className="text-xs text-blue-600 font-medium">Equivale a 520 árboles</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-xl mr-4">
                    <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {metricas.familiasBeneficiadas}
                    </div>
                    <div className="text-sm text-gray-500">Familias Beneficiadas</div>
                    <div className="text-xs text-purple-600 font-medium">+45 este trimestre</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-xl mr-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {metricas.actividadesRealizadas}
                    </div>
                    <div className="text-sm text-gray-500">Actividades Realizadas</div>
                    <div className="text-xs text-orange-600 font-medium">5 en curso</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Distribución de Residuos */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    📦 Distribución por Tipo de Residuo
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(metricas.residuosPorTipo).map(([tipo, cantidad]) => (
                      <div key={tipo} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">
                            {tipo === 'plastico' && '🥤'}
                            {tipo === 'vidrio' && '🍶'}
                            {tipo === 'carton' && '📦'}
                            {tipo === 'organico' && '🍂'}
                            {tipo === 'metal' && '🥫'}
                            {tipo === 'electronico' && '📱'}
                          </span>
                          <span className="font-medium capitalize">{tipo}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-500 h-3 rounded-full"
                              style={{ 
                                width: `${calcularPorcentaje(cantidad, metricas.totalRecolectado)}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-16 text-right">
                            {calcularPorcentaje(cantidad, metricas.totalRecolectado)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ranking de Comunidades */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    🏆 Comunidades Más Activas
                  </h3>
                  <div className="space-y-4">
                    {comunidades.sort((a, b) => b.recolectado - a.recolectado).map((comunidad, index) => (
                      <div key={comunidad.nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{comunidad.nombre}</div>
                            <div className="text-xs text-gray-500">{comunidad.activos} usuarios</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{(comunidad.recolectado / 1000).toFixed(1)}T</div>
                          <div className={`text-xs font-medium ${
                            comunidad.nivel === 'alto' ? 'text-green-600' :
                            comunidad.nivel === 'medio' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {comunidad.nivel === 'alto' ? 'Alto' : comunidad.nivel === 'medio' ? 'Medio' : 'Bajo'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico de Tendencia */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                📈 Tendencia Mensual de Recolección
              </h3>
              <div className="flex items-end space-x-2 h-40">
                {metricas.tendenciaMensual.map((mes, index) => (
                  <div key={mes.mes} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-green-400 to-green-600 rounded-t w-full max-w-16 transition-all hover:opacity-80 cursor-pointer"
                      style={{ height: `${(mes.recolectado / 2000) * 100}%` }}
                      title={`${mes.recolectado}kg - ${mes.co2}T CO₂`}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">{mes.mes}</div>
                    <div className="text-xs font-medium text-green-600">
                      {(mes.recolectado / 1000).toFixed(1)}T
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl text-center transition-colors">
                <div className="text-2xl mb-2">📥</div>
                <div className="font-medium">Importar Datos</div>
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl text-center transition-colors">
                <div className="text-2xl mb-2">📄</div>
                <div className="font-medium">Generar Reporte</div>
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-2xl text-center transition-colors">
                <div className="text-2xl mb-2">👥</div>
                <div className="font-medium">Gestionar Comunidades</div>
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl text-center transition-colors">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-medium">Crear Campaña</div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardInstitucion;


