import React, { useState } from "react";
import styles from "./InstituteRegistration.module.css";
import NavBar from "../../../components/navbar/navbarHorizontal/NavbarHorizontal";
import LabelInput from "../../../components/inputs/labelInput/LabelInput";
import BlueButton from "../../../components/buttons/blueButton/BlueButton";
import WhiteButton from "../../../components/buttons/whiteButton/WhiteButton";
import backgroundImage from "../../../utils/imgs/maos-dadas.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";
import api from "../../../api";
import { validateText, validateCPF, validateEmail, validatePassword, validateCNPJ, validateCEP } from "../../../utils/globals";
import { useNavigate } from "react-router-dom";

const handleTextBlur = (event, message) => {
    if(!validateText(event.target.value)) {
        toast.error(message);
    }
}

const handleCPFBlur = (event) => {
    if(!validateCPF(event.target.value)) {
        toast.error('CPF inválido');
    }
}

const handleEmailBlur = (event) => {
    if(!validateEmail(event.target.value)) {
        toast.error('E-mail inválido');
    }
}

const handlePasswordBlur = (event) => {
    if(!validatePassword(event.target.value)) {
        toast.error(<div>
            Senha deve conter:<br/>
            - 1 caractere minúsculo<br/>
            - 1 caractere maiúsculo<br/>
            - 1 número<br/>
            - 1 caractere especial<br/>
            - pelo menos 6 caracteres
            </div>);
    }
}

const handleConfirmPasswordBlur = (event, firstPassword) => {
    if(firstPassword !== event.target.value) {
        toast.error('As senhas são diferentes');
    }
}

const handleCNPJBlur = (event) => {
    if(!validateCNPJ(event.target.value)) {
        toast.error('CNPJ inválido');
    }
}

const handleCEPBlur = (event) => {
    if(!validateCEP(event.target.value)) {
        toast.error('CEP inválido');
    }
}

