import React from "react";
import styles from "./NavbarHorizontal.module.css";
import BlueButton from "../../buttons/blueButton/BlueButton";
import WhiteButton from "../../buttons/whiteButton/WhiteButton";
import Logo from "../../../utils/imgs/logo.png";
import { Link } from "react-router-dom";

const NavbarHorizontal = () => {
    return (
        <nav className={`navbar navbar-expand-lg navbar-light bg-white ${styles["navbar-style"]}`}>
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img src={Logo} width="70" height="70" className="d-inline-block align-middle" alt="Logo da empresa" />
                </a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item mx-2">
                            <Link to={"/institute-registration"} style={{ textDecoration: 'none' }}>
                                <WhiteButton txt={"Cadastro de Instituto"} />
                            </Link>
                        </li>
                        <li className="nav-item mx-2">
                            <Link to={"/volunteer-registration"} style={{ textDecoration: 'none' }}>
                                <WhiteButton txt={"Cadastro de Usuário"} />
                            </Link>
                        </li>
                        <li className="nav-item mx-2">
                            <Link to="/" style={{ textDecoration: 'none' }}> 
                                <BlueButton txt={"Entrar"} />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavbarHorizontal;
