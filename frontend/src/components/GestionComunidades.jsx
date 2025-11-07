import React, { useState } from 'react';

const GestionComunidades = () => {
  const [comunidades, setComunidades] = useState([
    {
      id: 1,
      nombre: 'Comunidad Norte',
      lider: 'María González',
      participantes: 45,
      residuosRecolectados: 2500,
      nivelActividad: 'alto',
      ultimaActividad: '2024-01-20',
      estado: 'activa',
      contactos: ['maria@email.com', '+51 999 888 777'],
      metas: { mensual: 3000, actual: 2500 }
    },
    {
      id: 2,
      nombre: 'Zona Sur Ecológica',
      lider: 'Carlos Rodríguez',
      participantes: 32,
      residuosRecolectados: 1800,
      nivelActividad: 'medio',
      ultimaActividad: '2024-01-18',
      estado: 'activa',
      contactos: ['carlos@email.com'],
      metas: { mensual: 2000, actual: 1800 }
    },
    {
      id: 3,
      nombre: 'Barrio Este Verde',
      lider: 'Ana Martínez',
      participantes: 28,
      residuosRecolectados: 1500,
      nivelActividad: 'medio',
      ultimaActividad: '2024-01-15',
      estado: 'activa',
      contactos: ['ana@email.com', '+51 988 777 666'],
      metas: { mensual: 1800, actual: 1500 }
    },
    {
      id: 4,
      nombre: 'Área Oeste Sostenible',
      lider: 'Pedro López',
      participantes: 15,
      residuosRecolectados: 800,
      nivelActividad: 'bajo',
      ultimaActividad: '2024-01-10',
      estado: 'necesita_apoyo',
      contactos: ['pedro@email.com'],
      metas: { mensual: 1200, actual: 800 }
    }
  ]);

  const [comunidadEditando, setComunidadEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaComunidad, setNuevaComunidad] = useState({
    nombre: '',
    lider: '',
    participantes: '',
    nivelActividad: 'medio',
    estado: 'activa'
  });

  const getColorNivel = (nivel) => {
    const colores = {
      alto: 'bg-green-100 text-green-800',
      medio: 'bg-yellow-100 text-yellow-800',
      bajo: 'bg-red-100 text-red-800'
    };
    return colores[nivel] || 'bg-gray-100 text-gray-800';
  };

  const getColorEstado = (estado) => {
    const colores = {
      activa: 'bg-green-100 text-green-800',
      inactiva: 'bg-gray-100 text-gray-800',
      necesita_apoyo: 'bg-orange-100 text-orange-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const calcularProgresoMeta = (meta) => {
    return Math.min((meta.actual / meta.mensual) * 100, 100);
  };

  const agregarComunidad = () => {
    if (!nuevaComunidad.nombre || !nuevaComunidad.lider) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    const comunidad = {
      ...nuevaComunidad,
      id: Date.now(),
      participantes: parseInt(nuevaComunidad.participantes) || 0,
      residuosRecolectados: 0,
      ultimaActividad: new Date().toISOString().split('T')[0],
      contactos: [],
      metas: { mensual: 1000, actual: 0 }
    };

    setComunidades(prev => [...prev, comunidad]);
    setMostrarFormulario(false);
    setNuevaComunidad({
      nombre: '',
      lider: '',
      participantes: '',
      nivelActividad: 'medio',
      estado: 'activa'
    });
  };

  const editarComunidad = (comunidad) => {
    setComunidadEditando(comunidad);
    setMostrarFormulario(true);
    setNuevaComunidad({
      nombre: comunidad.nombre,
      lider: comunidad.lider,
      participantes: comunidad.participantes.toString(),
      nivelActividad: comunidad.nivelActividad,
      estado: comunidad.estado
    });
  };

  const guardarEdicion = () => {
    if (!nuevaComunidad.nombre || !nuevaComunidad.lider) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    setComunidades(prev => prev.map(c => 
      c.id === comunidadEditando.id 
        ? { 
            ...c, 
            nombre: nuevaComunidad.nombre,
            lider: nuevaComunidad.lider,
            participantes: parseInt(nuevaComunidad.participantes) || c.participantes,
            nivelActividad: nuevaComunidad.nivelActividad,
            estado: nuevaComunidad.estado
          }
        : c
    ));
    
    setComunidadEditando(null);
    setMostrarFormulario(false);
    setNuevaComunidad({
      nombre: '',
      lider: '',
      participantes: '',
      nivelActividad: 'medio',
      estado: 'activa'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header y Controles */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">👥 Gestión de Comunidades</h3>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              setComunidadEditando(null);
              setMostrarFormulario(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Nueva Comunidad
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            📧 Contactar Líderes
          </button>
        </div>
      </div>

      {/* Formulario de Nueva Comunidad */}
      {mostrarFormulario && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">
            {comunidadEditando ? '✏️ Editar Comunidad' : '➕ Registrar Nueva Comunidad'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre de la comunidad"
              value={nuevaComunidad.nombre}
              onChange={(e) => setNuevaComunidad({...nuevaComunidad, nombre: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Líder de comunidad"
              value={nuevaComunidad.lider}
              onChange={(e) => setNuevaComunidad({...nuevaComunidad, lider: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Número de participantes"
              value={nuevaComunidad.participantes}
              onChange={(e) => setNuevaComunidad({...nuevaComunidad, participantes: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select 
              value={nuevaComunidad.nivelActividad}
              onChange={(e) => setNuevaComunidad({...nuevaComunidad, nivelActividad: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="alto">Alto</option>
              <option value="medio">Medio</option>
              <option value="bajo">Bajo</option>
            </select>
            <select 
              value={nuevaComunidad.estado}
              onChange={(e) => setNuevaComunidad({...nuevaComunidad, estado: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
              <option value="necesita_apoyo">Necesita Apoyo</option>
            </select>
          </div>
          <div className="flex space-x-3 mt-4">
            <button 
              onClick={comunidadEditando ? guardarEdicion : agregarComunidad}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {comunidadEditando ? 'Guardar Cambios' : 'Guardar'}
            </button>
            <button 
              onClick={() => {
                setMostrarFormulario(false);
                setComunidadEditando(null);
                setNuevaComunidad({
                  nombre: '',
                  lider: '',
                  participantes: '',
                  nivelActividad: 'medio',
                  estado: 'activa'
                });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Comunidades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {comunidades.map(comunidad => (
          <div key={comunidad.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
            {/* Header de la Comunidad */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{comunidad.nombre}</h4>
                <p className="text-gray-600">Líder: {comunidad.lider}</p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColorNivel(comunidad.nivelActividad)}`}>
                  {comunidad.nivelActividad.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColorEstado(comunidad.estado)}`}>
                  {comunidad.estado.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{comunidad.participantes}</div>
                <div className="text-xs text-gray-500">Participantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(comunidad.residuosRecolectados / 1000).toFixed(1)}T
                </div>
                <div className="text-xs text-gray-500">Recolectado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Date(comunidad.ultimaActividad).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">Última actividad</div>
              </div>
            </div>

            {/* Progreso de Meta */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progreso mensual</span>
                <span>{comunidad.metas.actual} / {comunidad.metas.mensual} kg</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${calcularProgresoMeta(comunidad.metas)}%` }}
                ></div>
              </div>
            </div>

            {/* Contactos */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-700 mb-2">📞 Contactos:</h5>
              <div className="space-y-1">
                {comunidad.contactos.length > 0 ? (
                  comunidad.contactos.map((contacto, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {contacto}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400 italic">No hay contactos registrados</div>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                📧 Contactar
              </button>
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                📊 Ver Detalles
              </button>
              <button 
                onClick={() => editarComunidad(comunidad)}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
              >
                ✏️ Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen General */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4">📈 Resumen de Comunidades</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{comunidades.length}</div>
            <div className="text-sm text-gray-600">Comunidades</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {comunidades.reduce((sum, c) => sum + c.participantes, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Participantes</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {(comunidades.reduce((sum, c) => sum + c.residuosRecolectados, 0) / 1000).toFixed(1)}T
            </div>
            <div className="text-sm text-gray-600">Total Recolectado</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {comunidades.filter(c => c.estado === 'activa').length}
            </div>
            <div className="text-sm text-gray-600">Comunidades Activas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionComunidades;