const InstituteRegistration = () => {
    const navigate = useNavigate();
    const [secondFormVisible, setSecondFormVisible] = useState(false);

    const [razaoSocial, setRazaoSocial] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [cep, setCep] = useState("");
    const [numeroEstabelecimento, setNumeroEstabelecimento] = useState("");
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [endereco, setEndereco] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const handleInputChange = (value, setStateFunction) => {
        setStateFunction(value);
    }

    const handleSave = () => {
        const enderecoCompleto =  `${endereco}, ${numeroEstabelecimento}`;

        if(!validateText(nome)) {
            toast.error('Nome inválido');
            return;
        }

        if (!validateCPF(cpf)) {
            toast.error("CPF inválido");
            return;
        }

        if(!validateText(endereco)) {
            toast.error('Endereço inválido');
            return;
        }

        if (!validateEmail(email)) {
            toast.error("E-mail inválido");
            return;
        }

        if(!validatePassword(senha)) {
            toast.error(<div>
                Senha deve conter:<br/>
                - 1 caractere minúsculo<br/>
                - 1 caractere maiúsculo<br/>
                - 1 número<br/>
                - 1 caractere especial<br/>
                - pelo menos 6 caracteres
                </div>);
                return;
        }

        if (senha !== confirmarSenha) {
            toast.error("As senhas são diferentes");
            return;
        }

        const objetoAdicionado = {
            name: razaoSocial,
            cnpj,
            cep,
            address: enderecoCompleto,
            user: {
                name: nome,
                email,
                password: senha,
                cpf
            }
        };

        console.log(objetoAdicionado)
        api.post('/ong/auth', objetoAdicionado)
        .then(() => {
            toast.success("Nova ONG cadastrada com sucesso!");
            sessionStorage.setItem("institute", JSON.stringify(objetoAdicionado));
            navigate("/");
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status === 409) {
                } else {
                    toast.error("Ocorreu um erro ao salvar os dados, por favor, tente novamente.");
                }
            } else {
                toast.error("Erro ao se conectar com o servidor, por favor, tente novamente.");
            }
        });
    }

    const showSecondForm = () => {

        if(!validateText(razaoSocial)) {
            toast.error('Razão Social inválida');
            return;
        }

        if(!validateCNPJ(cnpj)) {
            toast.error('CNPJ inválido');
            return;
        }

        if (!validateCEP(cep)) {
            toast.error("CEP inválido");
            return;
        }

        setSecondFormVisible(true);
    };

    const voltarForm = () => {
        console.log('aaaaaaaaaaa');
        setSecondFormVisible(false);
    };

    return (
        <>
            <NavBar />
            <div className={`${styles["header"]}`}>
                <div className={`${styles["big-image"]} d-none d-md-block`} style={{ backgroundImage: `url(${backgroundImage})` }} alt="Imagem de destaque">
                </div>

                <div className={`${styles["right-form"]}`}>
                    <div className={`${styles["form"]}`}>
                        <div>
                            <div className={`${styles["form-presentation"]}`}>
                                <FontAwesomeIcon icon={faArrowRightToBracket} style={{ color: '#000000' }} />
                                <label>{secondFormVisible ? "Informe os dados do representante do instituto" : "Cadastro de instituto"}</label>
                            </div>
                            <label className={`${styles["standard-text"]}`}>{secondFormVisible ? "Informe os dados do representante do instituto" : "Informe os dados da sua intituição"}</label>
                        </div>

                        <div className={`${styles["container-inputs-form"]} col-md-12`} style={{ display: secondFormVisible ? 'none' : 'block' }}>
                            <LabelInput placeholder={"Digite a razão social"} label={"Razão social"} onInput={(e) => handleInputChange(e.target.value, setRazaoSocial)} onBlur={(e) => handleTextBlur(e, 'Razão Social inválida')}/>
                            <LabelInput placeholder={"Digite seu CNPJ"} label={"CNPJ"} onInput={(e) => handleInputChange(e.target.value.substring(0, 18), setCnpj)} mask="99.999.999/9999-99" onBlur={(e) => handleCNPJBlur(e)}/>
                            <LabelInput placeholder={"Digite o CEP"} label={"CEP"} onInput={(e) => handleInputChange(e.target.value.substring(0, 9), setCep)} mask="99999-999" onBlur={(e) => handleCEPBlur(e)}/>
                            <LabelInput placeholder={"Digite o número do estabelecimento"} label={"Número do estabelecimento"} onInput={(e) => handleInputChange(e.target.value, setNumeroEstabelecimento)} type="number"/>
                            <br />
                        </div>

                        <div className={`${styles['container-inputs-form']}`} style={{ display: secondFormVisible ? 'block' : 'none' }}>
                            <LabelInput placeholder={"Digite seu nome"} label={"Nome"} onInput={(e) => handleInputChange(e.target.value, setNome)} onBlur={(e) => handleTextBlur(e, 'Nome inválido')}/>
                            <LabelInput placeholder={"Digite seu CPF"} label={"CPF"} onInput={(e) => handleInputChange(e.target.value.substring(0, 14), setCpf)} mask="999.999.999-99" onBlur={(e) => handleCPFBlur(e)}/>
                            <LabelInput placeholder={"Digite seu endereço"} label={"Endereço"} onInput={(e) => handleInputChange(e.target.value, setEndereco)} onBlur={(e) => handleTextBlur(e, 'Endereço inválido')}/>
                            <LabelInput placeholder={"Digite seu e-mail"} label={"E-mail"} type="email" onInput={(e) => handleInputChange(e.target.value, setEmail)} onBlur={(e) => handleEmailBlur(e)}/>
                            <LabelInput placeholder={"Digite sua senha"} label={"Senha"} type="password" onInput={(e) => handleInputChange(e.target.value, setSenha)} onBlur={(e) => handlePasswordBlur(e)}/>
                            <LabelInput placeholder={"Confirme sua senha"} label={"Confirmação de senha"} type="password" onInput={(e) => handleInputChange(e.target.value, setConfirmarSenha)} onBlur={(e) => handleConfirmPasswordBlur(e, senha)}/>
                            <br />
                        </div>

                        {secondFormVisible && (
                            <WhiteButton txt="Voltar" onclick={voltarForm} />
                        )}

                        <BlueButton 
                            txt={secondFormVisible ? "Cadastrar" : "Continuar"}
                            onclick={secondFormVisible ? handleSave : showSecondForm} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default InstituteRegistration;
