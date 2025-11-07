import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TakiMonito = ({ ecoPuntos, nivel, onRegistrarResiduo }) => {
  const [mensaje, setMensaje] = useState('¡Hola! Soy Taki, tu asistente ecológico 🐵');
  const [expresion, setExpresion] = useState('sonriendo');
  const [mostrarChat, setMostrarChat] = useState(false);
  const [mensajesChat, setMensajesChat] = useState([]);
  const [inputChat, setInputChat] = useState('');
  const [mostrarVideo, setMostrarVideo] = useState(false);
  const [videoActual, setVideoActual] = useState('');
  const [mostrarDocumentos, setMostrarDocumentos] = useState(false);
  const [mostrarVideos, setMostrarVideos] = useState(false);
  const [escuchando, setEscuchando] = useState(false);
  const chatEndRef = useRef(null);
  const reconocimientoVozRef = useRef(null);

  // Base de conocimiento sobre medio ambiente
  const conocimientoIA = {
    saludos: [
      "¡Hola! Soy Taki, tu asistente ecológico 🐵. ¿En qué puedo ayudarte?",
      "¡Qué gusto verte! Estoy aquí para resolver todas tus dudas sobre el medio ambiente 🌿",
      "¡Hola! Listo para ayudarte a aprender sobre ecología y reciclaje 🌍"
    ],
    reciclaje: [
      "El reciclaje es el proceso de convertir materiales de desecho en nuevos productos. Reciclar ayuda a reducir la contaminación, conservar recursos naturales y ahorrar energía. ♻️",
      "¿Sabías que reciclar 1kg de plástico ahorra suficiente energía para encender una bombilla por 6 horas? Cada botella que reciclas cuenta 💡",
      "Cada material tiene su proceso: el plástico se funde, el vidrio se tritura y funde, el papel se descompone en pulpa, y el cartón se recicla en nuevo papel. ¡Todo se puede reutilizar! 📦",
      "La regla de las 3 R: Reducir (usar menos), Reutilizar (dar otro uso) y Reciclar (convertir en nuevo material). ¡Empieza por reducir! 🌱"
    ],
    contaminacion: [
      "La contaminación afecta el aire, agua y suelo. Las principales fuentes son: industrias, transporte, residuos mal gestionados y deforestación. 🌫️",
      "El cambio climático es causado principalmente por el aumento de CO2 en la atmósfera. Reducir emisiones y plantar árboles ayuda a combatirlo 🌳",
      "La contaminación plástica en los océanos mata millones de animales marinos cada año. ¡Recicla y reduce el uso de plásticos de un solo uso! 🐠"
    ],
    selva: [
      "La selva amazónica produce el 20% del oxígeno del mundo y alberga millones de especies. Es el pulmón del planeta 🌿",
      "La deforestación destruye hábitats y aumenta el CO2. Plantar árboles y proteger bosques es crucial para el futuro 🌲",
      "Los árboles absorben CO2 y producen oxígeno. Un árbol puede absorber hasta 22kg de CO2 por año 💨"
    ],
    agua: [
      "El agua es un recurso limitado. Solo el 2.5% del agua del planeta es dulce. Ahorra agua cerrando el grifo cuando no la uses 💧",
      "La contaminación del agua afecta a todos. No tires basura a ríos o mares. ¡Cada gota cuenta! 🌊",
      "Ahorrar agua: toma duchas cortas, repara goteos, recoge agua de lluvia para plantas. Pequeños cambios hacen gran diferencia 💦"
    ],
    energia: [
      "Las energías renovables (solar, eólica) son el futuro. Reducen emisiones y son inagotables ☀️",
      "Ahorrar energía: apaga luces, usa bombillas LED, desconecta aparatos. ¡Cada vatio cuenta! 💡",
      "El consumo de energía contribuye al cambio climático. Usa energía de forma responsable ⚡"
    ],
    default: [
      "¡Esa es una excelente pregunta! Déjame ayudarte con información sobre ese tema 📚",
      "Interesante pregunta. Te comparto lo que sé sobre medio ambiente y ecología 💡",
      "Me encanta que te intereses por el medio ambiente. Déjame darte información útil 🌿"
    ]
  };

  // Videos educativos sobre medio ambiente
  const videosEducativos = [
    {
      id: 1,
      titulo: "🌿 Importancia del Reciclaje",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      categoria: "reciclaje",
      duracion: "4:15"
    },
    {
      id: 2,
      titulo: "🌍 Cambio Climático Explicado",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      categoria: "contaminacion",
      duracion: "5:30"
    },
    {
      id: 3,
      titulo: "💧 Cómo Ahorrar Agua",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      categoria: "agua",
      duracion: "3:45"
    },
    {
      id: 4,
      titulo: "🌲 Protegiendo los Bosques",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      categoria: "selva",
      duracion: "4:20"
    },
    {
      id: 5,
      titulo: "♻️ Las 3 R: Reducir, Reutilizar, Reciclar",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      categoria: "reciclaje",
      duracion: "6:10"
    }
  ];

  // Documentos e información
  const documentos = [
    {
      id: 1,
      titulo: "📄 Guía de Reciclaje Básico",
      descripcion: "Aprende cómo reciclar correctamente cada material",
      categoria: "reciclaje",
      contenido: "Guía completa sobre separación de residuos, símbolos de reciclaje y centros de acopio."
    },
    {
      id: 2,
      titulo: "📊 Impacto Ambiental de los Residuos",
      descripcion: "Estadísticas sobre el impacto de nuestros residuos",
      categoria: "contaminacion",
      contenido: "Datos sobre cuánto tiempo tardan los materiales en degradarse y su impacto en el medio ambiente."
    },
    {
      id: 3,
      titulo: "🌱 Manual de Compostaje",
      descripcion: "Aprende a hacer compost en casa",
      categoria: "reciclaje",
      contenido: "Pasos detallados para crear tu propia compostera y convertir residuos orgánicos en abono."
    },
    {
      id: 4,
      titulo: "💡 Consejos para Ahorrar Energía",
      descripcion: "Pequeños cambios que hacen gran diferencia",
      categoria: "energia",
      contenido: "Prácticas sencillas para reducir tu consumo de energía en casa y ayudar al planeta."
    }
  ];

  // Inicializar chat con mensaje de bienvenida
  useEffect(() => {
    setMensajesChat([{
      tipo: 'taki',
      texto: '¡Hola! Soy Taki, tu asistente ecológico. Puedo ayudarte con dudas sobre reciclaje, medio ambiente, contaminación y más. También puedes preguntarme por videos y documentos educativos. ¿Qué te gustaría saber? 🐵🌿',
      timestamp: new Date()
    }]);
  }, []);

  // Scroll automático en el chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajesChat]);

  const hablarTaki = (nuevoMensaje) => {
    setMensaje(nuevoMensaje);
    setExpresion('hablando');
    setTimeout(() => setExpresion('sonriendo'), 2000);
  };

  // Función de IA para responder preguntas
  const responderIA = (pregunta) => {
    const preguntaLower = pregunta.toLowerCase();
    let respuesta = '';
    let videosRelacionados = [];
    let documentosRelacionados = [];

    // Detectar tema y responder
    if (preguntaLower.includes('hola') || preguntaLower.includes('hi') || preguntaLower.includes('buenos')) {
      respuesta = conocimientoIA.saludos[Math.floor(Math.random() * conocimientoIA.saludos.length)];
    } else if (preguntaLower.includes('recicl') || preguntaLower.includes('reciclar') || preguntaLower.includes('reciclaje')) {
      respuesta = conocimientoIA.reciclaje[Math.floor(Math.random() * conocimientoIA.reciclaje.length)];
      videosRelacionados = videosEducativos.filter(v => v.categoria === 'reciclaje');
      documentosRelacionados = documentos.filter(d => d.categoria === 'reciclaje');
    } else if (preguntaLower.includes('contamin') || preguntaLower.includes('contaminación') || preguntaLower.includes('cambio climático')) {
      respuesta = conocimientoIA.contaminacion[Math.floor(Math.random() * conocimientoIA.contaminacion.length)];
      videosRelacionados = videosEducativos.filter(v => v.categoria === 'contaminacion');
      documentosRelacionados = documentos.filter(d => d.categoria === 'contaminacion');
    } else if (preguntaLower.includes('selva') || preguntaLower.includes('bosque') || preguntaLower.includes('árbol')) {
      respuesta = conocimientoIA.selva[Math.floor(Math.random() * conocimientoIA.selva.length)];
      videosRelacionados = videosEducativos.filter(v => v.categoria === 'selva');
    } else if (preguntaLower.includes('agua') || preguntaLower.includes('ahorrar agua')) {
      respuesta = conocimientoIA.agua[Math.floor(Math.random() * conocimientoIA.agua.length)];
      videosRelacionados = videosEducativos.filter(v => v.categoria === 'agua');
      documentosRelacionados = documentos.filter(d => d.categoria === 'agua');
    } else if (preguntaLower.includes('energía') || preguntaLower.includes('energia') || preguntaLower.includes('electricidad')) {
      respuesta = conocimientoIA.energia[Math.floor(Math.random() * conocimientoIA.energia.length)];
      documentosRelacionados = documentos.filter(d => d.categoria === 'energia');
    } else if (preguntaLower.includes('video') || preguntaLower.includes('vídeo')) {
      respuesta = '¡Tengo varios videos educativos para ti! Puedes verlos en la sección de videos o preguntarme sobre un tema específico. 📺';
      videosRelacionados = videosEducativos;
    } else if (preguntaLower.includes('documento') || preguntaLower.includes('guía') || preguntaLower.includes('guia')) {
      respuesta = 'Tengo documentos y guías sobre reciclaje, compostaje, ahorro de energía y más. Puedes verlos en la sección de documentos. 📚';
      documentosRelacionados = documentos;
    } else {
      respuesta = conocimientoIA.default[Math.floor(Math.random() * conocimientoIA.default.length)];
    }

    return { respuesta, videosRelacionados, documentosRelacionados };
  };

  const enviarMensaje = () => {
    if (!inputChat.trim()) return;

    // Agregar mensaje del usuario
    const nuevoMensajeUsuario = {
      tipo: 'usuario',
      texto: inputChat,
      timestamp: new Date()
    };
    setMensajesChat(prev => [...prev, nuevoMensajeUsuario]);
    setInputChat('');
    setExpresion('hablando');

    // Simular delay de respuesta de IA
    setTimeout(() => {
      const { respuesta, videosRelacionados, documentosRelacionados } = responderIA(inputChat);
      
      const respuestaTaki = {
        tipo: 'taki',
        texto: respuesta,
        timestamp: new Date(),
        videos: videosRelacionados.length > 0 ? videosRelacionados.slice(0, 2) : [],
        documentos: documentosRelacionados.length > 0 ? documentosRelacionados.slice(0, 2) : []
      };
      
      setMensajesChat(prev => [...prev, respuestaTaki]);
      setMensaje(respuesta);
      setExpresion('sonriendo');
    }, 1000);
  };

  // Reconocimiento de voz
  const iniciarGrabacion = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz. Por favor, escribe tu pregunta.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setEscuchando(true);
      setExpresion('hablando');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputChat(transcript);
      setEscuchando(false);
      setExpresion('sonriendo');
      reconocimientoVozRef.current = null;
    };

    recognition.onerror = () => {
      setEscuchando(false);
      setExpresion('sonriendo');
      reconocimientoVozRef.current = null;
    };

    recognition.onend = () => {
      setEscuchando(false);
      setExpresion('sonriendo');
      reconocimientoVozRef.current = null;
    };

    recognition.start();
    reconocimientoVozRef.current = recognition;
  };

  const detenerGrabacion = () => {
    if (reconocimientoVozRef.current) {
      reconocimientoVozRef.current.stop();
      setEscuchando(false);
      setExpresion('sonriendo');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Cara del Monito */}
      <div className="flex flex-col items-center mb-6">
        <motion.div
          className="relative cursor-pointer"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMostrarChat(!mostrarChat)}
        >
          {/* Cabeza */}
          <div className="relative w-32 h-32 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
            {/* Orejas */}
            <div className="absolute -left-2 top-4 w-8 h-10 bg-amber-600 rounded-full"></div>
            <div className="absolute -right-2 top-4 w-8 h-10 bg-amber-600 rounded-full"></div>
            
            {/* Cara */}
            <div className="relative">
              {/* Ojos */}
              <div className="flex space-x-6 mb-2">
                <motion.div
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                  animate={{
                    scaleY: expresion === 'guiñando' ? [1, 0.1, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-4 h-4 bg-black rounded-full"></div>
                </motion.div>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-black rounded-full"></div>
                </div>
              </div>
              
              {/* Boca */}
              <motion.div
                className="w-12 h-6 mx-auto border-b-4 border-black rounded-b-full"
                animate={{
                  scaleX: expresion === 'sonriendo' ? [1, 1.2, 1] : 
                          expresion === 'hablando' ? [1, 1.1, 0.95, 1.1, 1] : 1,
                }}
                transition={{
                  duration: expresion === 'hablando' ? 0.8 : 2,
                  repeat: expresion === 'hablando' ? Infinity : expresion === 'sonriendo' ? Infinity : 0
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Burbuja de diálogo */}
        <div className="mt-4 bg-green-50 rounded-2xl p-4 border-2 border-green-300 relative max-w-xs">
          <div className="absolute -top-2 left-6 w-4 h-4 bg-green-50 transform rotate-45 border-t-2 border-l-2 border-green-300"></div>
          <p className="text-green-800 font-medium text-sm text-center">{mensaje}</p>
        </div>

        {/* Botón para abrir chat */}
        <button
          onClick={() => setMostrarChat(!mostrarChat)}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl transition-colors flex items-center space-x-2"
        >
          <span>💬</span>
          <span>Chatear con Taki</span>
        </button>
      </div>

      {/* Panel de Chat de IA */}
      <AnimatePresence mode="wait">
        {mostrarChat && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-6 border-t pt-6"
          >
            <div className="bg-gray-50 rounded-xl p-4 h-96 flex flex-col">
              {/* Header del Chat */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">💬 Chat con Taki IA</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setMostrarVideos(!mostrarVideos)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    📺 Videos
                  </button>
                  <button
                    onClick={() => setMostrarDocumentos(!mostrarDocumentos)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    📚 Documentos
                  </button>
                </div>
              </div>

              {/* Mensajes del Chat */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {mensajesChat.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-xl ${
                        msg.tipo === 'usuario'
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.texto}</p>
                      
                      {/* Videos relacionados */}
                      {msg.videos && msg.videos.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.videos.map((video) => (
                            <button
                              key={video.id}
                              onClick={() => {
                                setVideoActual(video.url);
                                setMostrarVideo(true);
                              }}
                              className="block w-full text-left bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded text-xs"
                            >
                              ▶️ {video.titulo} ({video.duracion})
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Documentos relacionados */}
                      {msg.documentos && msg.documentos.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.documentos.map((doc) => (
                            <div
                              key={doc.id}
                              className="bg-white bg-opacity-20 p-2 rounded text-xs"
                            >
                              <div className="font-medium">{doc.titulo}</div>
                              <div className="text-xs opacity-90">{doc.descripcion}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input del Chat */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
                  placeholder="Escribe tu pregunta sobre medio ambiente..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={escuchando ? detenerGrabacion : iniciarGrabacion}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    escuchando
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                  title="Hablar con Taki"
                >
                  {escuchando ? '🛑' : '🎤'}
                </button>
                <button
                  onClick={enviarMensaje}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Enviar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel de Videos */}
      <AnimatePresence mode="wait">
        {mostrarVideos && (
          <motion.div
            key="videos-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-6 border-t pt-6"
          >
            <h3 className="font-bold text-gray-800 mb-4">📺 Videos Educativos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videosEducativos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => {
                    setVideoActual(video.url);
                    setMostrarVideo(true);
                  }}
                  className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 p-4 rounded-xl text-left transition-all"
                >
                  <div className="font-medium text-sm mb-1">{video.titulo}</div>
                  <div className="text-xs text-gray-600">⏱️ {video.duracion}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel de Documentos */}
      <AnimatePresence mode="wait">
        {mostrarDocumentos && (
          <motion.div
            key="documentos-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-6 border-t pt-6"
          >
            <h3 className="font-bold text-gray-800 mb-4">📚 Documentos y Guías</h3>
            <div className="space-y-3">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-purple-50 border-2 border-purple-200 p-4 rounded-xl"
                >
                  <div className="font-medium text-sm mb-1">{doc.titulo}</div>
                  <div className="text-xs text-gray-600 mb-2">{doc.descripcion}</div>
                  <div className="text-xs text-gray-700">{doc.contenido}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Video */}
      {mostrarVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">📺 Video Educativo</h3>
              <button
                onClick={() => {
                  setMostrarVideo(false);
                  setVideoActual('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe
                src={videoActual}
                className="w-full h-64 md:h-96 rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video educativo"
              ></iframe>
            </div>
            <div className="text-center">
              <button
                onClick={() => {
                  setMostrarVideo(false);
                  setVideoActual('');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cerrar Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botones de Acción Rápida */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            onRegistrarResiduo('plastico', 1);
            hablarTaki("¡Gran trabajo reciclando plástico! 🥤");
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <span>🥤</span>
          <span className="text-sm">Plástico</span>
        </button>
        <button
          onClick={() => {
            onRegistrarResiduo('vidrio', 1);
            hablarTaki("¡Excelente! Reciclando vidrio 🍶");
          }}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <span>🍶</span>
          <span className="text-sm">Vidrio</span>
        </button>
        <button
          onClick={() => {
            onRegistrarResiduo('carton', 1);
            hablarTaki("¡Bien! Reciclando cartón 📦");
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <span>📦</span>
          <span className="text-sm">Cartón</span>
        </button>
        <button
          onClick={() => {
            onRegistrarResiduo('organico', 1);
            hablarTaki("¡Perfecto! Residuos orgánicos 🍂");
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <span>🍂</span>
          <span className="text-sm">Orgánico</span>
        </button>
      </div>
    </div>
  );
};

export default TakiMonito;
