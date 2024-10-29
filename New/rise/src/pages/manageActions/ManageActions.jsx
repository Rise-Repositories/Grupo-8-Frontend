import React, { useContext, useEffect, useState } from "react";
import { Modal, Descriptions, Table, Space, Col, Select, Result, Button, ConfigProvider } from "antd";
import styles from './ManageActions.module.css';
import api from "../../api";
import BlueButton from "../../components/buttons/blueButton/BlueButton";
import { AuthContext } from "../login/AuthContext";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { OngContext } from "../../components/context/ongContext/OngContext";
import WhiteButton from "../../components/buttons/whiteButton/WhiteButton";
import RedButton from "../../components/buttons/redButton/RedButton";
import GreenButton from "../../components/buttons/greenButton/GreenButton";
import { printDateTime } from "../../utils/globals";

const ManageActions = () => {
    const { authToken } = useContext(AuthContext);
    const token = sessionStorage.getItem('USER_TOKEN');
    const { curOngId, userRole } = useContext(OngContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [actions, setActions] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [tableData, setTableData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchActions();
    }, [curOngId]);


    const navigateNewActionRegistration = (curAction) => {
        if (curAction) {
            navigate('/dashboard/new-action', { state: { curAction } });
        } else {
            navigate('/dashboard/new-action');
        }
    };

    const openModal = (action) => {
        console.log('ação ', action);
        setSelectedAction(action);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAction(null);
    };

    const handleActionStatus = async (actionId, newStatus) => {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        await api.patch(`/actions/${curOngId}/${actionId}?status=${newStatus}`, null, config )
        .then((res) => {
            toast.success("Status da ação atualizado com sucesso");
            closeModal();
        })
        .catch((err) => {
            toast.error(err.response.data.message);
        });

        fetchActions();
    }

    const handleStatusFilter = (newStatus) => {
        setStatusFilter(newStatus);

        let filteredTable = [];
        if (newStatus === 'ALL') {
            filteredTable = actions;
        } else {
            filteredTable = actions.filter((action) => {
                return action.status === newStatus;
            });
        }

        setTableData(filteredTable.map((action, index) => ({
                key: index,
                name: action.name,
                inicio: action.datetimeStart,
                fim: action.datetimeEnd,
                qtdeMapeamentos: action.mappingAction.length,
                status: action.status,
                actionId: action.id
            })
        ));
    }

    const fetchActions = async () => {
        try {
            if (!token) {
                toast.error('Não foi possível buscar as ações');
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            if (curOngId) {
                const response = await api.get(`/actions/ong/${curOngId}`, config);
                setActions(response.data);

                let filteredTable = [];
                if (statusFilter === 'ALL') {
                    filteredTable = response.data;
                } else {
                    filteredTable = response.data.filter((action) => {
                        return action.status === statusFilter;
                    });
                }

                setTableData(filteredTable.map((action, index) => ({
                        key: index,
                        name: action.name,
                        inicio: new Date(action.datetimeStart),
                        fim: new Date(action.datetimeEnd),
                        qtdeMapeamentos: action.mappingAction.length,
                        status: action.status,
                        actionId: action.id,
                        latitude: action.latitude,
                        longitude: action.longitude,
                        radius: action.radius
                    })
                ));
            }
        } catch (error) {
            toast.error('Erro ao buscar ações, tente novamente.');
        }
    };

    const parseActionStatus = (enumValue) => {
        switch (enumValue) {
            case 'IN_PROGRESS':
                return 'Aberta';
            case 'PENDING':
                return 'Programada';
            case 'CANCELED':
                return 'Cancelada';
            case 'DONE':
                return 'Finalizada';
            default:
                return '';
        };
    }

    const columns = [
        {
            title: <span style={{ fontFamily: 'Montserrat' }}>Nome</span>,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: <span style={{ fontFamily: 'Montserrat' }}>Início</span>,
            dataIndex: 'inicio',
            key: 'inicio',
            render: (text, record) => (<>{printDateTime(text)}</>)
        },
        {
            title: <span style={{ fontFamily: 'Montserrat' }}>Fim</span>,
            dataIndex: 'fim',
            key: 'fim',
            render: (text, record) => (<>{printDateTime(text)}</>)
        },
        {
            title: <span style={{ fontFamily: 'Montserrat' }}>Locais Atendidos</span>,
            dataIndex: 'qtdeMapeamentos',
            key: 'qtdeMapeamentos'
        },
        {
            title: <span style={{ fontFamily: 'Montserrat' }}>Status</span>,
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (<>{parseActionStatus(text)}</>)
        },
        {
            title: <span style={{ fontFamily: 'Montserrat' }}>Ações</span>,
            key: 'action',
            render: (_, record) => ( 
                <Space size="middle">
                    <BlueButton txt={"Ver"} onclick={() => navigateNewActionRegistration(record)} />
                    { (record.status === 'PENDING' || record.status === 'IN_PROGRESS') &&
                        <WhiteButton txt={"Gerenciar"} onclick={() => openModal(record)} />
                    }
                </Space>
            ),
        },
    ];

    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        fontFamily: "montserrat"
                    },
                }}
            >
                <div className={`${styles["content"]}`}>
                    <div className={styles.container}>
                        <div className={styles["top-info"]}>
                            <div className={`mx-auto mx-md-0 ${styles["page-name"]}`}>
                                <h1>Gerenciar Ações</h1>
                            </div>
                        </div>

                        <div className={`${styles["default-box"]}`}>
                            <div className={styles["top-info"]}>
                                <div className={styles["page-name"]}>
                                    <h1>Ações atuais</h1>
                                </div>
                                <BlueButton txt={"Criar Nova Ação"} onclick={() => {navigateNewActionRegistration(null)}} />
                            </div>
                            <div className={`${styles["filter-box"]}`}>
                                Status das ações:
                                <Select
                                    style={{ width: 140 }}
                                    value={statusFilter}
                                    onChange={(value) => handleStatusFilter(value)}
                                    defaultValue="OPEN"
                                    options={[
                                        { value: 'ALL', label: 'Todos'},
                                        { value: 'IN_PROGRESS', label: 'Aberta'},
                                        { value: 'PENDING', label: 'Programada'},
                                        { value: 'CANCELED', label: 'Cancelada'},
                                        { value: 'DONE', label: 'Finalizada'}
                                    ]}
                                />
                            </div>

                            <div className={styles["table-container"]}>
                                <Col>
                                    <Table
                                        columns={columns}
                                        dataSource={tableData}
                                        scrollToFirstRowOnChange={true}
                                        scroll={{ x: '100%' }}
                                        pagination={{ pageSize: 10 }}
                                        className={styles["custom-font"]}
                                    />
                                </Col>
                            </div>
                        </div>
                    </div>
                </div >

                <Modal
                    title="Informações da Ação"
                    open={isModalOpen}
                    onOk={closeModal}
                    onCancel={closeModal}
                    centered
                    className={styles["custom-font"]}
                    footer={[
                        <div className={styles["modal-buttons-container"]}>
                            { selectedAction?.status !== 'IN_PROGRESS' &&
                                <GreenButton customStyle={styles["modal-button"]} txt={"Iniciar Ação"} onclick={() => {handleActionStatus(selectedAction?.actionId, 'IN_PROGRESS')}} />
                            }
                            <BlueButton customStyle={styles["modal-button"]} txt={"Finalizar Ação"} onclick={() => {handleActionStatus(selectedAction?.actionId, 'DONE')}} />
                            <RedButton customStyle={styles["modal-button"]} txt={"Cancelar Ação"} onclick={() => {handleActionStatus(selectedAction?.actionId, 'CANCELED')}} />
                        </div>
                    ]}
                >
                    <Descriptions column={1}>
                        <Descriptions.Item label="Nome">{selectedAction?.name}</Descriptions.Item>
                        <Descriptions.Item label="Data de início">{new Date(selectedAction?.inicio).toLocaleDateString('pt-BR')}</Descriptions.Item>
                        <Descriptions.Item label="Data de fim">{new Date(selectedAction?.fim).toLocaleDateString('pt-BR')}</Descriptions.Item>
                        <Descriptions.Item label="Quantidade de mapeamentos">{selectedAction?.qtdeMapeamentos}</Descriptions.Item>
                    </Descriptions>
                </Modal>
            </ConfigProvider>
        </>
    );
};

export default ManageActions;