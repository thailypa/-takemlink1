import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const PerfilUsuario = ({ usuario, estadisticas, onVolver }) => {
  // Generar código único del usuario basado en su ID
  const codigoUsuario = usuario?.id ? `TAKEM-${usuario.id}-${usuario.nombre?.substring(0, 3).toUpperCase() || 'USR'}` : 'TAKEM-USER-001';

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    if (typeof fecha === 'string') {
      return new Date(fecha).toLocaleDateString();
    }
    return fecha.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onVolver}
              className="text-green-600 hover:text-green-800 text-lg"
            >
              ← Volver
            </button>
            <div>
              <h1 className="text-3xl font-bold text-green-800">👤 Mi Perfil</h1>
              <p className="text-gray-600">Tu información y código QR personal</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-600">{estadisticas?.ecoPuntos || 0}</div>
            <div className="text-sm text-gray-500">EcoPuntos Totales</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda - Información Personal */}
        <div className="space-y-6">
          {/* Tarjeta de Información */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Mis Datos</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre:</span>
                <span className="font-medium">{usuario?.nombre || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{usuario?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium capitalize">{usuario?.tipo || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zona:</span>
                <span className="font-medium">{usuario?.zona || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Miembro desde:</span>
                <span className="font-medium">{formatearFecha(usuario?.fechaRegistro)}</span>
              </div>
            </div>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Mi Impacto</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nivel:</span>
                <span className="font-bold text-green-600 capitalize">{estadisticas?.nivel || 'novato'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ranking:</span>
                <span className="font-bold">#{estadisticas?.ranking || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Retos completados:</span>
                <span className="font-bold">{estadisticas?.retosCompletados || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total reciclado:</span>
                <span className="font-bold">
                  {estadisticas?.residuosRecolectados 
                    ? Object.values(estadisticas.residuosRecolectados).reduce((a, b) => a + b, 0)
                    : 0}kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Central - QR del Usuario */}
        <div className="lg:col-span-2">
          {/* Código QR del Usuario */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎫 Mi Código QR</h3>
            <p className="text-gray-600 mb-6">
              Este código QR te permite canjear residuos en los tachos inteligentes TákemLink para ganar puntos y también canjear tus puntos por recompensas y regalos ecológicos.
            </p>

            {/* QR Code Display */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-4 border-green-300">
              {/* QR Code Real */}
              <div className="bg-white p-6 border-4 border-green-400 rounded-xl mb-6 shadow-lg" id="qr-container">
                <QRCodeSVG
                  value={codigoUsuario}
                  size={256}
                  level="H"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>

              {/* Información del QR */}
              <div className="bg-white rounded-xl p-4 w-full max-w-md border-2 border-green-200">
                <div className="text-center">
                  <div className="font-bold text-green-800 text-lg mb-2">
                    {usuario?.nombre || 'Usuario TákemLink'}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Código: <span className="font-mono font-bold">{codigoUsuario}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Escanea este código en cualquier tacho inteligente TákemLink
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    // Descargar el QR como SVG
                    const container = document.getElementById('qr-container');
                    const svg = container?.querySelector('svg');
                    if (svg) {
                      const svgData = new XMLSerializer().serializeToString(svg);
                      const blob = new Blob([svgData], { type: 'image/svg+xml' });
                      const url = URL.createObjectURL(blob);
                      const downloadLink = document.createElement('a');
                      downloadLink.download = `QR-${codigoUsuario}.svg`;
                      downloadLink.href = url;
                      document.body.appendChild(downloadLink);
                      downloadLink.click();
                      document.body.removeChild(downloadLink);
                      URL.revokeObjectURL(url);
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <span>📥</span>
                  <span>Descargar QR</span>
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Mi Código QR TákemLink',
                        text: `Mi código QR de usuario: ${codigoUsuario}`,
                      }).catch(() => {
                        // Fallback si el usuario cancela
                      });
                    } else {
                      // Copiar al portapapeles como fallback
                      navigator.clipboard.writeText(codigoUsuario).then(() => {
                        alert('¡Código copiado al portapapeles! 📋');
                      }).catch(() => {
                        alert('Código: ' + codigoUsuario);
                      });
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <span>📱</span>
                  <span>Compartir</span>
                </button>
              </div>
            </div>

            {/* Información del Sistema QR */}
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">💡 ¿Cómo funciona?</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Acércate a un tacho inteligente TákemLink</li>
                  <li>2. Escanea tu código QR en el lector del tacho</li>
                  <li>3. Deposita tus residuos en el tacho correspondiente</li>
                  <li>4. ¡Recibe tus puntos automáticamente! 🎉</li>
                </ol>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h4 className="font-bold text-purple-800 mb-2">🎁 Canjear Puntos por Regalos</h4>
                <ol className="text-sm text-purple-700 space-y-1">
                  <li>1. Acumula EcoPuntos reciclando residuos</li>
                  <li>2. Visita la sección de Recompensas en tu dashboard</li>
                  <li>3. Escanea tu código QR para verificar tu identidad</li>
                  <li>4. Elige la recompensa que deseas y canjéala con tus puntos</li>
                  <li>5. ¡Disfruta de tu regalo ecológico! 🎉</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
