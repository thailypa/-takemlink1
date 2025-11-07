import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

const RegistroUsuario = ({ onRegistroCompleto, onVolver }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipo: '',
    zona: '',
    residuos: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tiposUsuario = [
    { value: 'escolar', label: '🎓 Escolar', emoji: '🎓' },
    { value: 'agricultor', label: '👨‍🌾 Agricultor', emoji: '👨‍🌾' },
    { value: 'artesano', label: '🔨 Artesano', emoji: '🔨' },
    { value: 'recolector', label: '♻️ Recolector', emoji: '♻️' }
  ];

  const tiposResiduo = [
    { id: 'plastico', nombre: 'Plástico', emoji: '🥤' },
    { id: 'vidrio', nombre: 'Vidrio', emoji: '🍶' },
    { id: 'carton', nombre: 'Cartón', emoji: '📦' },
    { id: 'organico', nombre: 'Orgánico', emoji: '🍂' },
    { id: 'metal', nombre: 'Metal', emoji: '🥫' },
    { id: 'electronico', nombre: 'Electrónico', emoji: '📱' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('📤 Registrando usuario:', formData);
      
      const response = await fetch(API_ENDPOINTS.REGISTRO_USUARIO, {
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
        throw new Error(errorMessage);
      }

      const usuarioRegistrado = await response.json();
      console.log('✅ Usuario registrado exitosamente:', usuarioRegistrado);
      
      // Después del registro exitoso, llamar al callback
      onRegistroCompleto && onRegistroCompleto(usuarioRegistrado);
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('No se pudo conectar con el servidor. Por favor, verifique que el backend esté disponible.');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Error de conexión. Asegúrese de que el servidor backend esté corriendo.');
      } else {
        setError(err.message || 'Error al registrar el usuario');
      }
      console.error('❌ Error en registro:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleResiduo = (residuoId) => {
    setFormData(prev => ({
      ...prev,
      residuos: prev.residuos.includes(residuoId)
        ? prev.residuos.filter(r => r !== residuoId)
        : [...prev.residuos, residuoId]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={onVolver}
            className="text-green-600 hover:text-green-800 mb-4 text-lg"
          >
            ← Volver al inicio
          </button>
          <h2 className="text-4xl font-bold text-green-800 mb-2">
            Únete como Ciudadano 🌱
          </h2>
          <p className="text-gray-600">Comienza tu aventura ecológica</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Tu nombre completo"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          {/* Tipo de Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cuál es tu perfil?
            </label>
            <div className="grid grid-cols-2 gap-4">
              {tiposUsuario.map(tipo => (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => setFormData({...formData, tipo: tipo.value})}
                  className={`p-4 border-2 rounded-2xl text-center transition-all ${
                    formData.tipo === tipo.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{tipo.emoji}</div>
                  <div className="font-medium">{tipo.label.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Zona */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona/Comunidad
            </label>
            <input
              type="text"
              required
              value={formData.zona}
              onChange={(e) => setFormData({...formData, zona: e.target.value})}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ej: Zona Norte, Comunidad El Bosque..."
            />
          </div>

          {/* Tipos de Residuos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué tipos de residuos manejas principalmente?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tiposResiduo.map(residuo => (
                <button
                  key={residuo.id}
                  type="button"
                  onClick={() => toggleResiduo(residuo.id)}
                  className={`p-3 border-2 rounded-xl text-center transition-all ${
                    formData.residuos.includes(residuo.id)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-xl mb-1">{residuo.emoji}</div>
                  <div className="text-sm font-medium">{residuo.nombre}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
              <p className="font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Botón de Registro */}
          <button
            type="submit"
            disabled={!formData.nombre || !formData.email || !formData.tipo || !formData.zona || loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                Registrando...
              </span>
            ) : (
              '🚀 Comenzar Aventura Ecológica'
            )}
          </button>
        </form>

        {/* Info EcoPuntos */}
        <div className="mt-8 p-4 bg-green-50 rounded-2xl border border-green-200">
          <h4 className="font-bold text-green-800 mb-2">🎯 ¿Cómo ganar EcoPuntos?</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>🥤 1kg Plástico → <strong>10 pts</strong></div>
            <div>🍂 1kg Orgánico → <strong>5 pts</strong></div>
            <div>📱 Reto diario → <strong>20 pts</strong></div>
            <div>👥 Campaña → <strong>50 pts</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuario;


