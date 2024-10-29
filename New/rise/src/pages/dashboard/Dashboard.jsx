import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Dashboard.module.css";
import api from "../../api";
import Modal from 'react-modal';
import { AuthContext } from "../login/AuthContext";

import NavbarVertical from "../../components/navbar/navbarVertical/NavbarVertical";
import Sidebar from "../../components/navbar/sidebar/Sidebar";
import StandardInput from "../../components/inputs/standardInput/StandardInput";
import BlueButton from "../../components/buttons/blueButton/BlueButton";
import GreenButton from "../../components/buttons/greenButton/GreenButton";
import RedButton from "../../components/buttons/redButton/RedButton";
import DashboardHeader from "../../components/header/DashboardHeader";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';


import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

import CalendarFilter from "../../components/calendarFilter/CalendarFilter";
import { formatDateTime } from "../../utils/globals";




const Dashboard = () => {

    const { authToken } = useContext(AuthContext);
    const authorization = 'Bearer ' + authToken;

    let dataAtual = new Date();
    let dataInicial = new Date();
    dataInicial.setFullYear(dataInicial.getFullYear() - 1);
    const [dataFiltro, setDataFiltro] = useState(formatDateTime(dataInicial));
    const [dataFiltro2, setDataFiltro2] = useState(formatDateTime(dataAtual));


    const [accountData, setAccountData] = useState({
        zero: 0,
        oneOrTwo: 0,
        threeOrFour: 0,
        fiveOrMore: 0
    });

    const [kpis, setKpis] = useState({
        qtyTotal: 0,
        qtyServed: 0,
        qtyNotServed: 0,
        qtyNoPeople: 0,
        qtyServedPercent: 0,
        qtyNotServedPercent: 0,
        qtyNoPeoplePercent: 0
    });

    const [totalUsers, setTotalUsers] = useState(0);

    const [graphData, setGraphData] = useState([]);

    const [afterDate, setAfterDate] = useState("");

    const fetchData = async (date = "") => {
        try {
            const headers = { Authorization: authorization };

            const params = date ? { afterDate: date } : {};

            const [responseAccountData, responseKpis, responseGraphData, userCount] = await Promise.all([
                api.get('/data/mapping-count', { headers }),
                api.get(`/data/kpi?startDate=${dataFiltro.split('T')[0]}&endDate=${dataFiltro2.split('T')[0]}`, { params, headers }),
                api.get(`/data/mapping/graph?startDate=${dataFiltro.split('T')[0]}&endDate=${dataFiltro2.split('T')[0]}`, { headers }),
                api.get('/user/total-count', { headers })
            ]);

            setAccountData({
                zero: (responseAccountData.data.zero * 100).toFixed(2),
                oneOrTwo: (responseAccountData.data.oneOrTwo * 100).toFixed(2),
                threeOrFour: (responseAccountData.data.threeOrFour * 100).toFixed(2),
                fiveOrMore: (responseAccountData.data.fiveOrMore * 100).toFixed(2)
            });

            setKpis({
                qtyTotal: responseKpis.data.qtyTotal,
                qtyServed: responseKpis.data.qtyServed,
                qtyNotServed: responseKpis.data.qtyNotServed,
                qtyNoPeople: responseKpis.data.qtyNoPeople,
                qtyServedPercent: ((responseKpis.data.qtyServed / responseKpis.data.qtyTotal) * 100).toFixed(2),
                qtyNotServedPercent: ((responseKpis.data.qtyNotServed / responseKpis.data.qtyTotal) * 100).toFixed(2),
                qtyNoPeoplePercent: ((responseKpis.data.qtyNoPeople / responseKpis.data.qtyTotal) * 100).toFixed(2)
            });


            setGraphData(responseGraphData.data)
            console.log(responseGraphData.data);

            setTotalUsers(userCount.data);

        } catch (error) {
            console.error('Erro ao buscar dados', error);
        }
    };

    useEffect(() => {
        fetchData(afterDate);
    }, [dataFiltro, dataFiltro2]);

    const handleDateChange = (e) => {
        const date = e.target.value;
        const monthNumber = date.split('-')[1];
        const monthName = getMonthName(monthNumber);
        setAfterDate(monthName);
    };

    const getMonthName = (monthNumber) => {
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return monthNames[parseInt(monthNumber, 10) - 1];
    };

    const data = {
        labels: graphData.map((data) => getMonthName(data.month)),
        datasets: [
            {
                label: "Sem Pessoas",
                backgroundColor: "#A700FF",
                borderColor: "#A700FF",
                data: graphData.map((data) => data.no_People),
            },
            {
                label: "Não Atendidos",
                backgroundColor: "#EF4444",
                borderColor: "#EF4444",
                data: graphData.map((data) => data.no_Served),
            },
            {
                label: "Atendidos",
                backgroundColor: "#3CD856",
                borderColor: "#3CD856",
                data: graphData.map((data) => data.served),
            }
        ],
    };

    // Função para formatar a data como dd / mm / yyyy (com espaço entre as barras)
    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            year: 'numeric',  // Mudamos para 'numeric' para obter o ano completo
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, ' / '); // Adiciona espaços entre as barras
    };

    return (
        <>
            <div className={styles.page}>
                <div className={`${styles["content"]}`}>

                    <div className={styles.container}>

                        <div className={styles["top-info"]}>
                            <div className={styles["page-name"]}>
                                <a>Dashboard</a>
                            </div>
                            {/* <div className={styles["align-input"]}>
                                <StandardInput placeholder={"Pesquise aqui"} />
                            </div>
                            <div className={styles["notifications"]}>
                                <FontAwesomeIcon icon="fa-regular fa-bell" style={{ color: "#00006b", }} />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#00006b" d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V208c0-61.9 50.1-112 112-112zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" /></svg>
                            </div> */}
                        </div>
                        <div className={styles["flexRow"]}>
                            <div className={`col-12 col-md-7 ${styles["default-box"]}`}>
                                <div className={styles["top-info"]}>
                                    <div className={styles["page-name"]}>
                                        <a>Locais atendidos mês a mês</a>
                                        <div className={`${styles["aux-top-filters"]}`}>
                                            <div className={`${styles["top-filters"]}`}>
                                                De:
                                                {/* Aqui passamos a data formatada para o CalendarFilter */}
                                                <CalendarFilter
                                                    dataFiltro={formatarData(dataFiltro)}
                                                    setDataFiltro={setDataFiltro}
                                                />
                                            </div>
                                            <div className={`${styles["top-filters"]}`}>
                                                Até:
                                                {/* Aqui passamos a data formatada para o CalendarFilter */}
                                                <CalendarFilter
                                                    dataFiltro={formatarData(dataFiltro2)}
                                                    setDataFiltro={setDataFiltro2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${styles["chart-box"]}`}>
                                    <Line
                                        className={styles.chart}
                                        data={data}
                                        options={{
                                            responsive: true,
                                            elements: {
                                                line: {
                                                    tension: 0.5
                                                },
                                                point: {
                                                    radius: 2
                                                },
                                            },
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                    position: "bottom",
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={`col-12 col-md-4 mt-4 mt-md-0 ${styles["default-box"]}`}>
                                <div className={styles["page-name"]}>
                                    <a>Engajamento</a>
                                </div>
                                <table className={styles.table}>
                                    <thead>
                                        <tr className={styles["default-list-line"]}>
                                            <th>Locais Cadastrados</th>
                                            <th>Porcentagem de Usuários</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className={styles["default-list-line"]}>
                                            <td>0</td>
                                            <td>{accountData.zero}%</td>
                                        </tr>
                                        <tr className={styles["default-list-line"]}>
                                            <td>1 ou 2</td>
                                            <td>{accountData.oneOrTwo}%</td>
                                        </tr>
                                        <tr className={styles["default-list-line"]}>
                                            <td>3 ou 4</td>
                                            <td>{accountData.threeOrFour}%</td>
                                        </tr>
                                        <tr className={styles["default-list-line"]}>
                                            <td>5 ou +</td>
                                            <td>{accountData.fiveOrMore}%</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className={styles["page-name"]}>
                                    <a>Usuários cadastrados: {totalUsers}</a>
                                </div>
                            </div>
                        </div>
                        <div className={`col-12 ${styles["default-box"]}`}>
                            {/* <div className={styles["date-filter"]}>
                                <label htmlFor="afterDate">After Date:</label>
                                <input
                                    type="date"
                                    id="afterDate"
                                    name="afterDate"
                                    value={afterDate}
                                    onChange={handleDateChange}
                                />
                            </div> */}
                            <div className={styles["top-info"]}>
                                <div className={styles["page-name"]}>
                                    {/* <a>Análise das métricas do mês de {afterDate}</a> */}
                                    <a>Locais atendidos de {new Date(dataFiltro).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })} até {new Date(dataFiltro2).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                    </a>
                                </div>
                            </div>
                            <div className={styles["flexRow"]}>
                                <div className={`col-12 col-md-2 mt-4 mt-md-0 ${styles["standardKPI"]} ${styles["kpi-container"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#2968c8" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>
                                    </div>
                                    <div>
                                        <div className="valueKPI">{kpis.qtyTotal}</div>
                                        <div className="titleKPI">Total de locais cadastrados</div>
                                    </div>
                                </div>
                                <div className={`col-12 col-md-2 mt-4 mt-md-0 ${styles["standardKPIDark"]} ${styles["kpi-container"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#e9f5fe" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>
                                    </div>
                                    <div>
                                        <div className="valueKPI">{kpis.qtyServed} <span className={styles["valueKpiPercent"]}>({kpis.qtyServedPercent}%)</span></div>
                                        <div className="titleKPI">Total de locais atendidos</div>
                                    </div>
                                </div>
                                <div className={`col-12 col-md-2 mt-4 mt-md-0 ${styles["standardKPI"]} ${styles["kpi-container"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#2968c8" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>
                                    </div>
                                    <div>
                                        <div className="valueKPI">{kpis.qtyNotServed} <span className={styles["valueKpiPercent"]}>({kpis.qtyNotServedPercent}%)</span></div>
                                        <div className="titleKPI">Total de locais não atendidos</div>
                                    </div>
                                </div>
                                <div className={`col-12 col-md-2 mt-4 mt-md-0 ${styles["standardKPIDark"]} ${styles["kpi-container"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#e9f5fe" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>
                                    </div>
                                    <div>
                                        <div className="valueKPI">{kpis.qtyNoPeople} <span className={styles["valueKpiPercent"]}>({kpis.qtyNoPeoplePercent}%)</span></div>
                                        <div className="titleKPI">Não havia pessoas no local</div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className={styles["flexRow"]}>
                                <div className={`col-md-2 ${styles["standardKPI"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#2968c8" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152c0-13.3 10.7-24 24-24h88c44.2 0 80 35.8 80 80c0 28-14.4 52.7-36.3 67l34.1 75.1c5.5 12.1 .1 26.3-11.9 31.8s-26.3 .1-31.8-11.9L268.9 288H208v72c0 13.3-10.7 24-24 24s-24-10.7-24-24V264 152zm48 88h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H208v64z" /></svg>

                                    </div>
                                    <div className="valueKPI">100</div>
                                    <div className="titleKPI">Taxa de abandono na página</div>
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
                            </div> */}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
