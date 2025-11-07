import React from 'react';

const DashboardUsuario = ({ usuario, onVolver }) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-eco-dark mb-4">Dashboard de Usuario</h2>
      <p className="mb-4">Bienvenido{usuario?.nombre ? `, ${usuario.nombre}` : ''}.</p>
      <div className="flex gap-3">
        <button type="button" onClick={onVolver} className="px-4 py-2 rounded-lg border">Volver al portal</button>
      </div>
    </div>
  );
};

export default DashboardUsuario;


