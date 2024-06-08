import React from "react";
import styles from "./InstituteList.module.css";

import NavbarVertical from "../../components/navbar/navbarVertical/NavbarVertical";
import StandardInput from "../../components/inputs/standardInput/StandardInput";
import BlueButton from "../../components/buttons/blueButton/BlueButton";
import GreenButton from "../../components/buttons/greenButton/GreenButton";
import RedButton from "../../components/buttons/redButton/RedButton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';

const InstituteList = () => {
    const institutes = [
        {
            name: "Instituto ABC",
            cnpj: "12.345.678/0001-90",
            phone: "(11) 1234-5678",
            email: "contato@institutoabc.org",
            representative: "João Silva",
            status: "Ativo",
        },
        {
            name: "Instituto XYZ",
            cnpj: "98.765.432/0001-09",
            phone: "(21) 9876-5432",
            email: "contato@institutoxyz.org",
            representative: "Maria Oliveira",
            status: "Inativo",
        },
    ];

    return (
        <>
            <div className={styles.page}>
                <NavbarVertical />
                <div className={`col-md-10 ${styles["content"]}`}>
                    <div className={styles.container}>
                        <div className={styles["top-info"]}>
                            <div className={styles["page-name"]}>
                                <a>Lista de Cadastros</a>
                            </div>
                            <div className={styles["align-input"]}>
                                <StandardInput placeholder={"Pesquise aqui"} />
                            </div>
                            <div className={styles["notifications"]}>
                                <FontAwesomeIcon icon="fa-regular fa-bell" style={{ color: "#00006b", }} />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#00006b" d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V208c0-61.9 50.1-112 112-112zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" /></svg>
                            </div>
                        </div>

                        <div className={`col-md-12 ${styles["default-box"]}`}>
                            <div className={styles["top-info"]}>
                                <div className={styles["page-name"]}>
                                    <a>Lista de cadastros institucionais</a>
                                </div>
                                <BlueButton txt={"Desfazer"}></BlueButton>
                            </div>

                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles["default-list-line"]}>
                                        <th>Nome do instituto</th>
                                        <th>CNPJ</th>
                                        <th>Telefone</th>
                                        <th>E-mail</th>
                                        <th>Nome do representante</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {institutes.map((institute, index) => (
                                        <tr key={index} className={styles["default-list-line"]}>
                                            <td>{institute.name}</td>
                                            <td>{institute.cnpj}</td>
                                            <td>{institute.phone}</td>
                                            <td>{institute.email}</td>
                                            <td>{institute.representative}</td>
                                            <td>{institute.status}</td>
                                            <td className={styles["td-buttons"]}>
                                                <RedButton txt={"Recusar"} />
                                                <GreenButton txt={"Aprovar"} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default InstituteList;
