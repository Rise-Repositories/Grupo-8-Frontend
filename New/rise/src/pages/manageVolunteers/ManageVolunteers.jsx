import React, { useContext, useEffect, useState } from "react";
import { Modal, Descriptions, Table, Space, Col, Select, Result, Button, ConfigProvider } from "antd";
import styles from './ManageVolunteers.module.css';
import api from "../../api";
import StandardInput from "../../components/inputs/standardInput/StandardInput";
import BlueButton from "../../components/buttons/blueButton/BlueButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../login/AuthContext";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LabelInput from "../../components/inputs/labelInput/LabelInput";
import { validateText, validateCPF, validateEmail, validateCEP, validatePassword } from "../../utils/globals";


const ManageVolunteers = () => {
    const { authToken } = useContext(AuthContext);
    const [ongId] = useOutletContext();
    const token = sessionStorage.getItem('USER_TOKEN');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [newVolunteerEmail, setNewVolunteerEmail] = useState('');
    const [userToAssociate, setUserToAssociate] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [cep, setCep] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [numeroEstabelecimento, setNumeroEstabelecimento] = useState("");
    const [complemento, setComplemento] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
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
    }, [ongId]);

    const fillAddress = (event) => {
        if (validateCEP(event.target.value)) {
            fetch(`https://viacep.com.br/ws/${event.target.value}/json`, {
                method: 'GET'
            })
                .then(fetchRes => {
                    let corpoRes = fetchRes.json().then((corpoRes) => {
                        console.log(corpoRes);
                        if (corpoRes.erro) {
                            toast.error('CEP inválido');
                        } else {
                            setEstado(corpoRes.uf)
                            setCidade(corpoRes.localidade);
                            setLogradouro(corpoRes.logradouro)
                        }
                    }).catch(err => {
                        toast.error('CEP inválido');
                    });
                });
        }
    }

    const openModal = (volunteer, status) => {
        console.log("O RECORDD")
        console.log(volunteer)
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

    const handleCreateUselModal = () => {
        setNome("");
        setCpf("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
        setCep("");
        setCidade("");
        setEstado("");
        setLogradouro("");
        setNumeroEstabelecimento("");
        setComplemento("");
        setIsCreateUserModalOpen(true);
    };


    const handleInputChange = (value, setStateFunction) => {
        setStateFunction(value);
    }

    const handleContinue = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    email: newVolunteerEmail
                }
            };
            const response = await api.get(`/user`, config);

            if (response.status === 204) {
                handleCreateUselModal();
            } else {
                setUserToAssociate(response.data[0]);
                setIsConfirmModalOpen(true);
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            toast.error('Erro ao buscar usuário, tente novamente.');
        }
    };


    const handleConfirmAssociation = async (confirm) => {
        if (confirm && userToAssociate && selectedRole) {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                };

                const data = {
                    role: selectedRole,
                };

                const response = await api.post(`/voluntary/${ongId}/${userToAssociate.id}`, data, config);

                if (response.status === 201) {
                    toast.success('Usuário associado com sucesso!');
                    fetchVolunteers();
                } else {
                    toast.error('Erro ao associar usuário, tente novamente.');
                }
            } catch (error) {
                toast.error('Erro ao associar usuário, tente novamente.');
            }
        }
        setIsConfirmModalOpen(false);
        setNewVolunteerEmail('');
        setUserToAssociate(null);
        setSelectedRole(null);
    };

    const handleSave = () => {
        if (!validateText(nome)) {
            toast.error('Nome inválido');
            return;
        }

        if (!validateCPF(cpf)) {
            toast.error('CPF inválido');
            return;
        }

        if (!validateCEP(cep)) {
            toast.error("CEP inválido");
            return;
        }

        if (!validateEmail(email)) {
            toast.error('E-mail inválido');
            return;
        }

        if (!validatePassword(senha)) {
            toast.error(
                <div>
                    Senha deve conter:<br />
                    - 1 caractere minúsculo<br />
                    - 1 caractere maiúsculo<br />
                    - 1 número<br />
                    - 1 caractere especial<br />
                    - pelo menos 6 caracteres
                </div>
            );
            return;
        }

        if (senha !== confirmarSenha) {
            toast.error('As senhas são diferentes');
            return;
        }

        const objetoAdicionado = {
            name: nome,
            email,
            password: senha,
            cpf,
            address: {
                cep,
                number: numeroEstabelecimento,
                complement: complemento
            }
        };

        const voluntaryRequestDto = {
            role: selectedRole,
            user: objetoAdicionado
        };

        api.post(`/voluntary/${ongId}`, voluntaryRequestDto, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(() => {
                toast.success("Novo usuário cadastrado com sucesso!");
                sessionStorage.setItem("voluntier", JSON.stringify(objetoAdicionado));

                setNome("");
                setCpf("");
                setEmail("");
                setSenha("");
                setConfirmarSenha("");
                setCep("");
                setCidade("");
                setEstado("");
                setLogradouro("");
                setNumeroEstabelecimento("");
                setComplemento("");

                fetchVolunteers();
                setIsCreateUserModalOpen(false);
                setIsAssociateModalOpen(false);
                setIsConfirmModalOpen(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Ocorreu um erro ao salvar os dados, por favor, tente novamente.");
            });
    };

    const handleNameBlur = (event) => {
        if (!validateText(event.target.value)) {
            toast.error('Nome inválido');
        }
    }

    const handleCPFBlur = (event) => {
        if (!validateCPF(event.target.value)) {
            toast.error('CPF inválido');
        }
    }

    const handleEmailBlur = (event) => {
        if (!validateEmail(event.target.value)) {
            toast.error('E-mail inválido');
        }
    }

    const handlePasswordBlur = (event) => {
        if (!validatePassword(event.target.value)) {
            toast.error(<div>
                Senha deve conter:<br />
                - 1 caractere minúsculo<br />
                - 1 caractere maiúsculo<br />
                - 1 número<br />
                - 1 caractere especial<br />
                - pelo menos 6 caracteres
            </div>);
        }
    }

    const handleConfirmPasswordBlur = (event, firstPassword) => {
        if (firstPassword !== event.target.value) {
            toast.error('As senhas são diferentes');
        }
    }

    const handleCEPBlur = (event) => {
        if (!validateCEP(event.target.value)) {
            toast.error('CEP inválido');
        }
    }

    const handleEditRole = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setIsEditRoleModalOpen(true);
    };

    const handleSaveRole = async () => {
        if (selectedVolunteer && selectedRole) {
            console.log(selectedVolunteer)
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                };

                const data = {
                    "role": `${selectedRole}`
                };

                const response = await api.patch(`/voluntary/${selectedVolunteer.idVoluntarioOng}/role`, data, config);

                if (response.status === 200) {
                    toast.success('Cargo atualizado com sucesso!');
                    fetchVolunteers();
                    setIsEditRoleModalOpen(false);
                    setSelectedVolunteer(null);
                    setSelectedRole(null);
                } else {
                    toast.error('Erro ao atualizar o cargo, tente novamente.');
                }
            } catch (error) {
                toast.error('Erro ao atualizar o cargo, tente novamente.');
            }
        }
        setIsEditRoleModalOpen(false);
        setSelectedRole(null);
    };

    const fetchVolunteers = async () => {
        try {
            if (!token) {
                toast.error('Não foi possível atualizar a lista de voluntários');
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            if (ongId) {
                const response = await api.get(`/voluntary/${ongId}`, config);
                setVolunteers(response.data);
            }
        } catch (error) {
            toast.error('Erro ao buscar voluntários, tente novamente.');
        }
    };


    const columns = [
        {
            title: <span style={{ fontFamily: 'Montserrat' }}>Nome</span>,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: <span style={{ fontFamily: 'Montserrat' }}>E-mail</span>,
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: <span style={{ fontFamily: 'Montserrat' }}>Cargo</span>,
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: <span style={{ fontFamily: 'Montserrat' }}>Endereço</span>,
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => `${record.address.street}, ${record.address.number}, ${record.address.city}`
        },
        {
            title: <span style={{ fontFamily: 'Montserrat' }}>Ações</span>,
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
        idVoluntarioOng: volunteer.id
    }));

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
                            <div className={styles["page-name"]}>
                                <a>Gerenciar Voluntários</a>
                            </div>
                            {/* <div className={styles["align-input"]}>
                                <StandardInput placeholder={"Pesquise aqui"} />
                            </div>
                            <div className={styles["notifications"]}>
                                <FontAwesomeIcon icon={faArrowRightToBracket} style={{ color: "#00006b" }} />
                            </div> */}
                        </div>

                        <div className={`${styles["default-box"]}`}>
                            <div className={styles["top-info"]}>
                                <div className={styles["page-name"]}>
                                    <a>Voluntários associados</a>
                                </div>
                                <BlueButton txt={"ASSOCIAR NOVO VOLUNTÁRIO"} onclick={openAssociateModal} />
                            </div>

                            <div className={styles["table-container"]}>
                                <Col>
                                    <Table
                                        columns={columns}
                                        dataSource={data}
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
                    title="Informações do Voluntário"
                    open={isModalOpen}
                    onOk={closeModal}
                    onCancel={closeModal}
                    centered
                    className={styles["custom-font"]}
                >
                    <Descriptions column={1}>
                        <Descriptions.Item label="Nome">{selectedVolunteer?.name}</Descriptions.Item>
                        <Descriptions.Item label="E-mail">{selectedVolunteer?.email}</Descriptions.Item>
                        <Descriptions.Item label="Cargo">
                            {selectedVolunteer?.role}
                            <Button
                                type="link"
                                onClick={() => handleEditRole(selectedVolunteer)}
                            >
                                Editar Cargo
                            </Button>
                        </Descriptions.Item>
                        <Descriptions.Item label="Endereço">
                            {selectedVolunteer?.address?.street}, {selectedVolunteer?.address?.number}, {selectedVolunteer?.address?.city}
                        </Descriptions.Item>
                    </Descriptions>
                </Modal>

                <Modal
                    title="Editar Cargo do Voluntário"
                    open={isEditRoleModalOpen}
                    onCancel={() => setIsEditRoleModalOpen(false)}
                    onOk={handleSaveRole}
                    okText="Salvar"
                    cancelText="Cancelar"
                    centered
                    className={styles["custom-font"]}
                >
                    <Select
                        placeholder="Selecione o novo cargo"
                        style={{ width: "100%" }}
                        value={selectedRole}
                        onChange={(value) => setSelectedRole(value)}
                    >
                        <Select.Option value="VOLUNTARY">Voluntário</Select.Option>
                        <Select.Option value="ADMIN">Administrador</Select.Option>
                    </Select>
                </Modal>

                <Modal
                    title="Associar Novo Voluntário"
                    open={isAssociateModalOpen}
                    onCancel={closeAssociateModal}
                    okText={"Continuar"}
                    cancelText={"Voltar"}
                    centered
                    className={styles["custom-font"]}
                    onOk={handleContinue}
                >
                    <div className={styles.modalContent}>
                        <LabelInput
                            label="Email do voluntário"
                            placeholder="Digite o e-mail"
                            onInput={(e) => setNewVolunteerEmail(e.target.value)}
                        />
                    </div>
                </Modal>

                <Modal
                    title="Confirmação de Associação"
                    open={isConfirmModalOpen}
                    onCancel={() => setIsConfirmModalOpen(false)}
                    onOk={() => handleConfirmAssociation(true)}
                    okText="Continuar"
                    cancelText="Cancelar"
                    centered
                    className={styles["custom-font"]}
                >
                    <p>Esse usuário já está cadastrado. Caso deseje associá-lo a sua ONG, selecione o cargo que ele ocupará abaixo e então clique em continuar, caso contrário clique em cancelar.</p>
                    <div className={styles.modalContent}>
                        <Select
                            placeholder="Selecione o cargo"
                            style={{ width: "100%" }}
                            onChange={(value) => setSelectedRole(value)}
                        >
                            <Select.Option value="VOLUNTARY">Voluntário</Select.Option>
                            <Select.Option value="ADMIN">Administrador</Select.Option>
                        </Select>
                    </div>
                </Modal>

                <Modal
                    open={isCreateUserModalOpen}
                    onCancel={() => setIsCreateUserModalOpen(false)}
                    footer={null}
                    centered
                >
                    <div className={`${styles["form"]}`}
                        style={{
                            height: '60vh',
                            overflowY: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        <div>
                            <div className={`${styles["form-presentation"]}`}>
                                <FontAwesomeIcon icon={faArrowRightToBracket} style={{ color: '#000000' }} />
                                <label>Cadastro de Usuário</label>
                            </div>
                            <label className={`${styles["standard-text"]}`}>Informe seus dados</label>
                        </div >

                        <div className={`${styles["container-inputs-form"]}`}>

                            <LabelInput placeholder={"Digite seu nome"} label={"Nome"} onInput={(e) => handleInputChange(e.target.value, setNome)} onBlur={(e) => handleNameBlur(e)} />
                            <LabelInput placeholder={"Digite seu CPF"} label={"CPF"} onInput={(e) => handleInputChange(e.target.value.substring(0, 14), setCpf)} mask="999.999.999-99" onBlur={(e) => handleCPFBlur(e)} />
                            <LabelInput placeholder={"Digite seu CEP"} label={"CEP"} onInput={(e) => handleInputChange(e.target.value.substring(0, 9), setCep)} mask="99999-999" onBlur={(e) => { handleCEPBlur(e); fillAddress(e) }} />

                            <div className='row'>
                                <div className='col-md-8'>
                                    <LabelInput placeholder={cidade} label={"Cidade"} disabled={true} />
                                </div>
                                <div className='col-md-4'>
                                    <LabelInput placeholder={estado} label={"Estado"} disabled={true} />
                                </div>
                            </div>

                            <LabelInput placeholder={logradouro} label={"Logradouro"} disabled={true} />

                            <div className={'row'}>
                                <div className='col-md-4'>
                                    <LabelInput placeholder={"000"} label={"Número"} onInput={(e) => handleInputChange(e.target.value, setNumeroEstabelecimento)} type="number" />
                                </div>
                                <div className='col-md-8'>
                                    <LabelInput placeholder={"Apto 00"} label={"Complemento"} onInput={(e) => handleInputChange(e.target.value, setComplemento)} />
                                </div>
                            </div>

                            <LabelInput placeholder={"Digite seu e-mail"} label={"E-mail"} onInput={(e) => handleInputChange(e.target.value, setEmail)} onBlur={(e) => handleEmailBlur(e)} />
                            <LabelInput placeholder={"Digite sua senha"} label={"Senha"} onInput={(e) => handleInputChange(e.target.value, setSenha)} type="password" onBlur={(e) => handlePasswordBlur(e)} />
                            <LabelInput placeholder={"Digite a confirmação de senha"} label={"Confirmação de senha"} onInput={(e) => handleInputChange(e.target.value, setConfirmarSenha)} type="password" onBlur={(e) => handleConfirmPasswordBlur(e, senha)} />

                            <div>
                                <label className={styles["label-spacing"]}>Informe o cargo do novo usuário</label>
                                <Select
                                    placeholder="Selecione o cargo"
                                    style={{ width: "100%" }}
                                    onChange={(value) => setSelectedRole(value)}
                                >
                                    <Select.Option value="VOLUNTARY">Voluntário</Select.Option>
                                    <Select.Option value="ADMIN">Administrador</Select.Option>
                                </Select>
                            </div>
                        </div>

                        <BlueButton txt={"Cadastrar"} onclick={handleSave} />

                    </div >
                </Modal >

            </ConfigProvider>
        </>
    );
};

export default ManageVolunteers;