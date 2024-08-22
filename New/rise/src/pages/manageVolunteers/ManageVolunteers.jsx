import React, { useContext, useEffect, useState } from "react";
import { Modal, Descriptions, Table, Space, Col, Row } from "antd";
import styles from './ManageVolunteers.module.css';
import api from "../../api";
import Sidebar from "../../components/navbar/sidebar/Sidebar";
import StandardInput from "../../components/inputs/standardInput/StandardInput";
import BlueButton from "../../components/buttons/blueButton/BlueButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import Stack from "../../utils/stack";
import { AuthContext } from "../login/AuthContext";

const ManageVolunteers = () => {
    const { authToken } = useContext(AuthContext);
    const Authorization = 'Bearer ' + authToken;

    const [volunteers, setVolunteers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [newVolunteerEmail, setNewVolunteerEmail] = useState('');
    const [actionStack] = useState(new Stack(100));

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const ongId = sessionStorage.getItem('SELECTED_ONG_ID');
                const token = sessionStorage.getItem('USER_TOKEN');

                if (!token) {
                    console.error('Token não encontrado no sessionStorage');
                    return;
                }

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                if (ongId) {
                    const response = await api.get(`/voluntary/${ongId}`, config);
                    setVolunteers(response.data);
                }
            } catch (error) {
                console.error('Erro ao buscar voluntários:', error);
            }
        };

        fetchVolunteers();
    }, []);

    const openModal = (volunteer, status) => {
        setSelectedVolunteer(volunteer);
        setSelectedStatus(status);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVolunteer(null);
        setSelectedStatus('');
    };

    const openAssociateModal = () => {
        setIsAssociateModalOpen(true);
    };

    const closeAssociateModal = () => {
        setIsAssociateModalOpen(false);
        setNewVolunteerEmail('');
    };

    const handleContinue = () => {
        console.log("Email do novo voluntário:", newVolunteerEmail);
        // Lógica para associar o novo voluntário pode ser adicionada aqui
        closeAssociateModal();
    };

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Cargo',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Endereço',
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => `${record.address.street}, ${record.address.number}, ${record.address.city}`,
        },
        {
            title: 'Ações',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <BlueButton txt={"Gerenciar"} onclick={() => openModal(record, "status")} />
                </Space>
            ),
        },
    ];

    const data = volunteers.map((volunteer, index) => ({
        key: index,
        name: volunteer.user.name,
        email: volunteer.user.email,
        role: volunteer.role,
        address: volunteer.user.address,
    }));

    return (
        <><Col className={styles["custom-font"]}>
            <Col>
                <Sidebar />
                <Col className={styles.content}>
                    <div className={styles.container}>
                        <div className={styles["top-info"]}>
                            <div className={styles["page-name"]}>
                                <a>Gerenciar Voluntários</a>
                            </div>
                            <div className={styles["align-input"]}>
                                <StandardInput placeholder={"Pesquise aqui"} />
                            </div>
                            <div className={styles["notifications"]}>
                                <FontAwesomeIcon icon={faArrowRightToBracket} style={{ color: "#00006b" }} />
                            </div>
                        </div>

                        <div className={`col-md-12 ${styles["default-box"]}`}>
                            <div className={styles["top-info"]}>
                                <div className={styles["page-name"]}>
                                    <a>Voluntários associados</a>
                                </div>
                                <BlueButton txt={"ASSOCIAR NOVO VOLUNTÁRIO"} onclick={openAssociateModal} />
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
                title="Informações do Voluntário"
                open={isModalOpen}
                onOk={closeModal}
                onCancel={closeModal}
                centered
            >
                <Descriptions column={1}>
                    <Descriptions.Item label="Nome">{selectedVolunteer?.name}</Descriptions.Item>
                    <Descriptions.Item label="E-mail">{selectedVolunteer?.email}</Descriptions.Item>
                    <Descriptions.Item label="Cargo">{selectedVolunteer?.role}</Descriptions.Item>
                    <Descriptions.Item label="Endereço">
                        {selectedVolunteer?.address?.street}, {selectedVolunteer?.address?.number}, {selectedVolunteer?.address?.city}
                    </Descriptions.Item>

                </Descriptions>
            </Modal>

            <Modal
                title="Associar Novo Voluntário"
                open={isAssociateModalOpen}
                onCancel={closeAssociateModal}
                okText={"Continuar"}
                cancelText={"Voltar"}
                centered

            >
                <div className={styles["modal-email"]}>
                    <a>Informe o e-mail do funcionário a ser associado.</a>
                    <StandardInput
                        placeholder="Digite o e-mail do novo voluntário"
                        value={newVolunteerEmail}
                        onChange={(e) => setNewVolunteerEmail(e.target.value)}
                    />
                </div>
            </Modal>
        </Col>
        </>
    );
};

export default ManageVolunteers;
