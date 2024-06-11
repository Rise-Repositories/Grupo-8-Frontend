import React, { useContext, useEffect, useState } from "react";
import styles from "./DashboardMapping.module.css";
import NavbarVertical from "../../components/navbar/navbarVertical/NavbarVertical";
import api from "../../api";
import Heatmap from "../../components/heatmap/Heatmap";
import formatDate from "../../utils/globals";
import { AuthContext } from "../login/AuthContext";


const DashboardMapping = () => {

    const { authToken } = useContext(AuthContext);
    const Authorization = 'Bearer ' + authToken;
    
    const [dataFiltro, setDataFiltro] = useState('2024-05-05');
    const [dadosMapeamento, setDadosMapeamento] = useState(null);

    useEffect(() => {
        api.get('data/mapping/alerts', {
            headers: { Authorization }
        }).then((res) => {
            console.log(res);
            setDadosMapeamento(res.data);
        })
    }, [dataFiltro]);

    return (
        <>
            <div className={styles['container']}>

                <NavbarVertical />
                <div className={styles['dash-container']}>
                    <div className={styles['dash-title']}>
                        <h1>Mapeamento</h1>
                    </div>

                    <div className={styles['dash-data']}>

                        <h2>Locais Não Atendidos</h2>

                        <div className={styles['dash-map']}>
                            <div className={`col-12 col-md-5 ${styles['map']}`}>
                                <Heatmap />
                            </div>

                            <div className={`col12 col-md-7 ps-md-4 ${styles['tableHeightScroll']}`}>
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
                                        {dadosMapeamento && dadosMapeamento.map((dado, index) => (
                                            <tr key={index}>
                                                <td>{dado.address}</td>
                                                <td>{formatDate(dado.date)}</td>
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
        </>
    );
};

export default DashboardMapping;
