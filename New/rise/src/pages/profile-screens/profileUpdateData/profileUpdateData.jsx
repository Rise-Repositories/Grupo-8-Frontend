import React, { useState, useEffect } from "react";
import styles from './ProfileUpdateData.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import LabelInput from "../../../components/inputs/labelInput/LabelInput";
import { toast } from "react-toastify";
import { validateCEP } from "../../../utils/globals";
import api from "../../../api";

function ProfileUpdateData() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numeroEstabelecimento, setNumeroEstabelecimento] = useState("");
  const [complemento, setComplemento] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const userToken = sessionStorage.getItem('USER_TOKEN');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${userToken}` };
        const response = await api.get(`/user/account`, { headers });

        if (response.status !== 200) {
          throw new Error('Erro ao buscar os detalhes do usuário.');
        }
        console.log(response.data.address)

        const userData = response.data;
        setName(userData.name);
        setEmail(userData.email);
        setCpf(userData.cpf);
        setAddress(userData.address);
      } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
        alert("Erro ao carregar os dados do usuário.");
      }
    };

    fetchUserDetails();
  }, [userToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    const userDto = { name, email, cpf, address, password };

    try {
      const headers = { 'Authorization': `Bearer ${userToken}`, "Content-Type": "application/json" };
      const response = await api.put(`/user/account`, userDto, { headers });

      if (response.status === 200) {
        alert("Usuário atualizado com sucesso!");
        console.log("Usuário atualizado:", response.data);
      } else if (response.status === 409) {
        alert("Conflito: O email ou CPF já está em uso.");
      } else if (response.status === 404) {
        alert("Usuário não encontrado.");
      } else {
        alert("Erro ao atualizar usuário.");
      }
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      alert("Erro ao atualizar o usuário.");
    }
  };

  const fillAddress = (event) => {
    if (validateCEP(event.target.value)) {
      fetch(`https://viacep.com.br/ws/${event.target.value}/json`, {
        method: 'GET'
      })
        .then(fetchRes => {
          let corpoRes = fetchRes.json().then((corpoRes) => {
            console.log(corpoRes);
            if (corpoRes.erro) {
              toast.error('CEP inválido');
            } else {
              setEstado(corpoRes.uf)
              setCidade(corpoRes.localidade);
              setLogradouro(corpoRes.logradouro)
            }
          }).catch(err => {
            toast.error('CEP inválido');
          });
        });
    }
  }


  const handleCEPBlur = (event) => {
    if (!validateCEP(event.target.value)) {
      toast.error('CEP inválido');
    }
  }

  const handleInputChange = (value, setStateFunction) => {
    setStateFunction(value);
  }

  return (
    <div className={"col-12 col-md-5 mx-md-auto"}>
      <div className={styles["container"]}>
        <header className={styles["profile-header"]}>
          <button className={styles.backButton} onClick={() => window.history.back()}>
            <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: "#1a3e95" }} />
          </button>
          <h1 className={styles["header-1"]}>Editar Perfil</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <div className={styles["aux"]}>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"Nome Exemplo"} label={"Nome"} value={name} onInput={(e) => handleInputChange(e.target.value, setName)} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"exemplo@gmail.com"} label={"E-mail"} value={email} onInput={(e) => handleInputChange(e.target.value, setEmail)} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"XXX.XXX.XXX-XX"} label={"CPF"} value={cpf} onInput={(e) => handleInputChange(e.target.value, setCpf)} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"Digite seu CEP"} label={"CEP"} onInput={(e) => handleInputChange(e.target.value.substring(0, 9), setCep)} mask="99999-999" onBlur={(e) => { handleCEPBlur(e); fillAddress(e) }} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={cidade} label={"Cidade"} disabled={true} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={estado} label={"Estado"} disabled={true} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={logradouro} label={"Logradouro"} disabled={true} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"000"} label={"Número"} onInput={(e) => handleInputChange(e.target.value, setNumeroEstabelecimento)} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"Apto 00"} label={"Complemento"} onInput={(e) => handleInputChange(e.target.value, setComplemento)} />
            </div>

            {/* Caso queira adicionar os campos de senha no futuro */}
            {/* <div className={styles["input-group"]}>
              <LabelInput placeholder={"Senha"} label={"Nova Senha"} type={"password"} value={password} onInput={(e) => handleInputChange(e.target.value, setPassword)} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"Confirme a Senha"} label={"Confirmar Senha"} type={"password"} value={confirmPassword} onInput={(e) => handleInputChange(e.target.value, setConfirmPassword)} />
            </div> */}
            
            <button type="submit" className={styles["update-button"]}>Atualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileUpdateData;
