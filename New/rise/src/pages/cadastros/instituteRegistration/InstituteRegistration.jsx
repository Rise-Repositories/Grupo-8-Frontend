import React, { useState } from "react";
import styles from "./InstituteRegistration.module.css";
import NavBar from "../../../components/navbar/navbarHorizontal/NavbarHorizontal";
import LabelInput from "../../../components/inputs/labelInput/LabelInput";
import BlueButton from "../../../components/buttons/blueButton/BlueButton";
import backgroundImage from "../../../utils/imgs/maos-dadas.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";
import VLibras from "@djpfs/react-vlibras";
import api from "../../../api";

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validateCNPJ = (cnpj) => {
    const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return regex.test(cnpj);
};

const validateCPF = (cpf) => {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
};

const validateCEP = (cep) => {
    const regex = /^\d{5}-\d{3}$/;
    return regex.test(cep);
};

const InstituteRegistration = () => {
    const [secondFormVisible, setSecondFormVisible] = useState(false);

    const [razaoSocial, setRazaoSocial] = useState("")
    const [cnpj, setCnpj] = useState("")
    const [cep, setCep] = useState("")
    const [numeroEstabelecimento, setNumeroEstabelecimento] = useState("")
    const [nome, setNome] = useState("")
    const [cpf, setCpf] = useState("")
    const [endereco, setEndereco] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")


    const handleInputChange = (event, setStateFunction) => {
        setStateFunction(event.target.value);
    }

    const handleSave = () => {
        const enderecoCompleto =  `${endereco}, ${numeroEstabelecimento}`;
        
        if (senha != confirmarSenha) {
            toast.error("As senhas digitadas não estão compatíveis.");
            return
        }

        const invalidEmail = !validateEmail(email);
        const invalidCNPJ = !validateCNPJ(cnpj);
        const invalidCPF = !validateCPF(cpf);
        const invalidCEP = !validateCEP(cep);

        if (invalidEmail && invalidCNPJ && invalidCPF && invalidCEP) {
            toast.error("Dados inválidos.");
            return;
        }


        if (!validateEmail(email)) {
            toast.error("Email inválido.");
            return;
        }

        if (!validateCNPJ(cnpj)) {
            toast.error("CNPJ inválido.");
            return;
        }

        if (!validateCPF(cpf)) {
            toast.error("CPF inválido.");
            return;
        }

        if (!validateCEP(cep)) {
            toast.error("CEP inválido.");
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
        api.post('/ong', objetoAdicionado)
        .then(() => {
            toast.success("Novo Card criado com sucesso!");
            sessionStorage.setItem("institute", JSON.stringify(objetoAdicionado));
            // navigate("/")
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
        setSecondFormVisible(true);
    };


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
                                <label>{secondFormVisible ? "Informe os dados do representante do instituto" : "Cadastro de instituto"}</label>
                            </div>
                            <label className={`${styles["standard-text"]}`}>{secondFormVisible ? "Informe os dados do representante do instituto" : "Informe os dados da sua intituição"}</label>
                        </div>

                        <div className={`${styles["container-inputs-form"]} col-md-12`} style={{ display: secondFormVisible ? 'none' : 'block' }}>
                            <LabelInput placeholder={"Digite a razão social"} label={"Razão social"} onInput={(e) => handleInputChange(e, setRazaoSocial)} />
                            <LabelInput placeholder={"Digite seu CNPJ"} label={"CNPJ"} onInput={(e) => handleInputChange(e, setCnpj)}/>
                            <LabelInput placeholder={"Digite o CEP"} label={"CEP"} onInput={(e) => handleInputChange(e, setCep)}/>
                            <LabelInput placeholder={"Digite o número do estabelecimento"} label={"Número do estabelecimento"} onInput={(e) => handleInputChange(e, setNumeroEstabelecimento)}/>
                            <br />

                            <div className={`${styles['low-form']}`}>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="lembrarCheck"></input>
                                    <label className="form-check-label" htmlFor="lembrarCheck">Lembre de mim</label>
                                </div>
                                <a href="#" className="forgot-password-link">esqueci minha senha</a>
                            </div>
                        </div>


                        <div className={`${styles['container-inputs-form']}`} style={{ display: secondFormVisible ? 'block' : 'none' }}>
                            <LabelInput placeholder={"Digite seu nome"} label={"Nome"} onInput={(e) => handleInputChange(e, setNome)} />
                            <LabelInput placeholder={"Digite seu CPF"} label={"CPF"} onInput={(e) => handleInputChange(e, setCpf)}/>
                            <LabelInput placeholder={"Digite seu endereço"} label={"Endereço"} onInput={(e) => handleInputChange(e, setEndereco)}/>
                            <LabelInput placeholder={"Digite seu e-mail"} label={"E-mail"} type="email" onInput={(e) => handleInputChange(e, setEmail)}/>
                            <LabelInput placeholder={"Digite sua senha"} label={"Senha"} type="password" onInput={(e) => handleInputChange(e, setSenha)} />
                            <LabelInput placeholder={"Confirme sua senha"} label={"Confirmação de senha"} type="password" onInput={(e) => handleInputChange(e, setConfirmarSenha)} />
                            <br></br>

                            <div className={`${styles['low-form']}`}>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="lembrarCheck"></input>
                                    <label className="form-check-label" htmlFor="lembrarCheck">Lembre de mim</label>
                                </div>
                                <a href="#" className="forgot-password-link">esqueci minha senha</a>
                            </div>

                        </div>

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
