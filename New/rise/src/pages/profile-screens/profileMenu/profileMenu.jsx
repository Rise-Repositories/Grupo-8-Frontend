import React from 'react';
import styles from './ProfileMenu.module.css';



const UserProfile = () => {
  return (
    <div className={styles["container"]}>
      <header>
        <button className={styles["back-button"]}>{'<-'}</button>
        <h1>Histórico</h1>
      </header>

      <div className={styles["profile-links"]}>
        <p>Olá Fernanda</p>
        <a href="#">Editar Perfil</a>
        <a href="#">Alterar Senha</a>
      </div> <br /><br /><br />

      <h2>Localizações Cadastradas:</h2>

      <div className={styles["location-card"]}>
        <div className={styles["map-preview"]}></div>
        <div className={styles["info"]}>
          <p>R. Eduardo Prado, 28</p>
          <p className={styles["date"]}>18/20/2024</p>
          {/* <button className={styles["actions-button"]}>Ver ações</button> */}
        </div>
      </div>

    </div>
  );
};

export default UserProfile;