import React from "react";
import styles from './ProfileUpdateData.module.css';

function ProfileUpdateData() {
  return (
    <div className={styles["profile-edit"]}>
      <h2 className={styles["h2EditProifle"]}>Editar Perfil</h2> 
      <button className={styles["back-button"]}>&larr;</button>
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
