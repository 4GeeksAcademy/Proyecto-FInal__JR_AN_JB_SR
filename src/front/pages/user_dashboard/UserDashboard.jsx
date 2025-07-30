// UserDashboard.jsx (Ejemplo)
import React, { useState } from 'react';
import { NavbarUser } from '../../components/NavbarUser';
import { Perfil } from '../../components/Perfil';
import { InicioUser } from '../../components/InicioUser';
import { Vehiculos } from '../Vehiculos';

export const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('Inicio');

  const renderSection = () => {
    switch (activeSection) {
      case 'Inicio':
        return <InicioUser />
      case 'Vehiculos':
        return <Vehiculos />
      case 'Perfil':
        return <Perfil />;
    }
  };

  return (
    <div>
      <NavbarUser onSectionChange={setActiveSection} activeSection={activeSection} />
      <div className="container mt-4">
        {renderSection()}
      </div>
    </div>
  );
};