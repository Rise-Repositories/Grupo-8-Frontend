import React from "react";
import styles from './ProfileUpdateData.module.css';

function ProfileUpdateData() {
  return (
    // className={styles["container"]}
    <div className={styles["profile-edit"]}>
      <button className={styles["back-button"]}>&larr;</button>
      <h2>Editar Perfil</h2>
      <form>
        <div className={styles["input-group"]}>
          <label htmlFor="name">Nome:</label>
          <input type="text" id="name" placeholder="Nome Exemplo" />
        </div>
        <div className={styles["input-group"]}>
          <label htmlFor="email">E-mail:</label>
          <input type="email" id="email" placeholder="exemplo@gmail.com"/>
        </div>
        <div className={styles["input-group"]}>
          <label htmlFor="cpf">CPF:</label>
          <input type="text" id="cpf" placeholder="XXX.XXX.XXX-XX"/>
        </div>
        <div className={styles["input-group"]}>
          <label htmlFor="address">Endereço:</label>
          <input type="text" id="address" placeholder="Rua Exemplo N°X" />
        </div>
        <button type="submit" className={styles["update-button"]}>Atualizar</button>
      </form>
    </div>
  );
}

export default ProfileUpdateData;
