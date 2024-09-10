//npm install antd react-highlight-words @ant-design/icons

import React, { useRef, useState } from 'react';
import styles from './actionRegistration.module.css';
import LabelInput from "../../../components/inputs/labelInput/LabelInput";
import BlueButton from '../../../components/buttons/blueButton/BlueButton';
import WhiteButton from '../../../components/buttons/whiteButton/WhiteButton';
import StandardInput from '../../../components/inputs/standardInput/StandardInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slider, Table, Modal, Input, Space, Button, Form, Checkbox } from 'antd'; // Importação dos componentes do Ant Design
import { SearchOutlined } from '@ant-design/icons'; // Importação do ícone de pesquisa
import Highlighter from 'react-highlight-words'; // Importação do Highlighter para destacar texto
import 'antd/dist/reset.css';


const ActionRegistration = () => {
    const [radius, setRadius] = useState(3);
    const [showMapping, setShowMapping] = useState(false);
    const [showAddresses, setShowAddresses] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        setSearchText(selectedKeys[0]);
        confirm();
        setSearchedColumn(dataIndex);

    };


    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{ padding: 8 }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Procurar
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Resetar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => confirm({ closeDropdown: false })}
                    >
                        Filtro
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        Fechar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ color: filtered ? '#1677ff' : undefined }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => {
            const textToHighlight = text ? text.toString() : '';
            return searchedColumn === dataIndex && searchText ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={textToHighlight}
                />
            ) : (
                textToHighlight
            );
        },
    });

    const columns = [
        {
            title: 'Endereço',
            dataIndex: 'enderecos',
            key: 'enderecos',
            ...getColumnSearchProps('enderecos'),

        },
        {
            title: 'Qtd. Adultos',
            dataIndex: 'adultos',
            key: 'adultos',
            sorter: {
                compare: (a, b) => a.adultos - b.adultos,
                multiple: 3,
            },

        },
        {
            title: 'Qtd. Crianças e Adolescentes',
            dataIndex: 'criancas',
            key: 'criancas',
            sorter: {
                compare: (a, b) => a.criancas - b.criancas,
                multiple: 4,
            },

        },
        {
            title: 'Última ação no local',
            dataIndex: 'date',
            key: 'date',
            ...getColumnSearchProps('date'),

        },
        {
            title: 'Há pessoas com transtorno',
            dataIndex: 'transtorno',
            key: 'transtorno',
        },
        {
            title: 'Ver Detalhes',
            dataIndex: '',
            key: 'x',
            render: (record) => (
                <BlueButton txt="Detalhes" onclick={() => showDetalhes(record)} className={styles["detail-button"]} customStyle={styles["padding-detalhes"]}/>
            ),
        },
    ];

    const showDetalhes = (record) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setShowMapping(true);
        setIsRegistered(false);
        setIsFinished(false);
    }

    const handleOk = () => {
        if (isFormVisible) {
            setIsRegistered(true);
            setIsModalVisible(false);
            setIsFormVisible(false);
        } else {
            setIsFormVisible(true);
        }
    };

    const handleCancel = () => {
        if (isFormVisible) {
            setIsModalVisible(true);
            setIsFormVisible(false);
        } else {
            setIsModalVisible(false);
        }

    };

    const finishAction = () => {
        setIsFinished(true);
    }

    const concludeFinishAction = () => {
        setShowMapping(false);
        setShowAddresses(false);
        setIsModalVisible(false);
        setIsFormVisible(false);
        setIsRegistered(false);
        setIsFinished(false);
        setRadius(3);
        // Se você estiver usando refs nos inputs para resetar o valor
        if (searchInput.current) {
            searchInput.current.value = '';
        }
    }

    const data = [
        {
            key: 1,
            transtorno: 'Não',
            adultos: 2,
            enderecos: 'Faria Lima, 930 - São Paulo',
            date: "20/08/2024",
            criancas: 1
        }, {
            key: 2,
            transtorno: 'Sim',
            adultos: 3,
            enderecos: 'Haddock Lobo, 595 - Av. Paulista',
            date: "03/05/2022",
            criancas: 3
        }, {
            key: 3,
            transtorno: 'Não',
            adultos: 3,
            enderecos: 'Faria Lima, 930 - São Paulo',
            date: "20/08/2024",
            criancas: 7
        }, {
            key: 4,
            transtorno: 'Não',
            adultos: 4,
            enderecos: 'Faria Lima, 930 - São Paulo',
            date: "20/08/2024",
            criancas: 7
        }, {
            key: 5,
            transtorno: 'Não',
            adultos: 2,
            enderecos: 'Faria Lima, 930 - São Paulo',
            date: "20/08/2024",
            criancas: 2
        }, {
            key: 6,
            transtorno: 'Não',
            adultos: 2,
            enderecos: 'Av. Senador Vergueiro, 20 - Centro',
            date: "31/10/2023",
            criancas: 1
        },
    ];

    const TableComponent = () => (

        <Table
            columns={columns}
            expandable={{
                expandedRowRender: (record) => (
                    <p style={{ margin: 0 }}>
                        {record.description}
                    </p>
                ),
                rowExpandable: (record) => record.name === "",
            }}
            dataSource={data}
            scroll={{
                x: 150,
            }}
            pagination={{ pageSize: 3 }}
        />
    );

    const DonationForm = () => (
        <Form
            layout="vertical"
            className="donation-form"
        >
            <Form.Item
                name="notPossible"
                valuePropName="checked"
                className="form-checkbox"
            >
                <Checkbox>Não foi possível realizar a doação</Checkbox>
            </Form.Item>

            <Form.Item
                label="Descrição (O que foi doado, sugestão de doações para próxima ação)"
                name="description"
            >
                <Input.TextArea rows={4} />
            </Form.Item>
            <div className={styles["form-row"]}>
                <LabelInput label={"Quantidade de adultos:"} placeholder={"Digite a quantidade"} />
                <LabelInput label={"Quantidade de Crianças/adolescentes:"} placeholder={"Digite a quantidade"} />
            </div>
        </Form>
    );

    return (
        <>
            <div className={styles.page}>
                <div className={`col-md-12 ${styles["content"]}`}>
                    <div className={styles.container}>
                        <div className={styles["top-info"]}>
                            <div className={styles["page-name"]}>
                                <a>Registro de ação</a>
                            </div>
                            <div className={styles["align-input"]}>
                                <StandardInput placeholder={"Pesquise aqui"} />
                            </div>
                            <div className={styles["notifications"]}>
                                <FontAwesomeIcon icon="fa-regular fa-bell" style={{ color: "#00006b", }} />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#00006b" d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V208c0-61.9 50.1-112 112-112zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" /></svg>
                            </div>
                        </div>

                        {!showMapping && !showAddresses && (
                            <div className={`col-md-8 ${styles["default-box"]}`}>
                                <div className={styles["top-info-inside"]}>
                                    <div className={styles["page-name"]}>
                                        <a>Buscar endereços próximos de:</a>
                                    </div>
                                </div>
                                <div className={styles["input-group"]}>
                                    <div className='col-md-8'>
                                        <LabelInput label={"CEP:"} placeholder={"Digite seu CEP"} />
                                    </div>
                                    <div className='col-md-16'>
                                        <LabelInput label={"Logradouro:"} placeholder={"Digite seu logradouro"} />
                                    </div>
                                </div>
                                <div className={styles["input-group"]}>
                                    <div className='col-md-8'>
                                        <LabelInput label={"Número:"} placeholder={"Digite o número"} />
                                    </div>
                                    <div className='col-md-12'>
                                        <LabelInput label={"Bairro:"} placeholder={"Digite o bairro"} />
                                    </div>
                                </div>
                                <div className={`col-md-12 ${styles["input-group"]}`}>
                                    <div className='col-md-11'>
                                        <LabelInput label={"Cidade:"} placeholder={"Digite a cidade"} />
                                    </div>
                                    <div className='col-md-8'>
                                        <LabelInput label={"Estado:"} placeholder={"Digite o estado"} />
                                    </div>
                                </div>

                                <div className={styles["button-group"]}>
                                    <BlueButton txt="USAR LOCALIZAÇÃO ATUAL" />
                                    <WhiteButton txt="PESQUISAR NO MAPA" onclick={() => setShowMapping(true)} />
                                </div>
                                <div className={styles["slider-group"]}>
                                    <p>Em um raio de (em km):</p>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={radius}
                                        onChange={(e) => setRadius(e.target.value)}
                                        className={styles.slider}
                                    />
                                    <div className={styles["slider-labels"]}>
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map((km) => (
                                            <span key={km} className={radius == km ? styles.active : ''}>{km} </span>
                                        ))}
                                    </div>
                                </div>
                                <BlueButton txt="BUSCAR" className={styles["search-button"]} onclick={() => setShowAddresses(true)} />
                            </div>
                        )}

                        {showMapping && !showAddresses && (
                            <div className={`col-md-8 ${styles["default-box-mapping"]}`}>
                                <div className={styles["top-info-inside"]}>
                                    <div className={styles["page-name"]}>
                                        <a>Buscar endereços próximos de:</a>
                                    </div>
                                </div>

                                <div className={styles["map"]}>

                                </div>

                                <div className={styles["align-input"]}>
                                    <StandardInput placeholder={"Pesquise aqui"} />
                                </div>
                                <div className={styles["button-group"]}>
                                    <BlueButton txt="Cancelar" onclick={() => setShowMapping(false)} />
                                    <WhiteButton txt="Usar Endereço" onclick={() => setShowAddresses(false)} />
                                </div>
                            </div>
                        )}

                        {showAddresses && (
                            <div className={`col-md-8 ${styles["default-box-addresses"]}`}>
                                <div className={styles["map-addresses"]}>
                                    <div className={styles["div-time-action"]}>
                                        <div className="label-top">Tempo desde última ação</div>
                                        <div className={styles["indicator-bar"]}>
                                            <Slider
                                                value={70}
                                                className={styles.timeSlider}
                                                tooltip={{
                                                    open: false,
                                                }}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className={styles["indicator-labels"]}>
                                            <span>30 dias ou mais</span>
                                            <span>15 dias</span>
                                            <span>1 dia</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles["div-tb-addresses"]}>
                                    <div className={styles["addresses"]}>
                                        <TableComponent />
                                    </div>
                                    <div className={styles["div-btn-finalizar"]}>
                                        <BlueButton txt="Finalizar Ação" onclick={() => finishAction()} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                title="Detalhes do Registro"
                visible={isModalVisible}
                onCancel={handleCancel}
                width={700}
                footer={[
                    <div style={{ textAlign: 'center' }}>
                        <Space size={100}>
                            <WhiteButton key="cancel" txt="Voltar" onclick={() => handleCancel()} />
                            <BlueButton key="confirm" txt="Registrar Doação" onclick={() => handleOk()} />
                        </Space>
                    </div>
                ]}
                centered
            >
                {selectedRecord && (
                    !isFormVisible ? (
                        <>
                            <p><strong>Endereço:</strong> {selectedRecord.enderecos}</p>
                            <p><strong>Quantidade de Adultos:</strong> {selectedRecord.adultos}</p>
                            <p><strong>Quantidade de Crianças e Adolescentes:</strong> {selectedRecord.criancas}</p>
                            <p><strong>Há pessoas com transtorno:</strong> {selectedRecord.transtorno}</p>
                            <p><strong>Última ação no local:</strong> {selectedRecord.date}</p>
                            <p><strong>Descrição:</strong> {selectedRecord.descricao}</p>
                        </>
                    ) : (
                        <DonationForm />
                    )

                )}
            </Modal>

            <Modal
                title={<div style={{ textAlign: 'center' }}>Doação Registrada</div>}
                visible={isRegistered}
                onCancel={closeModal}
                centered
                footer={[
                    <div style={{ textAlign: 'center' }}>
                        <Space>
                            <BlueButton txt="Concluir" onclick={() => closeModal()} />
                        </Space>
                    </div>
                ]}
                width={250}
            >
            </Modal>

            <Modal
                title={<div style={{ textAlign: 'center' }}>Deseja Finalizar Ação?</div>}
                visible={isFinished}
                onCancel={closeModal}
                centered
                footer={[
                    <div style={{ textAlign: 'center' }}>
                        <Space>
                            <WhiteButton key="cancel" txt="Voltar" onclick={() => closeModal()} />
                            <BlueButton key="confirm" txt="Finalizar" onclick={() => concludeFinishAction()} />
                        </Space>
                    </div>
                ]}
                width={300}
            >
            </Modal>

        </>
    );
};

export default ActionRegistration;
