import React from 'react';

export const Perfil = () => {
  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h2 className="card-title text-center mb-4">¡Bienvenido a tu Perfil!</h2>
        <p className="card-text text-center">
          Aquí podrás visualizar y gestionar toda tu información personal, así como los detalles de tu cuenta.
          Actualmente, esta sección es una vista previa, pero pronto podrás editar tus datos y personalizar tu experiencia.
        </p>
        <p className="text-muted text-center mt-3">
          Componente de perfil del usuario.
        </p>
        <div className="text-center mt-4">
          <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: '#003366' }}></i> {/* Icono de ejemplo */}
        </div>
      </div>
    </div>
  );
};