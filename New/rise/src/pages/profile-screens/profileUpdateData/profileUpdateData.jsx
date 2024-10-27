import React, { useState, useEffect } from "react";
import styles from './ProfileUpdateData.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import LabelInput from "../../../components/inputs/labelInput/LabelInput";
import { toast } from "react-toastify";
import { validateText, validateCPF, validateEmail, validateCEP } from "../../../utils/globals";
import api from "../../../api";
import AvatarComponent from "../../../components/dataDisplay/avatar/AvatarComponent";

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
  const [address, setAddress] = useState("");
  const [userId, setUserId] = useState(null);
  const userToken = sessionStorage.getItem('USER_TOKEN');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${userToken}` };
        const response = await api.get(`/user/account`, { headers });

        if (response.status !== 200) {
          throw new Error('Erro ao buscar os detalhes do usuário.');
        }

        const userData = response.data;
        setUserId(userData.id);
        setName(userData.name);
        setEmail(userData.email);
        setCpf(userData.cpf);
        setCep(userData.address.cep);
        setAddress(userData.address);
        setCidade(userData.address.city);
        setEstado(userData.address.state);
        setLogradouro(userData.address.street);
        setNumeroEstabelecimento(userData.address.number);
        setComplemento(userData.address.complement);
      } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
        toast.error("Erro ao carregar os dados do usuário.");
      }
    };

    fetchUserDetails();
  }, [userToken]);

  const handleCPFBlur = (event) => {
    if (!validateCPF(event.target.value)) {
      toast.error('CPF inválido');
    }
  };

  const handleCEPBlur = (event) => {
    if (!validateCEP(event.target.value)) {
      toast.error('CEP inválido');
    }
  };

  const fillAddress = async (event) => {
    if (validateCEP(event.target.value)) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${event.target.value}/json`);
        const data = await response.json();

        if (data.erro) {
          toast.error('CEP inválido');
        } else {
          setEstado(data.uf);
          setCidade(data.localidade);
          setLogradouro(data.logradouro);
        }
      } catch (err) {
        toast.error('Erro ao buscar o CEP');
      }
    }
  };

  const handleInputChange = (value, setStateFunction) => {
    setStateFunction(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!validateText(name)) {
      toast.error('Nome inválido');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('E-mail inválido');
      return;
    }


    const userDto = {
      name,
      email,
      ...(cpf && { cpf }),
      address: {
        ...(cep && { cep }),
        ...(numeroEstabelecimento && { number: numeroEstabelecimento }),
        ...(complemento && { complement: complemento })
      }
    };

    console.log(userDto);

    try {
      const headers = { 'Authorization': `Bearer ${userToken}`, "Content-Type": "application/json" };
      const response = await api.put(`/user/${userId}`, userDto, { headers });

      if (response.status === 200) {
        toast.success("Usuário atualizado com sucesso!");
      } else if (response.status === 409) {
        toast.error("Conflito: O email ou CPF já está em uso.");
      } else if (response.status === 404) {
        toast.error("Usuário não encontrado.");
      } else {
        toast.error("Erro ao atualizar usuário.");
      }
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      toast.error("Erro ao atualizar o usuário.");
    }
  };

  return (
    <div className={"col-12 col-md-5 mx-md-auto"}>
      <div className={styles["container"]}>
        <header className={styles["profile-header"]}>
          <button className={styles["back-button"]} onClick={() => window.history.back()}>
            <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: "#1a3e95" }} />
          </button>
          <h1 className={styles["header-1"]}>Editar Perfil</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <h3>
              <AvatarComponent size={150} />
            </h3>
          </div>
          <div className={styles["aux"]}>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"Nome Exemplo"} label={"Nome"} value={name} onInput={(e) => handleInputChange(e.target.value, setName)} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"exemplo@gmail.com"} label={"E-mail"} value={email} onInput={(e) => handleInputChange(e.target.value, setEmail)} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"Digite seu CPF"} label={"CPF"} value={cpf} onInput={(e) => handleInputChange(e.target.value.substring(0, 14), setCpf)} mask="999.999.999-99" onBlur={handleCPFBlur} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"Digite seu CEP"} label={"CEP"} value={cep} onInput={(e) => handleInputChange(e.target.value.substring(0, 9), setCep)} mask="99999-999" onBlur={(e) => { handleCEPBlur(e); fillAddress(e) }} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={cidade || "Cidade"} label={"Cidade"} value={cidade} disabled={true} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={estado || "Estado"} label={"Estado"} value={estado} disabled={true} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={logradouro || "Logradouro"} label={"Logradouro"} value={logradouro} disabled={true} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"000"} label={"Número"} value={numeroEstabelecimento} onInput={(e) => handleInputChange(e.target.value, setNumeroEstabelecimento)} />
            </div>
            <div className={styles["input-group"]}>
              <LabelInput placeholder={"Apto 00"} label={"Complemento"} value={complemento} onInput={(e) => handleInputChange(e.target.value, setComplemento)} />
            </div>
            <button type="submit" className={styles["update-button"]}>Atualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileUpdateData;
