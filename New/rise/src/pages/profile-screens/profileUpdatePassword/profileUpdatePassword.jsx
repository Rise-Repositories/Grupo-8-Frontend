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
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const userToken = sessionStorage.getItem('USER_TOKEN');

  const handleInputChange = (value, setStateFunction) => {
    setStateFunction(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações
    if (!currentPassword) {
      toast.error('Senha atual é obrigatória');
      return;
    }

    if (!newPassword) {
      toast.error('Nova senha é obrigatória');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('A nova senha e a confirmação não coincidem');
      return;
    }

    try {
      const headers = { 
        'Authorization': `Bearer ${userToken}`, 
        "Content-Type": "application/json" 
      };

  
      const body = { 
        curPassword: currentPassword,
        newPassword: newPassword 
      };

    
      const response = await api.patch(`/user/password`, body, { headers });

     
      if (response.status === 204) {
        toast.success("Senha atualizada com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
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
          <h1 className={styles["header-1"]}>Atualizar Senha</h1>
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
            <div className={styles["input-group"]}>
              <LabelInput
                placeholder={"Confirme a Nova Senha"}
                label={"Confirme a Nova Senha"}
                type="password"
                value={confirmNewPassword}
                onInput={(e) => handleInputChange(e.target.value, setConfirmNewPassword)}
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
