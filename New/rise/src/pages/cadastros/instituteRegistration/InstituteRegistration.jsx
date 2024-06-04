import React, { useState } from "react";
import styles from "./InstituteRegistration.module.css";
import NavBar from "../../../components/navbar/navbarHorizontal/NavbarHorizontal";
import LabelInput from "../../../components/inputs/labelInput/LabelInput";
import BlueButton from "../../../components/buttons/blueButton/BlueButton";
import backgroundImage from "../../../utils/imgs/maos-dadas.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import VLibras from "@djpfs/react-vlibras";

const InstituteRegistration = () => {
    const [secondFormVisible, setSecondFormVisible] = useState(false);

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
                            <LabelInput placeholder={"Digite a razão social"} label={"Razão social"} />
                            <LabelInput placeholder={"Digite seu CNPJ"} label={"CNPJ"} />
                            <LabelInput placeholder={"Digite o CEP"} label={"CEP"} />
                            <LabelInput placeholder={"Digite o número do estabelecimento"} label={"Número do estabelecimento"} />
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
                            <LabelInput placeholder={"Digite seu nome"} label={"Nome"} />
                            <LabelInput placeholder={"Digite seu CPF"} label={"CPF"} />
                            <LabelInput placeholder={"Digite seu endereço"} label={"Endereço"} />
                            <LabelInput placeholder={"Digite seu e-mail"} label={"E-mail"} type="email" />
                            <LabelInput placeholder={"Digite sua senha"} label={"Senha"} type="password" />
                            <LabelInput placeholder={"Confirme sua senha"} label={"Confirmação de senha"} type="password" />
                            <br></br>

                            <div className={`${styles['low-form']}`}>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="lembrarCheck"></input>
                                    <label className="form-check-label" htmlFor="lembrarCheck">Lembre de mim</label>
                                </div>
                                <a href="#" className="forgot-password-link">esqueci minha senha</a>
                            </div>

                        </div>

                        <BlueButton txt={secondFormVisible ? "Cadastrar" : "Continuar"} onclick={showSecondForm} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default InstituteRegistration;
