import React, { useContext, useEffect, useState } from "react";
import styles from "./InstituteList.module.css";
import api from "../../api";

import { Modal, Table, Space, Col, Row } from "antd";
import StandardInput from "../../components/inputs/standardInput/StandardInput";
import BlueButton from "../../components/buttons/blueButton/BlueButton";
import GreenButton from "../../components/buttons/greenButton/GreenButton";
import RedButton from "../../components/buttons/redButton/RedButton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Stack from "../../utils/stack"
import { AuthContext } from "../login/AuthContext";
import { OngContext } from "../../components/context/ongContext/OngContext";
import { useNavigate } from "react-router-dom";


const InstituteList = () => {

    const { authToken } = useContext(AuthContext);
    const { userRole } = useContext(OngContext);

    const navigate = useNavigate();
    const Authorization = 'Bearer ' + authToken;

    const [institutes, setInstitutes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInstitute, setSelectedInstitute] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [actionStack] = useState(new Stack(100));

    useEffect(() => {
        api.get('ong', {
            headers: { Authorization }
        })
            .then((res) => {
                const formattedData = res.data.map((institute) => {
                    const owner = institute.voluntaries.find(voluntary => voluntary.role === "OWNER");
                    return {
                        ...institute,
                        representative: owner ? owner.user.name : "N/A",
                        representativeEmail: owner ? owner.user.email : "N/A",
                        statusText: institute.status === "PENDING" ? "Pendente" :
                            institute.status === "ACCEPTED" ? "Permitido" :
                                institute.status === "REJECTED" ? "Negado" : institute.status
                    };
                });
                setInstitutes(formattedData);
            })
            .catch((error) => {
                console.error('Erro ao buscar dados:', error);
            });
    }, []);

    useEffect(() => {
        if (userRole !== 'OWNER' && userRole !== 'ADMIN') {
            navigate('/dashboard/main');
        }
    }, [userRole]);

    const updateInstituteStatus = (id, status, addToStack = true) => {
        api.patch(`ong/${id}/status`, { status }, {
            headers: { Authorization }
        })
            .then((response) => {
                if (addToStack) {
                    actionStack.push({ id, previousStatus: institutes.find(inst => inst.id === id).status, newStatus: status });
                }
                setInstitutes(prevInstitutes => prevInstitutes.map(institute =>
                    institute.id === id ? { ...institute, status, statusText: status === "ACCEPTED" ? "Permitido" : "Negado" } : institute
                ));
                closeModal();
            })
            .catch((error) => {
                console.error('Erro ao atualizar status:', error);
            });
    };

    const openModal = (institute, status) => {
        setSelectedInstitute(institute);
        setSelectedStatus(status);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInstitute(null);
        setSelectedStatus('');
    };

    const confirmUpdateStatus = () => {
        updateInstituteStatus(selectedInstitute.id, selectedStatus);
    };

    const undoLastAction = () => {
        if (!actionStack.isEmpty()) {
            const lastAction = actionStack.pop();
            updateInstituteStatus(lastAction.id, lastAction.previousStatus, false);
        }
    };

    const columns = [
        {
            title: 'Nome do Instituto',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'CNPJ',
            dataIndex: 'cnpj',
            key: 'cnpj',
        },
        {
            title: 'Nome do representante',
            dataIndex: 'representative',
            key: 'representative',
        },
        {
            title: 'E-mail do representante',
            dataIndex: 'representativeEmail',
            key: 'representativeEmail',
        },
        {
            title: 'Status',
            dataIndex: 'statusText',
            key: 'statusText',
        },
        {
            title: 'Ações',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === "PENDING" && (
                        <>
                            <RedButton onclick={() => openModal(record, "REJECTED")} txt={"Recusar"} />
                            <GreenButton onclick={() => openModal(record, "ACCEPTED")} txt={"Aprovar"} />
                        </>
                    )}
                    {record.status === "ACCEPTED" && (
                        <RedButton onclick={() => openModal(record, "REJECTED")} txt={"Recusar"} />
                    )}
                    {record.status === "REJECTED" && (
                        <GreenButton onclick={() => openModal(record, "ACCEPTED")} txt={"Aprovar"} />
                    )}
                </Space>
            ),
        },
    ];

    const data = institutes.map((institute, index) => ({
        key: index,
        id: institute.id,
        name: institute.name,
        cnpj: institute.cnpj,
        representative: institute.representative,
        representativeEmail: institute.representativeEmail,
        statusText: institute.statusText,
        status: institute.status
    }));

    return (
        <><Col>
            <Col>
                <Col className={styles.content}>
                    <div className={styles.container}>
                        <div className={styles["top-info"]}>
                            <div className={styles["page-name"]}>
                                <a>Lista de Cadastros</a>
                            </div>
                            {/* <div className={styles["align-input"]}>
                                <StandardInput placeholder={"Pesquise aqui"} />
                            </div>
                            <div className={styles["notifications"]}>
                                <FontAwesomeIcon icon="fa-regular fa-bell" style={{ color: "#00006b", }} />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#00006b" d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V208c0-61.9 50.1-112 112-112zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" /></svg>
                            </div> */}
                        </div>

                        <div className={`col-md-12 ${styles["default-box"]}`}>
                            <div className={styles["top-info"]}>
                                <div className={styles["page-name"]}>
                                    <a>Lista de cadastros institucionais</a>
                                </div>
                                <BlueButton txt={"Desfazer"} onclick={undoLastAction} />
                            </div>

                            <div className={styles["table-container"]}>
                                <Table
                                    columns={columns}
                                    dataSource={data}
                                    scroll={{ x: 'max-content' }}
                                    pagination={{ pageSize: 10 }}
                                />
                            </div>

                        </div>
                    </div>
                </Col>
            </Col>

            <Modal
                title="Confirmação de Atualização"
                open={isModalOpen}
                centered
                footer={[
                <div className={styles["modal-buttons"]}>
                    <BlueButton txt={"Cancelar"} onclick={closeModal} />
                    <GreenButton txt={"Confirmar"} onclick={confirmUpdateStatus} />
                </div>
                ]}
            >
                    <p>Tem certeza que deseja {selectedStatus === "ACCEPTED" ? "permitir" : "recusar"} o acesso da ONG "{selectedInstitute?.name}"?</p>
            </Modal>
            </Col>
        </>
    );
};

export default InstituteList;
