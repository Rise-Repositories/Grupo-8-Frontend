import React from 'react';
import './ProfileMenu.module.css';

const UserProfile = () => {
  return (
    <div className="container">
      <div className="header">
        <button className="back-button">←</button>
        <h2>Histórico</h2>
      </div>
      <div className="profile-info">
        <p>Olá Fernanda</p>
        <a href="/edit-profile" className="profile-link">Editar Perfil</a>
        <a href="/change-password" className="profile-link">Alterar Senha</a>
      </div>
      <h3 className="subheader">Localizações Cadastradas:</h3>
    </div>
  );
};

export default UserProfile;