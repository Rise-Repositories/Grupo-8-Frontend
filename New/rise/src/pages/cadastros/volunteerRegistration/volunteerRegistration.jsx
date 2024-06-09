import React , { useState }  from "react";
import styles from "./volunteerRegistration.module.css";
import NavBar from "../../../components/navbar/navbarHorizontal/NavbarHorizontal";
import LabelInput from "../../../components/inputs/labelInput/LabelInput";
import BlueButton from "../../../components/buttons/blueButton/BlueButton";
import backgroundImage from "../../../utils/imgs/maos-dadas.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import VLibras from "@djpfs/react-vlibras";
import api from "../../../api";
import { toast } from "react-toastify";

const validateCPF = (cpf) => {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
};

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const VolunteerRegistration = () => {

    const [nome, setNome] = useState("")
    const [cpf, setCpf] = useState("")
    const [email, setEmail] = useState ("")
    const [senha, setSenha] = useState ("")
    const [confirmarSenha, setConfirmarSenha] = useState ("")

    const handleInputChange = (event, setStateFunction) => {
        setStateFunction(event.target.value);
    }

    const handleSave = () => {
        
        if (senha != confirmarSenha) {
            toast.error("As senhas digitadas não estão compatíveis.");
            return
        }

        const invalidEmail = !validateEmail(email);
        const invalidCPF = !validateCPF(cpf);

        if (invalidEmail && invalidCPF) {
            toast.error("Dados inválidos.");
            return;
        }


        if (!validateEmail(email)) {
            toast.error("Email inválido.");
            return;
        }

        if (!validateCPF(cpf)) {
            toast.error("CPF inválido.");
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
            toast.success("Novo Card criado com sucesso!");
            sessionStorage.setItem("voluntier",
                JSON.stringify(objetoAdicionado));
            //navigate("/")
        }).catch(() => {
            toast.error("Ocorreu um erro ao salvar os dados, por favor, tente novamente.");
        })
    }


    return (
        <>
            <VLibras forceOnload={true} />
            <NavBar />
            <div className={`${styles["header"]}`}>
                <div className={`${styles["big-image"]} d-none d-md-block`} style={{ backgroundImage: `url(${backgroundImage})` }} alt="Imagem de destaque">
                </div>

                <div className={`${styles["right-form"]}`}>
                    <div className={`${styles["form"]}`}>
                        <div>
                            <div className={`${styles["form-presentation"]}`}>
                                <FontAwesomeIcon icon={faArrowRightToBracket} style={{ color: '#000000' }} />
                                <label>Cadastro de voluntário</label>
                            </div>
                            <label className={`${styles["standard-text"]}`}>Informe seus dados</label>
                        </div>

                        <div className={`${styles["container-inputs-form"]}`}>
                            <LabelInput placeholder={"Digite seu nome"} label={"Nome"} onInput={(e) => handleInputChange(e, setNome)} />
                            <LabelInput placeholder={"Digite seu CPF"} label={"CPF"} onInput={(e) => handleInputChange(e, setCpf)} />
                            <LabelInput placeholder={"Digite seu e-mail"} label={"E-mail"} onInput={(e) => handleInputChange(e, setEmail)} />
                            <LabelInput placeholder={"Digite sua senha"} label={"Senha"} onInput={(e) => handleInputChange(e, setSenha)} />
                            <LabelInput placeholder={"Digite a confirmação de senha"} label={"Confirmação de senha"} onInput={(e) => handleInputChange(e, setConfirmarSenha)}/>

                            <div className={`${styles['low-form']}`}>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="lembrarCheck"></input>
                                    <label className="form-check-label" htmlFor="lembrarCheck">Lembre de mim</label>
                                </div>
                                <a href="#" className="forgot-password-link">esqueci minha senha</a>
                            </div>
                        </div>

                        <BlueButton txt={"Cadastrar"} onclick={handleSave}/>

                    </div>
                </div>
            </div>
        </>
    );
};
export default VolunteerRegistration;
