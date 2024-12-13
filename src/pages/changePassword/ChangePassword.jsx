import React, { useState } from "react";
import styles from "./ChangePassword.module.css";
import NavBar from "../../components/navbar/navbarHorizontal/NavbarHorizontal";
import LabelInput from "../../components/inputs/labelInput/LabelInput";
import BlueButton from "../../components/buttons/blueButton/BlueButton";
import backgroundImage from "../../utils/imgs/maos-dadas.png";
import api from "../../api";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";


const ChangePassword = () => {
    const [password, setPassword] = useState("")
    const { id } = useParams();

    const handleInputChange = (event, setStateFunction) => {
        setStateFunction(event.target.value);
    }

    const send = () => {
        api.patch(`/user/auth/recover/${id}`, { password })
            .then(() => {
                toast.success("Senha alterada com sucesso")

            })
            .catch((erroOcorrido) => {
                console.log(erroOcorrido)
                toast.error("Ocorreu um erro ao alterar a senha. Tente novamente mais tarde.")
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
                                <label>Insira sua nova senha</label>
                            </div>
                        </div>

                        <div className={`${styles["container-inputs-form"]}`}>
                            <LabelInput placeholder={"Senha"} label={"Nova Senha"} onInput={(e) => handleInputChange(e, setPassword)}/>
                        </div>

                        <BlueButton onclick={send} txt={"Enviar"} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
