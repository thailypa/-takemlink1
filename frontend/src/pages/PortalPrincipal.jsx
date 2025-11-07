import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  FaRecycle, 
  FaLeaf, 
  FaLightbulb, 
  FaRocket, 
  FaTrophy, 
  FaDollarSign,
  FaUsers,
  FaBuilding,
  FaTrash,
  FaCoins,
  FaCheckCircle,
  FaChartLine,
  FaMap,
  FaFileAlt,
  FaUsersCog,
  FaUser,
  FaSignInAlt
} from 'react-icons/fa';
import { 
  HiSparkles,
  HiCurrencyDollar,
  HiStar
} from 'react-icons/hi';

const PortalPrincipal = ({ onCambiarVista }) => {
  const [takiAnimacion, setTakiAnimacion] = useState('flotando');
  const [mensajeTaki, setMensajeTaki] = useState('¡Hola! Soy Taki, tu asistente ecológico 🐵');
  const [hasCounted, setHasCounted] = useState(false);
  const statsRef = useRef(null);

  const mensajes = [
    "¡Hola! Soy Taki, tu asistente ecológico 🐵",
    "¡Vamos a reciclar juntos! 🌿",
    "Cada residuo cuenta 💚",
    "¡Tú puedes salvar el planeta! 🌍",
    "¡Recicla y gana puntos! 🎯",
    "La selva te necesita 🌲",
    "¡Juntos podemos hacer la diferencia! ✨"
  ];

  useEffect(() => {
    // Cambiar mensaje cada 5 segundos
    const intervaloMensaje = setInterval(() => {
      const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
      setMensajeTaki(mensajeAleatorio);
      setTakiAnimacion('hablando');
      setTimeout(() => setTakiAnimacion('flotando'), 2000);
    }, 5000);

    // Animaciones aleatorias
    const animaciones = ['flotando', 'saltando', 'bailando'];
    const intervaloAnimacion = setInterval(() => {
      const animacionAleatoria = animaciones[Math.floor(Math.random() * animaciones.length)];
      setTakiAnimacion(animacionAleatoria);
      setTimeout(() => setTakiAnimacion('flotando'), 2000);
    }, 8000);

    setMensajeTaki(mensajes[0]);
    return () => {
      clearInterval(intervaloMensaje);
      clearInterval(intervaloAnimacion);
    };
  }, []);

  // Observer para activar contadores cuando están visibles
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasCounted) {
            setHasCounted(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasCounted]);

  const iconosFlotantes = [
    { icon: FaCoins, color: 'text-yellow-400' },
    { icon: FaTrophy, color: 'text-yellow-500' },
    { icon: FaRecycle, color: 'text-green-500' },
    { icon: FaLeaf, color: 'text-green-400' },
    { icon: FaLightbulb, color: 'text-yellow-300' },
    { icon: FaRocket, color: 'text-blue-400' },
    { icon: HiStar, color: 'text-yellow-400' },
    { icon: FaCoins, color: 'text-green-400' },
  ];

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom right, #86efac, #6ee7b7, #67e8f9, #60a5fa)',
      }}
    >
      {/* Iconos de fondo decorativos animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {iconosFlotantes.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={index}
              className={`absolute ${item.color} opacity-20`}
              style={{
                left: `${10 + (index * 12)}%`,
                top: `${10 + (index % 3) * 30}%`,
                fontSize: '2rem',
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            >
              <IconComponent />
            </motion.div>
          );
        })}
      </div>

      {/* Header */}
      <header className="bg-white rounded-2xl mx-4 mt-4 shadow-lg relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <FaRecycle className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>TákemLink</span>
          </div>

          {/* Navegación */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">About Us</a>
            <a href="#rewards" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Rewards</a>
          </nav>

          {/* Perfil y Login */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <FaUser className="text-gray-600 text-sm" />
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2">
              <FaSignInAlt />
              <span>Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Título Principal */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gray-800">Únete al modo juego y </span>
            <span className="text-green-600">¡GANA</span>
          </motion.h1>
        </div>

        {/* Taki con Penacho */}
        <div className="flex justify-center items-center mb-16 relative" style={{ minHeight: '500px' }}>
          <div className="relative">
            {/* Mariposas de fondo estáticas */}
            <div className="absolute text-blue-300 opacity-20" style={{ left: '15%', top: '10%', fontSize: '2rem' }}>🦋</div>
            <div className="absolute text-blue-300 opacity-20" style={{ left: '85%', top: '70%', fontSize: '2rem' }}>🦋</div>
            <div className="absolute text-blue-300 opacity-20" style={{ left: '30%', top: '5%', fontSize: '1.5rem' }}>🦋</div>
            <div className="absolute text-blue-300 opacity-20" style={{ left: '70%', top: '80%', fontSize: '1.5rem' }}>🦋</div>

            {/* Taki con Penacho */}
            <div className="relative z-20 flex justify-center items-center">
              <img
                src="/taki-penacho.png.png"
                alt="Taki con penacho de plumas"
              />
            </div>

            {/* Burbuja de diálogo con marco blanco */}
            <div className="absolute top-0 right-0 bg-white rounded-2xl p-5 shadow-xl max-w-sm z-30">
              <p className="text-gray-800 font-medium text-base leading-relaxed mb-2">
                {mensajeTaki}
              </p>
              
              {/* Emojis */}
              <div className="flex items-center space-x-2 mt-3">
                <span className="text-2xl">🌲</span>
                <span className="text-2xl">🌎</span>
                <span className="text-2xl">🐵</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas de Acceso */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {/* Tarjeta Ciudadano */}
          <motion.div
            className="bg-gradient-to-br from-green-400 to-green-600 rounded-3xl p-8 text-white shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-start justify-between mb-6">
              <FaLeaf className="text-5xl" />
            </div>
            
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>Soy Ciudadano</h2>
            
            <ul className="space-y-3 mb-8 text-lg">
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-2xl" />
                <span>Registra tus residuos</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-2xl" />
                <span>Gana puntos y recompensas</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-2xl" />
                <span>Sube de nivel</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-2xl" />
                <span>Compite con amigos</span>
              </li>
            </ul>

            <button
              onClick={() => onCambiarVista('registro-usuario')}
              className="w-full bg-gradient-to-r from-orange-400 to-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span>¡Juega Ya!</span>
              <FaLeaf />
            </button>
          </motion.div>

          {/* Tarjeta Institución */}
          <motion.div
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaRecycle className="text-2xl" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>Soy Institución</h2>
            
            <ul className="space-y-3 mb-8 text-lg">
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-2xl" />
                <span>Dashboard de métricas</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-2xl" />
                <span>Mapa de zonas críticas</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-2xl" />
                <span>Reportes de impacto</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-2xl" />
                <span>Gestión de comunidades</span>
              </li>
            </ul>

            <button
              onClick={() => onCambiarVista('registro-institucion')}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Panel Pro
            </button>
          </motion.div>
        </div>

        {/* Estadísticas con Contadores Animados */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-cyan-400 rounded-2xl p-6 text-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <FaUsers className="text-3xl opacity-80" />
            </div>
            <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {hasCounted && <CountUp end={1250} duration={2.5} separator="," />}
              {!hasCounted && '1,250'}
              <span className="text-2xl">+</span>
            </div>
            <div className="text-sm opacity-90">Ciudadanos Activos</div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl p-6 text-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <FaBuilding className="text-3xl opacity-80" />
            </div>
            <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {hasCounted && <CountUp end={45} duration={2.5} />}
              {!hasCounted && '45'}
              <span className="text-2xl">+</span>
            </div>
            <div className="text-sm opacity-90">Instituciones</div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-6 text-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <FaTrash className="text-3xl opacity-80" />
            </div>
            <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {hasCounted && <CountUp end={1.5} duration={2.5} decimals={1} />}
              {!hasCounted && '1.5'}
              <span className="text-2xl">T</span>
            </div>
            <div className="text-sm opacity-90">Residuos Reciclados</div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-2">
              <FaCoins className="text-3xl opacity-80" />
            </div>
            <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {hasCounted && <CountUp end={25000} duration={2.5} separator="," />}
              {!hasCounted && '25,000'}
              <span className="text-2xl">+</span>
            </div>
            <div className="text-sm opacity-90">EcoPuntos Repartidos</div>
          </motion.div>
        </div>

        {/* Call to Action Final */}
        <div className="text-center">
          <motion.p
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ¿Listo para hacer la diferencia? ¡Elige tu camino! <FaRocket className="inline-block ml-2" />
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default PortalPrincipal;
