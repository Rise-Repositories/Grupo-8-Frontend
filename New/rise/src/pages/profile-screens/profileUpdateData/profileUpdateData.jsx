import React from "react";
import styles from './ProfileUpdateData.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';

function ProfileUpdateData() {
  return (
        <div className={"col-12 col-md-5 mx-md-auto"} >
    <div className={styles["container"]}>
        <header className={styles["profile-header"]}>
          <button className={styles.backButton} onClick={() => window.history.back()}>
            <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: "#1a3e95" }} />
          </button>
          <h1 className={styles["header-1"]}>Editar Perfil</h1>
        </header>
        <form>
          <div className={styles["aux"]}>
            <div className={styles["input-group"]}>
              <label className={styles["input-label"]} htmlFor="name">Nome:</label>
              <input className={styles["text-input"]} type="text" id="name" placeholder="Nome Exemplo" />
            </div>
            <div className={styles["input-group"]}>
              <label className={styles["input-label"]} htmlFor="email">E-mail:</label>
              <input className={styles["text-input"]} type="email" id="email" placeholder="exemplo@gmail.com" />
            </div>
            <div className={styles["input-group"]}>
              <label className={styles["input-label"]} htmlFor="cpf">CPF:</label>
              <input className={styles["text-input"]} type="text" id="cpf" placeholder="XXX.XXX.XXX-XX" />
            </div>
            <div className={styles["input-group"]}>
              <label className={styles["input-label"]} htmlFor="address">Endereço:</label>
              <input className={styles["text-input"]} type="text" id="address" placeholder="Rua Exemplo N°X" />
            </div>
            <div className={styles["input-group"]}>
              <label className={styles["input-label"]} htmlFor="address">Nova Senha:</label>
              <input className={styles["text-input"]} type="password" id="address" placeholder="" />
            </div>
            <div className={styles["input-group"]}>
              <label className={styles["input-label"]} htmlFor="address">Confirmar nova senha:</label>
              <input className={styles["text-input"]} type="password" id="address" placeholder="" />
            </div>
            <button type="submit" className={styles["update-button"]}>Atualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileUpdateData;
