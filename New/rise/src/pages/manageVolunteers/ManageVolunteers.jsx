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
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
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
        <>
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
                                <BlueButton txt={"ASSOCIAR NOVO VOLUNTÁRIO"} />
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
        </>
    );
};

export default ManageVolunteers;
