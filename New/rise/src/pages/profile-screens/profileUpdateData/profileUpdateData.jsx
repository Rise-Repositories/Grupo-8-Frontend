import React from "react";
import styles from './ProfileUpdateData.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';

function ProfileUpdateData() {
  return (
    <div className={styles["profile-edit"]}>
      <div className={styles["container"]}>
        <header>
          <button className={styles.backButton} onClick={() => window.history.back()}>
            <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: "#1a3e95" }} />
          </button>
          <h1>Editar Perfil</h1>
        </header>
      </div>
      <form>
        <div className={styles["input-group"]}>
          <label htmlFor="name">Nome:</label>
          <input type="text" id="name" placeholder="Nome Exemplo" />
        </div>
        <div className={styles["input-group"]}>
          <label htmlFor="email">E-mail:</label>
          <input type="email" id="email" placeholder="exemplo@gmail.com" />
        </div>
        <div className={styles["input-group"]}>
          <label htmlFor="cpf">CPF:</label>
          <input type="text" id="cpf" placeholder="XXX.XXX.XXX-XX" />
        </div>
        <div className={styles["input-group"]}>
          <label htmlFor="address">Endereço:</label>
          <input type="text" id="address" placeholder="Rua Exemplo N°X" />
        </div>
        <div className={styles["input-group"]}>
          <label htmlFor="address">Nova Senha:</label>
          <input type="password" id="address" placeholder="" />
        </div>
        <div className={styles["input-group"]}>
          <label htmlFor="address">Confirmar nova senha:</label>
          <input type="password" id="address" placeholder="" />
        </div>
        <button type="submit" className={styles["update-button"]}>Atualizar</button>
      </form>
    </div>
  );
}

export default ProfileUpdateData;
