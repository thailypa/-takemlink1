import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import TakiMonito from '../components/TakiMonito';
import PerfilUsuario from '../components/PerfilUsuario';
import CatalogoRecompensas from '../components/CatalogoRecompensas';

const DashboardCiudadano = ({ usuario, onVolver }) => {
  const [estadisticas, setEstadisticas] = useState({
    ecoPuntos: usuario?.ecoPuntos || 0,
    nivel: usuario?.nivel || 'novato',
    residuosRecolectados: {
      plastico: 0,
      vidrio: 0,
      carton: 0,
      organico: 0,
      metal: 0,
      electronico: 0
    },
    ranking: usuario?.ranking || 0,
    retosCompletados: 0,
    proximoNivel: 500,
    progresoNivel: 0
  });

  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [recompensas, setRecompensas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canjes, setCanjes] = useState([]);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);

  const retosDiarios = [
    { id: 1, tipo: 'plastico', cantidad: 2, puntos: 20, completado: false, icono: '🥤' },
    { id: 2, tipo: 'organico', cantidad: 3, puntos: 15, completado: false, icono: '🍂' },
    { id: 3, tipo: 'vidrio', cantidad: 1, puntos: 10, completado: true, icono: '🍶' }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    cargarRecompensas();
    if (usuario?.id) {
      cargarCanjes();
      cargarUsuario();
    }
  }, [usuario?.id]);

  useEffect(() => {
    // Calcular progreso del nivel
    calcularProgresoNivel();
  }, [estadisticas.ecoPuntos, estadisticas.nivel]);

  const cargarRecompensas = async () => {
    try {
      const nivel = estadisticas.nivel || usuario?.nivel || 'novato';
      const response = await fetch(`${API_ENDPOINTS.GET_RECOMPENSAS}?nivel=${nivel}`);
      if (response.ok) {
        const data = await response.json();
        setRecompensas(data);
      }
    } catch (err) {
      console.error('Error al cargar recompensas:', err);
    }
  };

  const cargarCanjes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_CANJES_USUARIO(usuario.id));
      if (response.ok) {
        const data = await response.json();
        setCanjes(data);
      }
    } catch (err) {
      console.error('Error al cargar canjes:', err);
    }
  };

  const cargarUsuario = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_USUARIO(usuario.id));
      if (response.ok) {
        const usuarioActualizado = await response.json();
        setEstadisticas(prev => ({
          ...prev,
          ecoPuntos: usuarioActualizado.ecoPuntos || prev.ecoPuntos,
          nivel: usuarioActualizado.nivel || prev.nivel,
          ranking: usuarioActualizado.ranking || prev.ranking
        }));
      }
    } catch (err) {
      console.error('Error al cargar usuario:', err);
    }
  };

  const calcularProgresoNivel = () => {
    const niveles = {
      'novato': { min: 0, max: 500, nombre: 'guardián' },
      'guardián': { min: 500, max: 1500, nombre: 'líder verde' },
      'líder verde': { min: 1500, max: 3000, nombre: 'héroe ecológico' },
      'héroe ecológico': { min: 3000, max: 5000, nombre: 'leyenda' },
      'leyenda': { min: 5000, max: Infinity, nombre: 'leyenda' }
    };

    const nivelActual = niveles[estadisticas.nivel] || niveles.novato;
    const puntosEnNivel = estadisticas.ecoPuntos - nivelActual.min;
    const puntosNecesarios = nivelActual.max - nivelActual.min;
    const progreso = Math.min((puntosEnNivel / puntosNecesarios) * 100, 100);

    setEstadisticas(prev => ({
      ...prev,
      progresoNivel: Math.max(0, progreso),
      proximoNivel: nivelActual.max
    }));
  };

  const registrarResiduo = async (tipo, cantidad) => {
    if (!usuario?.id) {
      setError('Usuario no identificado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.REGISTRAR_ECOPUNTOS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: usuario.id,
          tipoResiduo: tipo,
          cantidad: cantidad
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar residuo');
      }

      const resultado = await response.json();
      
      setEstadisticas(prev => ({
        ...prev,
        ecoPuntos: resultado.puntosTotales || prev.ecoPuntos + resultado.puntosGanados,
        nivel: resultado.nivel || prev.nivel,
        residuosRecolectados: {
          ...prev.residuosRecolectados,
          [tipo]: (prev.residuosRecolectados[tipo] || 0) + cantidad
        }
      }));

      // Recargar usuario para obtener datos actualizados
      await cargarUsuario();
    } catch (err) {
      setError(err.message || 'Error al registrar residuo');
      console.error('Error al registrar residuo:', err);
    } finally {
      setLoading(false);
    }
  };

  const completarReto = (retoId) => {
    setEstadisticas(prev => ({
      ...prev,
      retosCompletados: prev.retosCompletados + 1
    }));
  };

  const canjearRecompensa = async (recompensaId) => {
    if (!usuario?.id) {
      setError('Usuario no identificado');
      return;
    }

    if (estadisticas.ecoPuntos < recompensas.find(r => r.id === recompensaId)?.puntos) {
      setError('No tienes suficientes EcoPuntos para esta recompensa');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.POST_CANJEAR_RECOMPENSA, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: usuario.id,
          recompensaId: recompensaId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al canjear recompensa');
      }

      const resultado = await response.json();
      
      setEstadisticas(prev => ({
        ...prev,
        ecoPuntos: resultado.puntosRestantes || prev.ecoPuntos
      }));

      // Recargar datos
      await cargarRecompensas();
      await cargarCanjes();
      await cargarUsuario();
      
      alert(`✅ ${resultado.mensaje || 'Recompensa canjeada exitosamente'}`);
    } catch (err) {
      setError(err.message || 'Error al canjear recompensa');
      console.error('Error al canjear recompensa:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIconoResiduo = (tipo) => {
    const iconos = {
      plastico: '🥤',
      vidrio: '🍶',
      carton: '📦',
      organico: '🍂',
      metal: '🥫',
      electronico: '📱'
    };
    return iconos[tipo] || '🗑️';
  };

  const getNombreResiduo = (tipo) => {
    const nombres = {
      plastico: 'Plástico',
      vidrio: 'Vidrio',
      carton: 'Cartón',
      organico: 'Orgánico',
      metal: 'Metal',
      electronico: 'Electrónico'
    };
    return nombres[tipo] || tipo;
  };

  // Si se muestra el perfil, renderizar componente de perfil
  if (mostrarPerfil) {
    return (
      <PerfilUsuario
        usuario={usuario}
        estadisticas={estadisticas}
        onVolver={() => setMostrarPerfil(false)}
      />
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onVolver}
                className="text-green-600 hover:text-green-800 text-lg"
              >
                ←
              </button>
              <div>
                <h1 className="text-2xl font-bold text-green-800"># Soy CIU</h1>
                <p className="text-gray-600">¡Hola, {usuario?.nombre || 'Usuario'}! 🌱</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMostrarCatalogo(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>🎁</span>
                <span>Catálogo de Puntos</span>
              </button>
              <button
                onClick={() => setMostrarPerfil(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>👤</span>
                <span>Mi Perfil</span>
              </button>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{estadisticas.ecoPuntos}</div>
                <div className="text-sm text-gray-500">EcoPuntos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Mensaje de Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda - Taki y Progreso */}
          <div className="space-y-6">
            {/* Taki Monito de la Selva */}
            <TakiMonito 
              ecoPuntos={estadisticas.ecoPuntos}
              nivel={estadisticas.nivel}
              onRegistrarResiduo={registrarResiduo}
            />

            {/* Nivel y Progreso */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">📊 Tu Progreso</h3>
              
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-green-600 mb-2 capitalize">{estadisticas.nivel}</div>
                <div className="text-sm text-gray-500">Nivel Actual</div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progreso al siguiente nivel</span>
                  <span>{Math.round(estadisticas.progresoNivel)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${estadisticas.progresoNivel}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {estadisticas.ecoPuntos} / {estadisticas.proximoNivel} puntos
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-xl font-bold text-green-600">#{estadisticas.ranking}</div>
                  <div className="text-xs text-gray-600">Ranking</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{estadisticas.retosCompletados}</div>
                  <div className="text-xs text-gray-600">Retos</div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Central - Modo Juego Principal */}
          <div className="lg:col-span-2">
            {/* Banner Principal */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white mb-6">
              <h2 className="text-3xl font-bold mb-2">Únete al modo juego</h2>
              <p className="text-green-100 mb-6">Convierte el reciclaje en una aventura divertida</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Checklist */}
                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                  <h4 className="font-bold mb-3">Tu progreso:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        mostrarRegistro ? 'bg-green-500' : 'bg-white bg-opacity-30'
                      }`}>
                        {mostrarRegistro ? '✓' : ''}
                      </div>
                      <span className={mostrarRegistro ? 'line-through opacity-70' : ''}>
                        Registra tus residuos
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        ✓
                      </div>
                      <span>Gana puntos y recompensas</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        ✓
                      </div>
                      <span>Sube de nivel</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        ✓
                      </div>
                      <span>Compite con amigos</span>
                    </div>
                  </div>
                </div>

                {/* Acción Principal */}
                <div className="flex flex-col justify-center items-center">
                  <button
                    onClick={() => setMostrarRegistro(true)}
                    disabled={loading}
                    className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition-colors mb-4 disabled:opacity-50"
                  >
                    🗑️ Registrar Residuos
                  </button>
                  <p className="text-green-100 text-sm text-center">
                    Comienza registrando tu primer residuo
                  </p>
                </div>
              </div>
            </div>

            {/* Panel de Registro Rápido */}
            {mostrarRegistro && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🗑️ Registrar Residuos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { tipo: 'plastico', nombre: 'Plástico', icono: '🥤', puntos: 10 },
                    { tipo: 'vidrio', nombre: 'Vidrio', icono: '🍶', puntos: 10 },
                    { tipo: 'carton', nombre: 'Cartón', icono: '📦', puntos: 10 },
                    { tipo: 'organico', nombre: 'Orgánico', icono: '🍂', puntos: 5 },
                    { tipo: 'metal', nombre: 'Metal', icono: '🥫', puntos: 12 },
                    { tipo: 'electronico', nombre: 'Electrónico', icono: '📱', puntos: 15 }
                  ].map((residuo) => (
                    <button
                      key={residuo.tipo}
                      onClick={() => registrarResiduo(residuo.tipo, 1)}
                      disabled={loading}
                      className="p-4 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-center disabled:opacity-50"
                    >
                      <div className="text-3xl mb-2">{residuo.icono}</div>
                      <div className="font-medium text-gray-800">{residuo.nombre}</div>
                      <div className="text-sm text-green-600">+{residuo.puntos} pts/kg</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Estadísticas de Residuos */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📦 Tus Residuos Recolectados</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(estadisticas.residuosRecolectados).map(([tipo, cantidad]) => (
                  <div key={tipo} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">{getIconoResiduo(tipo)}</div>
                    <div className="text-lg font-bold text-gray-900">{cantidad}kg</div>
                    <div className="text-sm text-gray-500">{getNombreResiduo(tipo)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Retos del Día */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Retos del Día</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {retosDiarios.map((reto) => (
                  <div 
                    key={reto.id}
                    className={`p-4 rounded-xl border-2 ${
                      reto.completado 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-yellow-200 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{reto.icono}</span>
                      <div>
                        <div className="font-medium">Recoger {reto.cantidad}kg</div>
                        <div className="text-sm text-gray-600 capitalize">{getNombreResiduo(reto.tipo)}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-bold">+{reto.puntos}pts</span>
                      {!reto.completado ? (
                        <button 
                          onClick={() => completarReto(reto.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Completar
                        </button>
                      ) : (
                        <span className="text-green-600 text-sm">✅ Completado</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Recompensas (Vista Previa) */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">🎁 Recompensas Disponibles</h3>
            <button
              onClick={() => setMostrarCatalogo(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center space-x-2"
            >
              <span>🎁</span>
              <span>Ver Catálogo de Puntos</span>
            </button>
          </div>
          {recompensas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Cargando recompensas...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {recompensas.slice(0, 4).map((recompensa) => {
                const puedeCanjear = estadisticas.ecoPuntos >= recompensa.puntos && recompensa.stock > 0;
                return (
                  <div 
                    key={recompensa.id}
                    className={`p-4 rounded-xl border-2 text-center ${
                      puedeCanjear
                        ? 'border-green-200 hover:border-green-400 cursor-pointer' 
                        : 'border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">
                      {recompensa.categoria === 'jardineria' && '🌱'}
                      {recompensa.categoria === 'descuento' && '🛍️'}
                      {recompensa.categoria === 'educacion' && '🎓'}
                      {recompensa.categoria === 'transporte' && '🚲'}
                      {recompensa.categoria === 'reconocimiento' && '🏆'}
                      {!['jardineria', 'descuento', 'educacion', 'transporte', 'reconocimiento'].includes(recompensa.categoria) && '🎁'}
                    </div>
                    <div className="font-medium text-gray-800">{recompensa.nombre}</div>
                    <div className="text-sm text-gray-600 mb-2">{recompensa.descripcion}</div>
                    <div className="text-green-600 font-bold mb-2">{recompensa.puntos} pts</div>
                    <button 
                      onClick={() => canjearRecompensa(recompensa.id)}
                      disabled={!puedeCanjear || loading}
                      className={`mt-2 w-full py-2 rounded-lg text-sm font-medium ${
                        puedeCanjear
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {loading ? 'Procesando...' : puedeCanjear ? 'Canjear' : recompensa.stock === 0 ? 'Agotado' : 'Puntos insuficientes'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Modal del Catálogo de Recompensas */}
      {mostrarCatalogo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setMostrarCatalogo(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">🎁 Catálogo de Puntos</h2>
                <p className="text-purple-100 text-sm mt-1">Intercambia tus EcoPuntos por increíbles recompensas</p>
              </div>
              <button
                onClick={() => setMostrarCatalogo(false)}
                className="text-white hover:text-gray-200 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Contenido del Catálogo con Scroll */}
            <div className="flex-1 overflow-y-auto p-6">
              <CatalogoRecompensas
                usuario={usuario}
                ecoPuntos={estadisticas.ecoPuntos}
                nivel={estadisticas.nivel}
                onCanjear={async (recompensaId) => {
                  await canjearRecompensa(recompensaId);
                  // El catálogo se actualizará automáticamente
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardCiudadano;

