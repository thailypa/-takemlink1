import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const CatalogoRecompensas = ({ usuario, ecoPuntos, nivel, onCanjear }) => {
  const [recompensas, setRecompensas] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categorias = [
    { id: 'todas', nombre: 'Todas', icono: '🎁' },
    { id: 'jardineria', nombre: 'Jardinería', icono: '🌱' },
    { id: 'descuento', nombre: 'Descuentos', icono: '🛍️' },
    { id: 'educacion', nombre: 'Educación', icono: '🎓' },
    { id: 'transporte', nombre: 'Transporte', icono: '🚲' },
    { id: 'reconocimiento', nombre: 'Reconocimientos', icono: '🏆' }
  ];

  useEffect(() => {
    cargarRecompensas();
  }, [nivel]);

  const cargarRecompensas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.GET_RECOMPENSAS}?nivel=${nivel || 'novato'}`);
      if (response.ok) {
        const data = await response.json();
        setRecompensas(data);
      } else {
        setError('Error al cargar recompensas');
      }
    } catch (err) {
      console.error('Error al cargar recompensas:', err);
      setError('Error al cargar recompensas');
    } finally {
      setLoading(false);
    }
  };

  const recompensasFiltradas = categoriaFiltro === 'todas' 
    ? recompensas 
    : recompensas.filter(r => r.categoria === categoriaFiltro);

  const getIconoCategoria = (categoria) => {
    const iconos = {
      jardineria: '🌱',
      descuento: '🛍️',
      educacion: '🎓',
      transporte: '🚲',
      reconocimiento: '🏆'
    };
    return iconos[categoria] || '🎁';
  };

  const puedeCanjear = (puntos) => {
    return ecoPuntos >= puntos;
  };

  const handleCanjear = async (recompensa) => {
    if (!puedeCanjear(recompensa.puntos)) {
      setError(`Necesitas ${recompensa.puntos} puntos. Tienes ${ecoPuntos} puntos.`);
      return;
    }

    if (recompensa.stock <= 0) {
      setError('Esta recompensa está agotada');
      return;
    }

    if (onCanjear) {
      await onCanjear(recompensa.id);
      await cargarRecompensas(); // Recargar para actualizar stock
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header del Catálogo */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🎁 Catálogo de Recompensas</h2>
            <p className="text-gray-600 text-sm mt-1">
              Intercambia tus EcoPuntos por increíbles recompensas
            </p>
          </div>
          <div className="bg-green-50 border-2 border-green-300 rounded-xl px-4 py-2">
            <div className="text-xs text-gray-600 mb-1">Tus EcoPuntos</div>
            <div className="text-2xl font-bold text-green-600">{ecoPuntos || 0}</div>
          </div>
        </div>

        {/* Filtros por Categoría */}
        <div className="flex flex-wrap gap-2">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setCategoriaFiltro(categoria.id)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                categoriaFiltro === categoria.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{categoria.icono}</span>
              <span className="text-sm font-medium">{categoria.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <p className="font-medium text-sm">⚠️ {error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 text-xs mt-2 underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Grid de Recompensas */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="text-gray-500 mt-2">Cargando recompensas...</p>
        </div>
      ) : recompensasFiltradas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay recompensas disponibles en esta categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recompensasFiltradas.map((recompensa) => {
            const disponible = puedeCanjear(recompensa.puntos) && recompensa.stock > 0;
            const faltaPuntos = recompensa.puntos - ecoPuntos;
            
            return (
              <div
                key={recompensa.id}
                className={`relative rounded-2xl border-2 overflow-hidden transition-all ${
                  disponible
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-white shadow-md hover:shadow-lg hover:scale-105'
                    : 'border-gray-200 bg-gray-50 opacity-75'
                }`}
              >
                {/* Badge de Stock */}
                {recompensa.stock > 0 && recompensa.stock <= 5 && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    ¡Últimas {recompensa.stock}!
                  </div>
                )}

                {recompensa.stock === 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    Agotado
                  </div>
                )}

                {/* Contenido de la Tarjeta */}
                <div className="p-6">
                  {/* Icono y Categoría */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">{getIconoCategoria(recompensa.categoria)}</div>
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 capitalize">
                      {recompensa.categoria}
                    </div>
                  </div>

                  {/* Nombre y Descripción */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{recompensa.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{recompensa.descripcion}</p>

                  {/* Equivalencia de Puntos - Destacado */}
                  <div className="bg-white rounded-xl p-4 mb-4 border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Equivale a</div>
                        <div className="text-2xl font-bold text-green-600">
                          {recompensa.puntos.toLocaleString()} pts
                        </div>
                      </div>
                      <div className="text-3xl">💰</div>
                    </div>
                  </div>

                  {/* Estado de Disponibilidad */}
                  {!disponible && (
                    <div className="mb-4">
                      {recompensa.stock === 0 ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                          <p className="text-xs text-red-600 text-center">
                            ❌ Recompensa agotada
                          </p>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                          <p className="text-xs text-yellow-700 text-center">
                            ⚠️ Te faltan <span className="font-bold">{faltaPuntos}</span> puntos
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Información Adicional */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <span>📦</span>
                      <span>Stock: {recompensa.stock}</span>
                    </div>
                    {recompensa.nivelRequerido && (
                      <div className="flex items-center space-x-1">
                        <span>⭐</span>
                        <span className="capitalize">{recompensa.nivelRequerido}</span>
                      </div>
                    )}
                  </div>

                  {/* Botón de Canje */}
                  <button
                    onClick={() => handleCanjear(recompensa)}
                    disabled={!disponible || loading}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      disponible
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2">⏳</span>
                        Procesando...
                      </span>
                    ) : disponible ? (
                      <span className="flex items-center justify-center space-x-2">
                        <span>🛒</span>
                        <span>Canjear Ahora</span>
                      </span>
                    ) : recompensa.stock === 0 ? (
                      'Agotado'
                    ) : (
                      'Puntos Insuficientes'
                    )}
                  </button>
                </div>

                {/* Barra de Progreso si no tiene suficientes puntos */}
                {!disponible && recompensa.stock > 0 && (
                  <div className="px-6 pb-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((ecoPuntos / recompensa.puntos) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      {ecoPuntos} / {recompensa.puntos} puntos
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resumen de Puntos */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
        <h3 className="font-bold text-gray-800 mb-3">💡 ¿Cómo conseguir más puntos?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🗑️</span>
            <div>
              <div className="font-medium text-gray-800">Recicla Residuos</div>
              <div className="text-gray-600">+10 puntos por kg</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="font-medium text-gray-800">Completa Retos</div>
              <div className="text-gray-600">+20-50 puntos</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📈</span>
            <div>
              <div className="font-medium text-gray-800">Sube de Nivel</div>
              <div className="text-gray-600">Bonificaciones especiales</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogoRecompensas;

