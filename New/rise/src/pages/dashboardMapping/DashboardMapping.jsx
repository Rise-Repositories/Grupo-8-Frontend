import React, { useContext, useEffect, useState } from "react";
import styles from "./DashboardMapping.module.css";
import api from "../../api";
import Heatmap from "../../components/heatmap/Heatmap";
import { formatDate } from "../../utils/globals";
import { AuthContext } from "../login/AuthContext";
import BlueButton from "../../components/buttons/blueButton/BlueButton";
import CalendarFilter from "../../components/calendarFilter/CalendarFilter";
import HashTable from "./HashTable/HashTable";
import ImportTxtModal from "../../components/modals/importTxtModal/importTxtModal";
import { formatDateTime } from "../../utils/globals";
import { OngContext } from "../../components/context/ongContext/OngContext";


const DashboardMapping = () => {
    const { authToken } = useContext(AuthContext);
    const Authorization = 'Bearer ' + authToken;

    const {ongList, curOngId} = useContext(OngContext);

    const [dataFiltro, setDataFiltro] = useState(formatDateTime(new Date()));
    const [dadosMapeamento, setDadosMapeamento] = useState(null);
    const [hashTableTotal, setHashTableTotal] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleExport = () => {
        const startDate = dataFiltro.split('T')[0]; 
        const endDate = new Date().toISOString().split('T')[0]; 

        api.get('data/mapping/archive/txt', {
            headers: { Authorization },
            params: {
                startDate: startDate || null,
                endDate: endDate || null,
            },
            responseType: 'blob', 
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'RiseMapping.txt');
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch((error) => {
                console.error('Erro ao exportar o arquivo:', error);
            });
    };

    useEffect(() => {
        let defaultDate = new Date();
        defaultDate.setMonth(defaultDate.getMonth() - 1);

        api.get('data/mapping/alerts', {
            headers: { Authorization },
            params: {
                beforeDate: dataFiltro ? dataFiltro.split('T')[0] : defaultDate.toISOString().split('T')[0],
            },
        }).then((res) => {
            console.log('Dados da API:', res.data);
            organizeMappings(res.data);
        });
    }, [Authorization]); 

    useEffect(() => {
        if (hashTableTotal) {
            setDadosMapeamento({
                unattended: hashTableTotal.getUnattendedMappings(),
                prioritized: hashTableTotal.getMappingsByPriority(dataFiltro),
            });
        }
    }, [dataFiltro, hashTableTotal]);

    const organizeMappings = (mappings) => {
        const hashTable = new HashTable(mappings.length + 1);
        mappings.forEach(mapping => {
            hashTable.addMapping(mapping);
        });
        setDadosMapeamento({
            unattended: hashTable.getUnattendedMappings(),
            prioritized: hashTable.getMappingsByPriority(),
        });
        setHashTableTotal(hashTable);
    };

    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            year: 'numeric',  // Mudamos para 'numeric' para obter o ano completo
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, ' / '); // Adiciona espaços entre as barras
    };

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.container}>
                    <ImportTxtModal visible={isModalVisible} onClose={handleModalClose} />

                    <div className={styles["top-info"]}>
                        <div className={styles["page-name"]}>
                            <a>Mapeamento</a>
                        </div>
                    </div>

                    <div className={`col-md-12 ${styles["default-box"]}`}>
                        <div className={styles["top-info"]}>
                            <div className={styles["page-name"]}>
                                <a>Locais Não Atendidos</a>
                            </div>
                            <div className={`${styles["top-filters"]}`}>
                                <span>Locais sem atendimento desde:</span>
                                <CalendarFilter dataFiltro={formatarData(dataFiltro)} setDataFiltro={setDataFiltro} />
                                <div className={`${styles["button-container"]}`}>
                                    <BlueButton txt={"Importar dados"} onclick={showModal} />
                                    <BlueButton txt={"Exportar dados"} onclick={handleExport} />
                                </div>
                            </div>
                        </div>

                        <div className={styles['dash-map']}>
                            <div className={`col-12 col-md-5 ${styles['map']}`}>
                                <Heatmap semAtendimentoDesde={dataFiltro}/>
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
                                        {/* {dadosMapeamento && dadosMapeamento.unattended.map((dado, index) => (
                                            <tr key={index}>
                                                <td>{dado.address || 'Endereço desconhecido'}</td>
                                                <td>{formatDate(dado.date) || 'Data desconhecida'}</td>
                                                <td>{dado.lastServed ? 'Sim' : 'Não'}</td>
                                                <td>{dado.lastServed ? formatDate(dado.lastServed) : 'Nunca'}</td>
                                            </tr>
                                        ))} */}
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
    );
};

export default DashboardMapping;
