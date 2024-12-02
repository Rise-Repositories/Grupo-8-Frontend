import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Dashboard.module.css";
import api from "../../api";
import Modal from 'react-modal';
import { AuthContext } from "../login/AuthContext";
import { Button, Spin, ConfigProvider, Select } from "antd";
import { toast } from "react-toastify";
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

import { CheckCircleOutlined, CloseCircleOutlined, DatabaseOutlined, UserDeleteOutlined, UserAddOutlined, CalendarOutlined, RiseOutlined } from "@ant-design/icons"



const Dashboard = () => {

    const { authToken } = useContext(AuthContext);
    const authorization = 'Bearer ' + authToken;

    let dataAtual = new Date();
    let dataInicial = new Date();
    dataInicial.setFullYear(dataInicial.getFullYear() - 1);
    const [dataFiltro, setDataFiltro] = useState(formatDateTime(dataInicial));
    const [dataFiltro2, setDataFiltro2] = useState(formatDateTime(dataAtual));

    const [actionTagIds, setActionTagIds] = useState([]);

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

    const [optionsActionTags, setOptionsActionsTags] = useState([
        { label: 'Comida', value: 1 },
        { label: 'Itens de Higiene', value: 2 },
        { label: 'Roupas/Cobertores', value: 3 },
        { label: 'Outros', value: 4 }
    ]);

    const handleExportCsv = async () => {

        console.log('Função handleExportCsv chamada');

        const dataInicio = dataFiltro.split('T')[0];
        const dataFim = dataFiltro2.split('T')[0];

        try {

            const url = `/data/export-csv?startDate=${dataInicio}&endDate=${dataFim}&tagIds=${actionTagIds}`;

            const response = await api.get(url, {
                responseType: 'blob',
                headers: { Authorization: authorization },
            });

            console.log('Resposta do servidor:', response);

            const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', 'mapping_graph.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao exportar CSV', error);
        }
    };



    const handleExportJson = async () => {
        console.log('Função handleExportJson chamada');
        const dataInicio = dataFiltro.split('T')[0];
        const dataFim = dataFiltro2.split('T')[0];

        try {
            const url = `/data/export-json?startDate=${dataInicio}&endDate=${dataFim}&tagIds=${actionTagIds}`;

            const response = await api.get(url, {
                responseType: 'json',
                headers: { Authorization: authorization },
            });

            console.log('Resposta do servidor:', response);

            // Converte para string JSON formatada
            const formattedJson = JSON.stringify(response.data, null, 2); // O `2` define o nível de indentação

            const blob = new Blob([formattedJson], { type: 'application/json' });
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', 'mapping_graph.json');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao exportar o JSON', error);
        }
    };

    const handleExportXml = async () => {

        console.log('Função handleExportXml chamada');
        const dataInicio = dataFiltro.split('T')[0];
        const dataFim = dataFiltro2.split('T')[0];

        try {

            const url = `/data/export-xml?startDate=${dataInicio}&endDate=${dataFim}&tagIds=${actionTagIds}`;

            const response = await api.get(url, {
                responseType: 'blob',
                headers: { Authorization: authorization },
            });


            console.log('Resposta do servidor:', response);


            const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', 'mapping_graph.xml');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao exportar XML', error);
        }
    };

    const handleExportParquet = async () => {

        console.log('Função handleExportParquet chamada');
        const dataInicio = dataFiltro.split('T')[0];
        const dataFim = dataFiltro2.split('T')[0];

        try {

            const url = `/data/export-parquet?startDate=${dataInicio}&endDate=${dataFim}&tagIds=${actionTagIds}`;

            const response = await api.get(url, {
                responseType: 'blob',
                headers: { Authorization: authorization },
            });


            console.log('Resposta do servidor:', response);


            const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', 'mapping_graph.parquet');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao exportar Parquet', error);
        }
    };



    const [exporting, setExporting] = useState(false);

    const handleExport = (type) => {
        if (exporting) return;

        setExporting(true);
        if (type === "CSV") {
            handleExportCsv();
        } else if (type === "JSON") {
            handleExportJson();
        } else if (type === "XML") {
            handleExportXml();
        } else if (type === "Parquet") {
            handleExportParquet();
        }
        setTimeout(() => setExporting(false), 1000);
    };

    const [totalUsers, setTotalUsers] = useState(0);

    const [graphData, setGraphData] = useState([]);

    const [afterDate, setAfterDate] = useState("");

    const fetchData = async (date = "") => {
        try {
            const headers = { Authorization: authorization };

            const params = date ? { afterDate: date } : {};

            const [responseAccountData, responseKpis, responseGraphData, userCount] = await Promise.all([
                api.get('/data/mapping-count', { headers }),
                api.get(`/data/kpi?startDate=${dataFiltro.split('T')[0]}&endDate=${dataFiltro2.split('T')[0]}&tagIds=${actionTagIds}`, { params, headers }),
                api.get(`/data/mapping/graph?startDate=${dataFiltro.split('T')[0]}&endDate=${dataFiltro2.split('T')[0]}&tagIds=${actionTagIds}`, { headers }),
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
            toast.error('Ocorreu um erro ao buscar os dados da dashboard. Tente novamente mais tarde.')
        }
    };

    useEffect(() => {
        fetchData(afterDate);
    }, [dataFiltro, dataFiltro2, actionTagIds]);

    useEffect(() => {
        api.get('/tags',
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("USER_TOKEN")}`
                },
            }).then(response => {
                setOptionsActionsTags(response.data.map(tag => {
                    return {
                        label: tag.name,
                        value: tag.id
                    };
                }));
            }).catch(error => {
                toast.error('Não foi possível buscar os filtros de necessidade.');
            });
    }, [])

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
                label: "Total",
                backgroundColor: "#A700FF",
                borderColor: "#A700FF",
                data: graphData.map((data) => data.total),
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

    const handleChangeActionTags = (values) => {
        setActionTagIds(values);
    }

    return (
        <>
            <div className={styles.page}>
                <div className={`${styles["content"]}`}>
                    <div className={styles.container}>
                        <div className={styles["top-info"]}>
                            <div className={styles["page-name"]}>
                                <a>Dashboard</a>
                            </div>
                        </div>
                        <div className={styles["flexRow"]}>
                            <div className={`col-12 col-md-7 ${styles["default-box"]}`}>
                                <div className={styles["top-info row"]} >
                                    <div className={styles["page-name"]}>
                                        <div className={styles["header"]}>
                                            <a>Locais atendidos mês a mês</a>
                                        </div>
                                    </div>
                                </div>
                                <div className={`col-12 col-md-12 ${styles["aux-top-filters"]}`}>
                                    <div className={`col-12 col-md-12 mt-2 mt-md-0 ${styles["date-form"]}`}>
                                        <div className={`col-md-12 ${styles["date-filters-container"]}`}>
                                            <CalendarOutlined style={{ fontSize: '26px', color: '#2968C8' }} />
                                            <div className={styles.row}>
                                                <div className={styles.row}>
                                                    De:
                                                    <CalendarFilter
                                                        dataFiltro={dataFiltro}
                                                        setDataFiltro={setDataFiltro}
                                                    />
                                                </div>
                                                <div className={styles.row}>
                                                    Até:
                                                    <CalendarFilter
                                                        dataFiltro={dataFiltro2}
                                                        setDataFiltro={setDataFiltro2}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`${styles["select-top-filters"]}`}>
                                            Filtrar por necessidade:
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                defaultValue={[]}
                                                value={actionTagIds}
                                                onChange={handleChangeActionTags}
                                                options={optionsActionTags}
                                            />
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
                                                    tension: 0
                                                },
                                                point: {
                                                    radius: 2
                                                },
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        display: true,
                                                        position: "bottom",
                                                    }
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    title: {
                                                        text: 'Quantidade de Pessoas',
                                                        display: true,
                                                        font: {
                                                            weight: 700
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <div className={`col-12 col-md-12 mt-2 mt-md-0 ${styles["date-form"]}`}>
                                    <div className={styles["button-header"]}>
                                        <h6>Exportar Dados em:</h6>
                                        <ConfigProvider
                                            theme={{
                                                token: {
                                                    colorPrimary: "#2968C8",
                                                    borderRadius: 5,
                                                    fontFamily: "Montserrat"
                                                },
                                            }}
                                        >
                                            <Button.Group>
                                                <Button style={{ fontFamily: "Montserrat" }} onClick={() => handleExport("CSV")}>CSV</Button>
                                                <Button style={{ fontFamily: "Montserrat" }} onClick={() => handleExport("JSON")}>JSON</Button>
                                                <Button style={{ fontFamily: "Montserrat" }} onClick={() => handleExport("Parquet")}>Parquet</Button>
                                                <Button style={{ fontFamily: "Montserrat" }} onClick={() => handleExport("XML")}>XML</Button>
                                            </Button.Group>
                                        </ConfigProvider>
                                        {exporting && <Spin style={{ marginLeft: "8px" }} />}
                                    </div>
                                </div>

                            </div>
                            <div className={`col-12 col-md-4 mt-4 mt-md-0 d-flex flex-column ${styles["default-box"]}`}>
                                
                                <div className={styles["page-name"]}>
                                    <a>Engajamento</a>
                                </div>
                                <div className={`col-12 col-md-12 mt-2 mt-md-0 ${styles["date-form"]}`}>
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
                                </div>
                                <div className={`col-12 col-md-12 mt-4 mt-md-0 flex-grow-1 ${styles["standardKPI"]} ${styles["kpi-container-2"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <UserAddOutlined style={{ fontSize: '46px' }} />
                                    </div>
                                    <div className={styles["one.two-margin"]}>
                                        <div className={styles["users-kpi"]}>{totalUsers}</div>
                                        <div className="titleKPI">Usuários cadastrados</div>
                                    </div>
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
                                        <DatabaseOutlined style={{ fontSize: '26px' }} />
                                    </div>
                                    <div>
                                        <div className="valueKPI">{kpis.qtyTotal}</div>
                                        <div className="titleKPI">Total de locais cadastrados</div>
                                    </div>
                                </div>
                                <div className={`col-12 col-md-2 mt-4 mt-md-0 ${styles["standardKPIDark"]} ${styles["kpi-container"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <CheckCircleOutlined style={{ fontSize: '26px' }} />
                                    </div>
                                    <div>
                                        <div className="valueKPI">{kpis.qtyServed} <span className={styles["valueKpiPercent"]}>({kpis.qtyServedPercent}%)</span></div>
                                        <div className="titleKPI">Total de locais atendidos</div>
                                    </div>
                                </div>
                                <div className={`col-12 col-md-2 mt-4 mt-md-0 ${styles["standardKPI"]} ${styles["kpi-container"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <CloseCircleOutlined style={{ fontSize: '26px' }} />
                                    </div>
                                    <div>
                                        <div className="valueKPI">{kpis.qtyNotServed} <span className={styles["valueKpiPercent"]}>({kpis.qtyNotServedPercent}%)</span></div>
                                        <div className="titleKPI">Total de locais não atendidos</div>
                                    </div>
                                </div>
                                <div className={`col-12 col-md-2 mt-4 mt-md-0 ${styles["standardKPIDark"]} ${styles["kpi-container"]}`}>
                                    <div className={styles["iconKPI"]}>
                                        <UserDeleteOutlined style={{ fontSize: '26px' }} />
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
