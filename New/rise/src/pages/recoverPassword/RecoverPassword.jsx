import React, { useState } from "react";
import styles from "./RecoverPassword.module.css";
import NavBar from "../../components/navbar/navbarHorizontal/NavbarHorizontal";
import LabelInput from "../../components/inputs/labelInput/LabelInput";
import BlueButton from "../../components/buttons/blueButton/BlueButton";
import backgroundImage from "../../utils/imgs/maos-dadas.png";
import api from "../../api";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const RecoverPassword = () => {
    const [email, setEmail] = useState("")

    const handleInputChange = (event, setStateFunction) => {
        setStateFunction(event.target.value);
    }

    const send = () => {

        api.patch(`/user/auth/recover?email=${email}`)
            .then(() => {
                toast.success("Email enviado em seu email")

            })
            .catch((erroOcorrido) => {
                console.log(erroOcorrido)
                toast.error("Email nao corresponde a nenhuma conta")
            })
    }

    return (
        <>
            <NavBar />
            <div className={styles["body-content"]}>
                <div className={`${styles["header"]}`}>
                    <div className={`${styles["big-image"]} d-none d-md-block`} style={{ backgroundImage: `url(${backgroundImage})` }} alt="Imagem de destaque">
                    </div>

                    <div className={`${styles["right-form"]}`}>
                        <div className={`${styles["form"]}`}>
                            <div>
                                <div className={`${styles["form-presentation"]}`}>
                                    <FontAwesomeIcon icon={faArrowRightToBracket} style={{ color: '#000000' }} />
                                    <label>Esqueceu sua senha?</label>
                                </div>
                            </div>

                            <div className={`${styles["container-inputs-form"]}`}>
                                <LabelInput placeholder={"Digite seu e-mail"} label={"E-mail"} onInput={(e) => handleInputChange(e, setEmail)} />
                            </div>

                            <BlueButton onclick={send} txt={"Enviar"} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecoverPassword;
