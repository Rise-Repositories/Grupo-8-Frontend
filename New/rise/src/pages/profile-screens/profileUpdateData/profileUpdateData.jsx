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
<<<<<<< Updated upstream
        <div className={"col-12 col-md-5 mx-md-auto"} >
    <div className={styles["container"]}>
        <header className={styles["profile-header"]}>
=======
    <div className={"col-12 col-md-5 mx-md-auto"}>
      <div className={styles["container"]}>
        <header>
>>>>>>> Stashed changes
          <button className={styles.backButton} onClick={() => window.history.back()}>
            <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: "#1a3e95" }} />
          </button>
          <h1 className={styles["header-1"]}>Editar Perfil</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <div className={styles["aux"]}>
            <div className={styles["input-group"]}>
<<<<<<< Updated upstream
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
=======
              <label htmlFor="name">Nome:</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome Exemplo" />
            </div>
            <div className={styles["input-group"]}>
              <label htmlFor="email">E-mail:</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemplo@gmail.com" />
            </div>
            <div className={styles["input-group"]}>
              <label htmlFor="cpf">CPF:</label>
              <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="XXX.XXX.XXX-XX" />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"Digite seu CEP"} label={"CEP"} onInput={(e) => handleInputChange(e.target.value.substring(0, 9), setCep)} mask="99999-999" onBlur={(e) => { handleCEPBlur(e); fillAddress(e) }} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={cidade} label={"Cidade"} disabled={true} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={estado} label={"Estado"} disabled={true} />
>>>>>>> Stashed changes
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={logradouro} label={"Logradouro"} disabled={true} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"000"} label={"Número"} onInput={(e) => handleInputChange(e.target.value, setNumeroEstabelecimento)}/>
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"Apto 00"} label={"Complemento"} onInput={(e) => handleInputChange(e.target.value, setComplemento)} />
            </div>

            {/*   <div className={styles["input-group"]}>
              <label htmlFor="password">Nova Senha:</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className={styles["input-group"]}>
              <label htmlFor="confirmPassword">Confirmar nova senha:</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div> */}
            <button type="submit" className={styles["update-button"]}>Atualizar</button>
          </div>
        </form>
      </div >
    </div >
  );
}

export default ProfileUpdateData;
