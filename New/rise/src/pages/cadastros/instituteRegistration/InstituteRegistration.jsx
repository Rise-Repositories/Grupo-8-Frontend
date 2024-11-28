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
import { Table, Modal, Input, Space, Button, Form, Checkbox, InputNumber } from 'antd';


const handleTextBlur = (event, message) => {
    if (!validateText(event.target.value)) {
        toast.error(message);
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

const handleCNPJBlur = (event) => {
    if (!validateCNPJ(event.target.value)) {
        toast.error('CNPJ inválido');
    }
}

const handleCEPBlur = (event) => {
    if (!validateCEP(event.target.value)) {
        toast.error('CEP inválido');
    }
}

const InstituteRegistration = () => {
    const navigate = useNavigate();
    const [secondFormVisible, setSecondFormVisible] = useState(false);

    const [razaoSocial, setRazaoSocial] = useState("");
    const [cnpj, setCnpj] = useState("");

    const [cepOng, setCepOng] = useState("");
    const [cidadeOng, setCidadeOng] = useState("");
    const [estadoOng, setEstadoOng] = useState("");
    const [logradouroOng, setLogradouroOng] = useState("");
    const [numeroEstabelecimentoOng, setNumeroEstabelecimentoOng] = useState("");
    const [complementoOng, setComplementoOng] = useState("");

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [endereco, setEndereco] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [cepUser, setCepUser] = useState("");
    const [cidadeUser, setCidadeUser] = useState("");
    const [estadoUser, setEstadoUser] = useState("");
    const [logradouroUser, setLogradouroUser] = useState("");
    const [numeroEstabelecimentoUser, setNumeroEstabelecimentoUser] = useState("");
    const [complementoUser, setComplementoUser] = useState("");

    const [termosAceitos, setTermosAceitos] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        if (isFormVisible) {
            setIsModalVisible(true);
            setIsFormVisible(false);
        } else {
            setIsModalVisible(false);
            setSelectedRecord(null);
        }

    };
    const handleCheckboxChange = (event) => {
        setTermosAceitos(event.target.checked);
    };

    const handleInputChange = (value, setStateFunction) => {
        setStateFunction(value);
    }

    const handleSave = () => {
        if (!validateText(nome)) {
            toast.error('Nome inválido');
            return;
        }

        if (!validateCPF(cpf)) {
            toast.error("CPF inválido");
            return;
        }

        if (!validateCEP(cepUser)) {
            toast.error("CEP inválido");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("E-mail inválido");
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
            toast.error("As senhas são diferentes");
            return;
        }

        if (!termosAceitos) {
            toast.error('Aceite os termos de uso para continuar.');
            return;
        }

        const objetoAdicionado = {
            name: razaoSocial,
            cnpj,
            address: {
                cep: cepOng,
                number: numeroEstabelecimentoOng,
                complement: complementoOng
            },
            user: {
                name: nome,
                email,
                password: senha,
                cpf,
                address: {
                    cep: cepUser,
                    number: numeroEstabelecimentoUser,
                    complement: complementoUser
                }
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

    const fillAddress = (event, type) => {
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
                            if (type === 'ong') {
                                setEstadoOng(corpoRes.uf)
                                setCidadeOng(corpoRes.localidade);
                                setLogradouroOng(corpoRes.logradouro)
                            } else {
                                setEstadoUser(corpoRes.uf)
                                setCidadeUser(corpoRes.localidade);
                                setLogradouroUser(corpoRes.logradouro)
                            }
                        }
                    }).catch(err => {
                        toast.error('CEP inválido');
                    });
                });
        }
    }

    const showSecondForm = () => {

        if (!validateText(razaoSocial)) {
            toast.error('Razão Social inválida');
            return;
        }

        if (!validateCNPJ(cnpj)) {
            toast.error('CNPJ inválido');
            return;
        }

        if (!validateCEP(cepOng)) {
            toast.error("CEP inválido");
            return;
        }

        setSecondFormVisible(true);
    };

    const voltarForm = () => {
        setSecondFormVisible(false);
    };

    return (
        <>
            <NavBar />
            <div className={styles["body-content"]}>
                <div className={`${styles["header"]}`}>
                    <div className={`${styles["big-image"]} d-none d-md-block`} style={{ backgroundImage: `url(${backgroundImage})` }} alt="Imagem de destaque">
                    </div>

                    <div className={`${styles["right-form"]} col-12 col-md-6`}>
                        <div className={`${styles["form"]}`}>
                            <div>
                                <div className={`${styles["form-presentation"]}`}>
                                    <FontAwesomeIcon icon={faArrowRightToBracket} style={{ color: '#000000' }} />
                                    <label>{secondFormVisible ? "Cadastro do Representante" : "Cadastro de Instituto"}</label>
                                </div>
                                <label className={`${styles["standard-text"]}`}>{secondFormVisible ? "Informe os dados do representante do instituto" : "Informe os dados da sua intituição"}</label>
                            </div>

                            <div className={`${styles["container-inputs-form"]} col-md-12`} style={{ display: secondFormVisible ? 'none' : 'flex' }}>
                                <LabelInput placeholder={"Digite a razão social"} label={"Razão social"} onInput={(e) => handleInputChange(e.target.value, setRazaoSocial)} onBlur={(e) => handleTextBlur(e, 'Razão Social inválida')} />
                                <LabelInput placeholder={"Digite seu CNPJ"} label={"CNPJ"} onInput={(e) => handleInputChange(e.target.value.substring(0, 18), setCnpj)} mask="99.999.999/9999-99" onBlur={(e) => handleCNPJBlur(e)} />
                                <LabelInput placeholder={"Digite o CEP"} label={"CEP"} onInput={(e) => handleInputChange(e.target.value.substring(0, 9), setCepOng)} mask="99999-999" onBlur={(e) => { handleCEPBlur(e); fillAddress(e, "ong") }} />
                                <div className='row'>
                                    <div className='col-8 col-md-8'>
                                        <LabelInput placeholder={cidadeOng} label={"Cidade"} disabled={true} />
                                    </div>
                                    <div className='col-4 col-md-4'>
                                        <LabelInput placeholder={estadoOng} label={"Estado"} disabled={true} />
                                    </div>
                                </div>
                                <LabelInput placeholder={logradouroOng} label={"Logradouro"} disabled={true} />
                                <div className={'row'}>
                                    <div className='col-4 col-md-4'>
                                        <LabelInput placeholder={"000"} label={"Número"} onInput={(e) => handleInputChange(e.target.value, setNumeroEstabelecimentoOng)} type="number" />
                                    </div>
                                    <div className='col-8 col-md-8'>
                                        <LabelInput placeholder={"Apto 00"} label={"Complemento"} onInput={(e) => handleInputChange(e.target.value, setComplementoOng)} />
                                    </div>
                                </div>
                                {/* <LabelInput placeholder={"Digite o número do estabelecimento"} label={"Número do estabelecimento"} onInput={(e) => handleInputChange(e.target.value, setNumeroEstabelecimentoOng)} type="number"/> */}
                                <br />
                            </div>

                            <div className={`${styles['container-inputs-form']}`} style={{ display: secondFormVisible ? 'flex' : 'none' }}>
                                <LabelInput placeholder={"Digite seu nome"} label={"Nome"} onInput={(e) => handleInputChange(e.target.value, setNome)} onBlur={(e) => handleTextBlur(e, 'Nome inválido')} />
                                <LabelInput placeholder={"Digite seu CPF"} label={"CPF"} onInput={(e) => handleInputChange(e.target.value.substring(0, 14), setCpf)} mask="999.999.999-99" onBlur={(e) => handleCPFBlur(e)} />
                                <LabelInput placeholder={"Digite seu CEP"} label={"CEP"} onInput={(e) => handleInputChange(e.target.value.substring(0, 9), setCepUser)} mask="99999-999" onBlur={(e) => { handleCEPBlur(e); fillAddress(e, "user") }} />
                                <div className='row'>
                                    <div className='col-8 col-md-8'>
                                        <LabelInput placeholder={cidadeUser} label={"Cidade"} disabled={true} />
                                    </div>
                                    <div className='col-4 col-md-4'>
                                        <LabelInput placeholder={estadoUser} label={"Estado"} disabled={true} />
                                    </div>
                                </div>
                                <LabelInput placeholder={logradouroUser} label={"Logradouro"} disabled={true} />
                                <div className={'row'}>
                                    <div className='col-4 col-md-4'>
                                        <LabelInput placeholder={"000"} label={"Número"} onInput={(e) => handleInputChange(e.target.value, setNumeroEstabelecimentoUser)} type="number" />
                                    </div>
                                    <div className='col-8 col-md-8'>
                                        <LabelInput placeholder={"Apto 00"} label={"Complemento"} onInput={(e) => handleInputChange(e.target.value, setComplementoUser)} />
                                    </div>
                                </div>
                                <LabelInput placeholder={"Digite seu e-mail"} label={"E-mail"} type="email" onInput={(e) => handleInputChange(e.target.value, setEmail)} onBlur={(e) => handleEmailBlur(e)} />
                                <LabelInput placeholder={"Digite sua senha"} label={"Senha"} type="password" onInput={(e) => handleInputChange(e.target.value, setSenha)} onBlur={(e) => handlePasswordBlur(e)} />
                                <LabelInput placeholder={"Confirme sua senha"} label={"Confirmação de senha"} type="password" onInput={(e) => handleInputChange(e.target.value, setConfirmarSenha)} onBlur={(e) => handleConfirmPasswordBlur(e, senha)} />
                                <div className={`${styles['checkbox-container']}`}>
                                    <div className="form-group form-check">
                                        <input type="checkbox" className="form-check-input" id="termosDeUsoOk" checked={termosAceitos} onChange={handleCheckboxChange}></input>
                                        <label className="form-check-label" htmlFor="termosDeUsoOk"><p>Eu concordo com os </p></label>
                                        <button 
                                            className={`${styles['termosLink']}`}
                                            onClick={() => { setIsModalOpen(true); }}
                                        >
                                            Termos de Uso
                                        </button>
                                    </div>
                                </div>
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
            </div>

            <Modal
                title=" Termos de Uso e Política de Privacidade"
                open={isModalOpen}
                onOk={closeModal}
                onCancel={closeModal}
                centered
                className={styles["custom-font"]}
                footer={[
                    <div style={{ textAlign: 'center' }}>
                        <Space size={100}>

                        </Space>
                    </div>
                ]}
            >
                <div className={styles["modalTermosDeUso"]}>
                    Bem-vindo ao Me Ajua (“Site”). Ao acessar e usar este Site, você concorda em cumprir e estar vinculado aos Termos de Uso e Política de Privacidade descritos a seguir. Se você não concorda com algum desses termos, por favor, não utilize o Site.
<br /><br />
                    1. Coleta e Uso de Dados Pessoais: <br />

                    O Site pode coletar dados pessoais como nome, e-mail, telefone e outros dados necessários para cadastro e uso dos serviços oferecidos. Esta coleta será sempre baseada em seu consentimento, exceto nos casos em que a LGPD autorize o tratamento de dados sem consentimento, como para cumprir obrigações legais ou contratuais.
<br /><br />
                    2. Finalidade do Tratamento de Dados: <br />

                    Os dados pessoais coletados serão utilizados para: 

                    Processar e administrar seu cadastro;

                    Melhorar e personalizar a experiência do usuário;

                    Enviar comunicações, notificações e informações relevantes sobre o uso do Site, sempre que autorizado por você;

                    Analisar e melhorar nossos serviços.
                    <br /><br />

                    3. Compartilhamento de Dados Pessoais <br />

                    Seus dados pessoais não serão vendidos, alugados ou compartilhados com terceiros para fins comerciais. Somente compartilhamos dados pessoais com parceiros e prestadores de serviços confiáveis, na medida em que seja necessário para a execução de funcionalidades do Site e conforme autorizado pela LGPD.
<br /><br />
                    4. Direitos do Titular de Dados <br />

                    Conforme a LGPD, você tem o direito de:

                    Acessar os dados que temos sobre você;

                    Corrigir dados incompletos, inexatos ou desatualizados;

                    Revogar o consentimento e solicitar a eliminação de dados pessoais previamente consentidos, exceto quando a manutenção dos dados for necessária para cumprimento de obrigações legais.
<br /><br />
                    5. Segurança dos Dados <br />

                    Adotamos medidas técnicas e organizacionais para proteger os dados pessoais contra acessos não autorizados, perdas, alterações e uso inadequado. No entanto, nenhum sistema é 100% seguro, e não podemos garantir a segurança absoluta das informações.
<br /><br />
                    6. Cookies <br />

                    Utilizamos cookies e tecnologias similares para melhorar sua experiência de navegação. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
<br /><br />
                    7. Alterações nos Termos de Uso e Política de Privacidade <br />

                    Podemos atualizar nossos Termos de Uso e Política de Privacidade periodicamente. As alterações serão comunicadas no Site, e é recomendável que você revise estes termos regularmente.
<br /><br />
                    8. Contato e Dúvidas <br />

                    Caso tenha alguma dúvida sobre este Termo de Uso ou sobre o tratamento dos seus dados pessoais, entre em contato através do e-mail: [E-MAIL DE CONTATO].
<br /><br />
                    9. Legislação e Foro <br />

                    Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa que surja será resolvida no foro da comarca de São Paulo, SP, exceto se houver disposição legal em contrário.

                </div>
            </Modal>
        </>
    );
};

export default InstituteRegistration;
