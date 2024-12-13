import React, { useState, useContext } from "react";
import styles from "./Login.module.css";
import NavBar from "../../components/navbar/navbarHorizontal/NavbarHorizontal";
import LabelInput from "../../components/inputs/labelInput/LabelInput";
import BlueButton from "../../components/buttons/blueButton/BlueButton";
import backgroundImage from "../../utils/imgs/maos-dadas.png";
import api from "../../api";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "./AuthContext";
import { OngContext } from "../../components/context/ongContext/OngContext"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Login = () => {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const { login } = useContext(AuthContext);
    const { setOngList, setCurOngId, setUserRole } = useContext(OngContext);
    const navigate = useNavigate();

    const handleInputChange = (event, setStateFunction) => {
        setStateFunction(event.target.value);
    }

    const  entrar = () => {
        let config = {
            headers: {
                "Content-type": "application/json"
            }
        }
        let body = {
            email: email,
            password: senha
        }

        api.post('/user/auth/login', body, config)
            .then((respostaObtida) => {
                
                const token = respostaObtida.data.token;
                login(token);
                toast.success("Login efetuado com sucesso");
                checkOng(token);
            })
            .catch((erroOcorrido) => {
                console.log('login', erroOcorrido);
                const statusCode = erroOcorrido.response.status;
                toast.error("Email ou senha incorretos");
            })
    }

    const loginOnEnter = (event) => {
        if (event.key === "Enter") {
            entrar();
        }
    }

    const checkOng = (token) => {
        const Authorization = 'Bearer ' + token;
        api.get('/user/account', {headers: { Authorization }})
        .then(res => {
            let ongsAceitas = res?.data?.voluntary?.filter((v) => {
                return v.ong.status === 'ACCEPTED';
            });
            if (ongsAceitas?.length > 0) {
                setOngList(ongsAceitas.map((v, key) => {
                    if (key === 0) {
                        setCurOngId(v.ong.id);
                        setUserRole(v.role);
                    }
                    return {
                        id: v.ong.id,
                        name: v.ong.name,
                        role: v.role
                    };
                }));
                navigate('../dashboard/main');
            } else {
                navigate('/home');
            }
        });
    }

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
                                <label>Faça seu login</label>
                            </div>
                            <label className={`${styles["standard-text"]}`}>Entre com suas informações pessoais</label>
                        </div>

                        <div className={`${styles["container-inputs-form"]}`}>
                            <LabelInput placeholder={"Digite seu e-mail"} label={"E-mail"} onInput={(e) => handleInputChange(e, setEmail)} onKeyPress={(e) => loginOnEnter(e)}/>
                            <LabelInput placeholder={"Digite sua senha"} label={"Senha"} onInput={(e) => handleInputChange(e, setSenha)} type="password" onKeyPress={(e) => loginOnEnter(e)}/>

                            <div className={`${styles['low-form']}`}>
                                <a href="/recover-password" className="forgot-password-link">Esqueci minha senha</a>
                            </div>
                        </div>

                        <BlueButton onclick={entrar} txt={"Entrar"} />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Login;
