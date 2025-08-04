import React, { useState } from 'react';
import { NavbarUser } from '../components/NavbarUser';
import { UserProfile } from '../components/UserProfile';
import { InicioUser } from './InicioUser';
import { Vehiculos } from './Vehiculos';


export const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('Inicio');


  const renderSection = () => {
    switch (activeSection) {
      case 'Inicio':
        return <InicioUser />
      case 'Vehiculos':
        return <Vehiculos />
      case 'Perfil':
        return <UserProfile />;
    }
  };


  return (
    <div className="login-page-container">
      <div>
      <NavbarUser onSectionChange={setActiveSection} activeSection={activeSection} />
      <div className="container mt-4">
        {renderSection()}
      </div>
      </div>
    </div>
  );
};
