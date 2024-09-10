import React, { useContext, useEffect, useState } from "react";
import styles from "./DashboardMapping.module.css";
import api from "../../api";
import Heatmap from "../../components/heatmap/Heatmap";
import { formatDate } from "../../utils/globals";
import { AuthContext } from "../login/AuthContext";
import StandardInput from "../../components/inputs/standardInput/StandardInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useOutletContext } from "react-router-dom";
import HashTable from "./HashTable/HashTable";
import { Modal, Calendar } from "antd";
import BlueButton from "../../components/buttons/blueButton/BlueButton";

const DashboardMapping = () => {
    const { authToken } = useContext(AuthContext);
    const Authorization = 'Bearer ' + authToken;

    let dataAtual = new Date();
    if (dataAtual.getMonth() === 0) {
        dataAtual.setFullYear(dataAtual.getFullYear() - 1);
        dataAtual.setMonth(11);
    } else {
        dataAtual.setMonth(dataAtual.getMonth() - 1);
    }

    const [dataFiltro, setDataFiltro] = useState(dataAtual.toISOString().split('T')[0]);
    const [dadosMapeamento, setDadosMapeamento] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const [ongId] = useOutletContext();

    useEffect(() => {
        let defaultDate = new Date();
        defaultDate.setMonth(defaultDate.getMonth() - 1);

        api.get('data/mapping/alerts', {
            headers: { Authorization },
            params: {
                beforeDate: dataFiltro ? dataFiltro : defaultDate.toISOString().split('T')[0]
            }
        }).then((res) => {
            console.log('Dados da API:', res.data);
            organizeMappings(res.data); // Organizar os dados na hash table
        });
    }, [dataFiltro]);

    // Função para organizar marcações utilizando a HashTable
    const organizeMappings = (mappings) => {
        const hashTable = new HashTable();

        mappings.forEach(mapping => {
            hashTable.addMapping(mapping);
        });
        console.log(hashTable)

        // Definir os dados para o estado
        setDadosMapeamento({
            unattended: hashTable.getUnattendedMappings(),
            prioritized: hashTable.getMappingsByPriority()
        });
    };
    const calendarioAlterarData = (value, source) => {
        setDataFiltro(value.toISOString().split('T')[0]);
        console.log('alterarData, ', value.format('YYYY-MM-DD'), source);
    };
    
    const closeCalendario = () => {

        setIsCalendarOpen(false);
    }

    return (
        <>
            <div className={styles.page}>
                <div className={`${styles["content"]}`}>
                    <div className={styles.container}>
                        <div className={styles["top-info"]}>
                            <div className={styles["page-name"]}>
                                <a>Mapeamento</a>
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
                                    <a>Locais Não Atendidos</a>
                                    Locais sem atendimento desde: <button onClick={() => setIsCalendarOpen(true)}>{dataFiltro}</button>
                                </div>
                            </div>

                            <div className={styles['dash-map']}>
                                <div className={`col-12 col-md-5 ${styles['map']}`}>
                                    <Heatmap />
                                </div>

                                <div className={`col-12 col-md-7 mt-3 mt-md-0 ps-md-4 ${styles['tableHeightScroll']}`}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Endereço</th>
                                                <th scope="col">Data de Cadastro</th>
                                                <th scope="col">Já foi Atendido</th>
                                                <th scope="col">Última Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dadosMapeamento && dadosMapeamento.unattended.map((dado, index) => (
                                                <tr key={index}>
                                                    <td>{dado.address || 'Endereço desconhecido'}</td>
                                                    <td>{formatDate(dado.date) || 'Data desconhecida'}</td>
                                                    <td>{dado.lastServed ? 'Sim' : 'Não'}</td>
                                                    <td>{dado.lastServed ? formatDate(dado.lastServed) : 'Nunca'}</td>
                                                </tr>
                                            ))}
                                            {dadosMapeamento && dadosMapeamento.prioritized.map((dado, index) => (
                                                <tr key={index}>
                                                    <td>{dado.address || 'Endereço desconhecido'}</td>
                                                    <td>{formatDate(dado.date) || 'Data desconhecida'}</td>
                                                    <td>{dado.lastServed ? 'Sim' : 'Não'}</td>
                                                    <td>{dado.lastServed ? formatDate(dado.lastServed) : 'Nunca'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={isCalendarOpen}
                onCancel={() => closeCalendario()}
                footer={null}
                centered>
                <Calendar fullscreen={false} onSelect={calendarioAlterarData} />
                <BlueButton txt={"Selecionar Data"} onclick={closeCalendario} />
            </Modal>
        </>
    );
};

export default DashboardMapping;
