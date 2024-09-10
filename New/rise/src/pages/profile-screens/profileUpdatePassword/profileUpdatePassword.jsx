import React, { useState } from "react";
import styles from './ProfileUpdatePassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import LabelInput from "../../../components/inputs/labelInput/LabelInput";
import { toast } from "react-toastify";
import api from "../../../api";

function ProfileUpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const userToken = sessionStorage.getItem('USER_TOKEN');

  const handleInputChange = (value, setStateFunction) => {
    setStateFunction(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('Senha atual é obrigatória');
      return;
    }

    if (!newPassword) {
      toast.error('Nova senha é obrigatória');
      return;
    }

    try {
      const headers = { 'Authorization': `Bearer ${userToken}`, "Content-Type": "application/json" };
      const response = await api.put('/user/change-password', { currentPassword, newPassword }, { headers });

      if (response.status === 200) {
        toast.success("Senha atualizada com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
      } else if (response.status === 400) {
        toast.error("Senha atual incorreta.");
      } else {
        toast.error("Erro ao atualizar a senha.");
      }
    } catch (error) {
      console.error("Erro ao atualizar a senha:", error);
      toast.error("Erro ao atualizar a senha.");
    }
  };

  return (
    <div className={"col-12 col-md-5 mx-md-auto"}>
      <div className={styles["container"]}>
        <header className={styles["profile-header"]}>
          <button className={styles["back-button"]} onClick={() => window.history.back()}>
            <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: "#1a3e95" }} />
          </button>
          <h1 className={styles["header-1"]}>Alterar Senha</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <div className={styles["aux"]}>
            <div className={styles["input-group"]}>
              <LabelInput
                placeholder={"Senha Atual"}
                label={"Senha Atual"}
                type="password"
                value={currentPassword}
                onInput={(e) => handleInputChange(e.target.value, setCurrentPassword)}
              />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput
                placeholder={"Nova Senha"}
                label={"Nova Senha"}
                type="password"
                value={newPassword}
                onInput={(e) => handleInputChange(e.target.value, setNewPassword)}
              />
            </div>
            <button type="submit" className={styles["update-button"]}>Atualizar Senha</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileUpdatePassword;
