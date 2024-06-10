import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import api from "../../api";
import Modal from 'react-modal';

import NavbarVertical from "../../components/navbar/navbarVertical/NavbarVertical";
import StandardInput from "../../components/inputs/standardInput/StandardInput";
import BlueButton from "../../components/buttons/blueButton/BlueButton";
import GreenButton from "../../components/buttons/greenButton/GreenButton";
import RedButton from "../../components/buttons/redButton/RedButton";
import DashboardHeader from "../../components/header/DashboardHeader";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';


import Stack from "../../utils/stack"


const Dashboard = () => {
    return (
        <>
            <div className={styles.page}>
                <NavbarVertical />
                <div className={`col-md-10 ${styles["content"]}`}>
                    <div className={styles.container}>
                        <div className={styles["top-info"]}>
                            <div className={styles["page-name"]}>
                                <a>Dashboard</a>
                            </div>
                            <div className={styles["align-input"]}>
                                <StandardInput placeholder={"Pesquise aqui"} />
                            </div>
                            <div className={styles["notifications"]}>
                                <FontAwesomeIcon icon="fa-regular fa-bell" style={{ color: "#00006b", }} />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#00006b" d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V208c0-61.9 50.1-112 112-112zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" /></svg>
                            </div>
                        </div>

                        <div className={styles["flexRow"]}>
                            <div className={`col-md-7 ${styles["default-box"]}`}>
                                <div className={styles["top-info"]}>
                                    <div className={styles["page-name"]}>
                                        <a>Gráfico mês a mês</a>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-md-4 ${styles["default-box"]}`}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr className={styles["default-list-line"]}>
                                            <th>Cadastros</th>
                                            <th>Cadastros Por Usuário</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className={styles["default-list-line"]}>
                                            <td>batata</td>
                                            <td>asdad</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={`col-md-12 ${styles["default-box"]}`}>

                            <div className={styles["top-info"]}>
                                <div className={styles["page-name"]}>
                                    <a>Análise das métricas do mês de maio</a>
                                </div>
                            </div>
                            <div className={styles["flexRow"]}>
                                <div className={`col-md-2 ${styles["standardKPI"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#2968c8" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>
                                    </div>
                                    <div className="valueKPI">100</div>
                                    <div className="titleKPI">Total de locais cadastrados</div>
                                </div>
                                <div className={`col-md-2 ${styles["standardKPIDark"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#e9f5fe" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>
                                    </div>
                                    <div className="valueKPI">100</div>
                                    <div className="titleKPI">Total de locais cadastrados</div>
                                </div>
                                <div className={`col-md-2 ${styles["standardKPI"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#2968c8" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>
                                    </div>
                                    <div className="valueKPI">100</div>
                                    <div className="titleKPI">Total de locais cadastrados</div>
                                </div>
                                <div className={`col-md-2 ${styles["standardKPIDark"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#e9f5fe" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>

                                    </div>
                                    <div className="valueKPI">100</div>
                                    <div className="titleKPI">Total de locais cadastrados</div>
                                </div>
                            </div>

                            <div className={styles["flexRow"]}>
                                <div className={`col-md-2 ${styles["standardKPI"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#2968c8" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>

                                    </div>
                                    <div className="valueKPI">100</div>
                                    <div className="titleKPI">Total de locais cadastrados</div>
                                </div>
                                <div className={`col-md-2 ${styles["standardKPIDark"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#e9f5fe" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>

                                    </div>
                                    <div className="valueKPI">100</div>
                                    <div className="titleKPI">Total de locais cadastrados</div>
                                </div>
                                <div className={`col-md-2 ${styles["standardKPI"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#2968c8" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>

                                    </div>
                                    <div className="valueKPI">100</div>
                                    <div className="titleKPI">Total de locais cadastrados</div>
                                </div>
                                <div className={`col-md-2 ${styles["standardKPIDark"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#e9f5fe" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>

                                    </div>
                                    <div className="valueKPI">100</div>
                                    <div className="titleKPI">Total de locais cadastrados</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
