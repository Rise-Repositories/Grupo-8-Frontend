import React from "react";
import styles from "./volunteerRegistration.module.css";
import NavBar from "../../../components/navbar/navbarHorizontal/NavbarHorizontal";
import LabelInput from "../../../components/inputs/labelInput/LabelInput";
import BlueButton from "../../../components/buttons/blueButton/BlueButton";
import backgroundImage from "../../../utils/imgs/maos-dadas.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import VLibras from "@djpfs/react-vlibras";

const VolunteerRegistration = () => {
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
                            <LabelInput placeholder={"Digite seu nome"} label={"Nome"} />
                            <LabelInput placeholder={"Digite seu CPF"} label={"CPF"} />
                            <LabelInput placeholder={"Digite seu endereço"} label={"Endereço"} />
                            <LabelInput placeholder={"Digite seu e-mail"} label={"E-mail"} />
                            <LabelInput placeholder={"Digite sua senha"} label={"Senha"} />
                            <LabelInput placeholder={"Digite a confirmação de senha"} label={"Confirmação de senha"} />

                            <div className={`${styles['low-form']}`}>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="lembrarCheck"></input>
                                    <label className="form-check-label" htmlFor="lembrarCheck">Lembre de mim</label>
                                </div>
                                <a href="#" className="forgot-password-link">esqueci minha senha</a>
                            </div>
                        </div>

                        <BlueButton txt={"Cadastrar"} />

                        <div vw class="enabled">
                            <div vw-access-button class="active"></div>
                            <div vw-plugin-wrapper>
                                <div class="vw-plugin-top-wrapper"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default VolunteerRegistration;
