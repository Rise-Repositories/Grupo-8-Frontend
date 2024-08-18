import React, { useState } from "react";
import styles from "./volunteerRegistration.module.css";
import NavBar from "../../../components/navbar/navbarHorizontal/NavbarHorizontal";
import LabelInput from "../../../components/inputs/labelInput/LabelInput";
import BlueButton from "../../../components/buttons/blueButton/BlueButton";
import backgroundImage from "../../../utils/imgs/maos-dadas.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import api from "../../../api";
import { toast } from "react-toastify";
import { validateText, validateCPF, validateEmail, validatePassword } from "../../../utils/globals";
import { useNavigate } from "react-router-dom";

const handleNameBlur = (event) => {
    if (!validateText(event.target.value)) {
        toast.error('Nome inválido');
    }
}

const handleCPFBlur = (event) => {
    if (!validateCPF(event.target.value)) {
        toast.error('CPF inválido');
    }
}

const handleEmailBlur = (event) => {
    if (!validateEmail(event.target.value)) {
        toast.error('E-mail inválido');
    }
}

const handlePasswordBlur = (event) => {
    if (!validatePassword(event.target.value)) {
        toast.error(<div>
            Senha deve conter:<br />
            - 1 caractere minúsculo<br />
            - 1 caractere maiúsculo<br />
            - 1 número<br />
            - 1 caractere especial<br />
            - pelo menos 6 caracteres
        </div>);
    }
}

const handleConfirmPasswordBlur = (event, firstPassword) => {
    if (firstPassword !== event.target.value) {
        toast.error('As senhas são diferentes');
    }
}

const VolunteerRegistration = () => {
    const navigate = useNavigate();

    const [nome, setNome] = useState("")
    const [cpf, setCpf] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")

    const handleInputChange = (value, setStateFunction) => {
        setStateFunction(value);
    }

    const handleSave = () => {

        if (!validateText(nome)) {
            toast.error('Nome inválido');
            return;
        }

        if (!validateCPF(cpf)) {
            toast.error('CPF inválido');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('E-mail inválido');
            return;
        }

        if (!validatePassword(senha)) {
            toast.error(<div>
                Senha deve conter:<br />
                - 1 caractere minúsculo<br />
                - 1 caractere maiúsculo<br />
                - 1 número<br />
                - 1 caractere especial<br />
                - pelo menos 6 caracteres
            </div>);
            return;
        }

        if (senha !== confirmarSenha) {
            toast.error('As senhas são diferentes');
            return;
        }

        const objetoAdicionado = {
            name: nome,
            email,
            password: senha,
            cpf

        };
        console.log(objetoAdicionado)

        api.post('/user/auth/register', objetoAdicionado

        ).then(() => {
            toast.success("Novo usuário cadastrado com sucesso!");
            sessionStorage.setItem("voluntier",
                JSON.stringify(objetoAdicionado));
            navigate("/");
        }).catch((err) => {
            console.log(err);
            toast.error("Ocorreu um erro ao salvar os dados, por favor, tente novamente.");
        })
    }


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
                                <label>Cadastro de Usuário</label>
                            </div>
                            <label className={`${styles["standard-text"]}`}>Informe seus dados</label>
                        </div>

                        <div className={`${styles["container-inputs-form"]}`}>
                            <LabelInput placeholder={"Digite seu nome"} label={"Nome"} onInput={(e) => handleInputChange(e.target.value, setNome)} onBlur={(e) => handleNameBlur(e)} />
                            <LabelInput placeholder={"Digite seu CPF"} label={"CPF"} onInput={(e) => handleInputChange(e.target.value.substring(0,14), setCpf)} mask="999.999.999-99" onBlur={(e) => handleCPFBlur(e)} />
                            <LabelInput placeholder={"Digite seu e-mail"} label={"E-mail"} onInput={(e) => handleInputChange(e.target.value, setEmail)} onBlur={(e) => handleEmailBlur(e)} />
                            <LabelInput placeholder={"Digite sua senha"} label={"Senha"} onInput={(e) => handleInputChange(e.target.value, setSenha)} type="password" onBlur={(e) => handlePasswordBlur(e)} />
                            <LabelInput placeholder={"Digite a confirmação de senha"} label={"Confirmação de senha"} onInput={(e) => handleInputChange(e.target.value, setConfirmarSenha)} type="password" onBlur={(e) => handleConfirmPasswordBlur(e, senha)} />
                        </div>

                        <BlueButton txt={"Cadastrar"} onclick={handleSave} />

                    </div>
                </div>
            </div>
        </>
    );
};
export default VolunteerRegistration;
