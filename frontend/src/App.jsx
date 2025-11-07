import React, { useState } from 'react';
import PortalPrincipal from './pages/PortalPrincipal';
import RegistroUsuario from './pages/RegistroUsuario';
import RegistroInstitucion from './pages/RegistroInstitucion';
import DashboardCiudadano from './pages/DashboardCiudadano';
import DashboardInstitucion from './pages/DashboardInstitucion';

function App() {
  const [vistaActual, setVistaActual] = useState('portal');
  const [usuario, setUsuario] = useState(null);

  const renderVista = () => {
    switch(vistaActual) {
      case 'portal':
        return <PortalPrincipal onCambiarVista={setVistaActual} />;
      case 'registro-usuario':
        return <RegistroUsuario 
          onRegistroCompleto={(user) => {
            setUsuario(user);
            setVistaActual('dashboard-ciudadano');
          }} 
          onVolver={() => setVistaActual('portal')} 
        />;
      case 'registro-institucion':
        return <RegistroInstitucion onVolver={() => setVistaActual('portal')} />;
      case 'dashboard-ciudadano':
        return <DashboardCiudadano 
          usuario={usuario} 
          onVolver={() => setVistaActual('portal')} 
        />;
      case 'dashboard-institucion':
        return <DashboardInstitucion onVolver={() => setVistaActual('portal')} />;
      default:
        return <PortalPrincipal onCambiarVista={setVistaActual} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
      {renderVista()}
    </div>
  );
}

export default App;
