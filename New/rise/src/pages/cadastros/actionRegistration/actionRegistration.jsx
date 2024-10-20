//npm install antd react-highlight-words @ant-design/icons

import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './actionRegistration.module.css';
import LabelInput from "../../../components/inputs/labelInput/LabelInput";
import BlueButton from '../../../components/buttons/blueButton/BlueButton';
import WhiteButton from '../../../components/buttons/whiteButton/WhiteButton';
import StandardInput from '../../../components/inputs/standardInput/StandardInput';
import { Slider, Table, Modal, Input, Space, Button, Form, Checkbox, InputNumber } from 'antd'; // Ant Design Components
import { SearchOutlined } from '@ant-design/icons'; // Table Search Icon
import Highlighter from 'react-highlight-words'; // Highlighter to highlight text
import 'antd/dist/reset.css';
import { OngContext } from '../../../components/context/ongContext/OngContext';

import { MapContainer, Marker, Popup, TileLayer, useMapEvents, useMap } from "react-leaflet";
import PinInfosModal from '../../../components/modals/pinInfosModal/pinInfosModal';
import api from '../../../api';
import axios from "axios";
import { Icon, marker } from "leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { toast } from "react-toastify";
import MarkerIcon from "../../../utils/imgs/marker.png";
import MarkerIconGreen from "../../../utils/imgs/marker-green.png"; //Marker Icon credit: https://www.flaticon.com/br/autores/iconmarketpk
import MarkerIconLightGreen from "../../../utils/imgs/marker-light-green.png";
import MarkerIconOrange from "../../../utils/imgs/marker-orange.png";
import MarkerIconRed from "../../../utils/imgs/marker-red.png";
import MarkerIconYellow from "../../../utils/imgs/marker-yellow.png";
import MarkerIconGray from "../../../utils/imgs/marker-gray.png";


const ActionRegistration = () => {
    const [radius, setRadius] = useState(3);
    const [showMapping, setShowMapping] = useState(false);
    const [showAddresses, setShowAddresses] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [clickedPosition, setClickedPosition] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [locationData, setLocationData] = useState([]);
    const [idAction, setIdAction] = useState();
    const { curOngId } = useContext(OngContext);
    const [address, setAddress] = useState({
        cep: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: '',
        numero: '',
    });
    const [action, setAction] = useState({
        nome: '',
        descricao: '',
        dataInicio: '',
        dataFim: ''
    })
    const searchInput = useRef(null);
    const mapRef = useRef();
    const [markers, setMarkers] = useState([])
    const [currentPosition, setCurrentPosition] = useState(null);
    const [serachResults, setSearchResults] = useState();
    const [infos, setInfos] = useState();
    const [openExistingMapping, setOpenExistingMapping] = useState(false);
    const [openNewMapping, setOpenNewMapping] = useState(false);
    const [iconDate, setIconDate] = useState();

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        setSearchText(selectedKeys[0]);
        confirm();
        setSearchedColumn(dataIndex);

    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleGetLocation = () => {
        toast.info("Carregando Informações")

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    const cep = await getCepFromCoordinates(latitude, longitude);

                    if (cep !== 'CEP não encontrado') {
                        try {
                            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                            const data = response.data;

                            setAddress({
                                cep: data.cep,
                                logradouro: data.logradouro,
                                bairro: data.bairro,
                                cidade: data.localidade,
                                estado: data.uf,
                            });
                        } catch (error) {
                            toast.error("Erro ao buscar o endereço no ViaCEP.");
                            console.error('Erro ao buscar o endereço:', error);
                        }
                    } else {
                        toast.error('CEP não encontrado para essas coordenadas.');
                    }
                },
                (error) => {
                    toast.error("Erro ao obter localização.");
                    console.error('Erro ao obter localização:', error);
                }
            );
        } else {
            toast.error('Geolocalização não suportada pelo navegador');
        }
    };

    const getCepFromCoordinates = async (latitude, longitude) => {
        try {

            const { data, status } = await axios.get(`https://nominatim.openstreetmap.org/search?q=${latitude},${longitude}&format=json&limit=5&addressdetails=1`);

            if (status === 200 && data.length > 0) {
                const address = data[0].address;  // Get the first result from the list
                const cep = address.postcode;  // Exctract CEP from response

                console.log('Endereço obtido:', address);
                return cep || 'CEP não encontrado';
            } else {
                return 'CEP não encontrado';
            }
        } catch (error) {
            console.error('Erro ao obter o CEP:', error);
            return 'Erro ao obter o CEP';
        }
    };

    const fetchAddressByCep = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const data = response.data;

            if (!data.erro) {
                setAddress((prevAddress) => ({
                    ...prevAddress,
                    cep: data.cep,
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    estado: data.uf,
                }));
            } else {
                toast.error('CEP não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar o endereço:', error);
            toast.error('Erro ao buscar o endereço. Verifique o CEP digitado.');
        }
    };

    const handleCepChange = (e) => {
        const { value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            cep: value,
        }));
    };

    const handleCepBlur = () => {
        const cep = address.cep.replace(/\D/g, ''); // Remove non-numeric characters

        if (cep.length === 8) {
            fetchAddressByCep(cep);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') searchAddress(searchQuery);
    }

    const customIcon = new L.Icon({
        iconUrl: MarkerIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    const extractCepFromAddress = (address) => {
        const cepRegex = /\b\d{5}-?\d{3}\b/;
        const match = address.match(cepRegex);
        return match ? match[0] : null;
    };

    const useAddress = () => {
        const cep = extractCepFromAddress(searchQuery);
        if (cep) {
            fetchAddressByCep(cep);
        } else {
            toast.error('CEP não encontrado no endereço.');
        }
        setShowMapping(false);
    }

    const validateAndSubmit = async () => {
        if (
            address.cep == "" ||
            address.logradouro == "" ||
            address.bairro == "" ||
            address.cidade == "" ||
            address.estado == "" ||
            address.numero == "" ||
            action.nome == "" ||
            action.descricao == "" ||
            action.dataInicio == "" ||
            action.dataFim == ""
        ) {
            toast.error('Por favor, preencha todos os campos.');
            return;
        }

        const dataInicio = new Date(action.dataInicio);
        const dataAtual = new Date();
        if (dataInicio < dataAtual) {
            toast.error("Data e Hora de Início não podem ser menores que os atuais")
            return;
        }

        if (address.numero <= 0) {
            toast.error('Número do endereço tem que ser maior que 0 (zero)')
            return;
        }

        if (action.dataInicio > action.dataFim) {
            toast.error('Data Início está maior que Data Fim')
            return;
        }

        try {
            toast.info("Carregando Mapeamento")

            const response = await axios.get(`https://viacep.com.br/ws/${address.cep}/json/`);
            const data = response.data;

            // Função para capitalizar corretamente uma string (cada palavra começa com maiúscula)
            const capitalizeWords = (str) => {
                return str
                    .trim() // Remove espaços extras no início e no final
                    .toLowerCase() // Converte tudo para minúsculas
                    .replace(/\b\w/g, (char) => char.toUpperCase()); // Coloca em maiúscula a primeira letra de cada palavra
            };

            // Função para normalizar strings: remove espaços extras e converte para capitalização correta
            const normalizeString = (str) => {
                return str ? capitalizeWords(str) : '';
            };

            // Mapear abreviações para uma comparação flexível
            const normalizeStreet = (street) => {
                let normalized = capitalizeWords(street);

                // Tratar abreviações comuns
                normalized = normalized.replace(/^Av\s|Avenida\s/i, 'Av ');
                normalized = normalized.replace(/^Rua\s/i, 'Rua ');

                return normalized.trim();
            };

            // Comparação das strings normalizadas
            if (
                data.erro ||
                normalizeStreet(data.logradouro) !== normalizeStreet(address.logradouro) ||
                normalizeString(data.bairro) !== normalizeString(address.bairro) ||
                normalizeString(data.localidade) !== normalizeString(address.cidade) ||
                normalizeString(data.uf) !== normalizeString(address.estado)
            ) {
                toast.error('O endereço fornecido não é válido. Verifique os dados e abrevie somente o campo Estado');
                return;
            }
        } catch (error) {
            console.error('Erro ao validar o endereço:', error);
            toast.error('Erro ao validar o endereço. Tente novamente.');
            return;
        }

        try {
            const { data, status } = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address.cep}&format=json&limit=5&addressdetails=1`)

            if (status === 200) {
                const results = data.map((item) => {
                    return {
                        lat: item.lat,
                        lon: item.lon,
                        display_name: `${item.address.road}, ${item.address.suburb} - ${item.address.postcode}`
                    }
                })
                try {
                    setCurrentPosition([results[0].lat, results[0].lon])
                    getMarkers(results[0].lat, results[0].lon, radius);
                } catch (error) {
                    console.error(error)
                }
            }
        }
        catch (e) {
            toast.error("Erro ao buscar latitude e longitude")
        }

        try {
            const { data, status } = await api.post(`/actions/${curOngId}`, {
                latitude: 0,
                longitude: 0,
                name: action.nome,
                description: action.descricao,
                dateTimeStart: action.dataInicio,
                dateTimeEnd: action.dataFim

            },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("USER_TOKEN")}`
                    },
                }).catch((e) => {
                    console.log(e)
                })

            if (status === 201) {
                toast.success('Ação Cadastrada e Endereço encontrado!');
                setIdAction(data.id);
                setShowAddresses(true);
            }

        }
        catch (e) {
            toast.error("Erro ao Cadastrar Ação")
        }
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
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: {
                compare: (a, b) => a.id - b.id,
                multiple: 4,
            },

        },
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
            title: 'Última ação',
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
                <BlueButton txt="Detalhes" onclick={() => showDetalhes(record)} className={styles["detail-button"]} customStyle={styles["padding-detalhes"]} />
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

    const handleOk = async () => {

        if (isFormVisible) {
            try {
                await form.validateFields();

                const values = form.getFieldsValue();
                console.log(values)
                const { description, qtdAdultos, qtdCriancas, notPossible } = values;

                const noDonation = !!notPossible;

                const noPeople = qtdAdultos === 0 && qtdCriancas === 0;

                console.log(qtdAdultos, qtdCriancas, noDonation, noPeople, description)

                const { data, status } = await api.patch(`/actions/${idAction}/add-mapping/${selectedRecord.id}`, {
                    qtyServedAdults: qtdAdultos,
                    qtyServedChildren: qtdCriancas,
                    noDonation: noDonation,
                    noPeople: noPeople,
                    description: description,
                },
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("USER_TOKEN")}`
                        },
                    }).catch((e) => {
                        console.log(e)
                    })

                if (status === 201 || status === 200) {
                    setIsRegistered(true);
                    form.resetFields(); 
                } else {
                    toast.error('Erro inesperado ao cadastrar doação')
                }

            }
            catch (e) {
                console.log(e)
                toast.error("Erro ao Cadastrar Doação")
            }
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


        address.cep = ''
        address.logradouro = ''
        address.bairro = ''
        address.cidade = ''
        address.estado = ''
        address.numero = ''
        action.nome = ''
        action.descricao = ''
        action.dataInicio = ''
        action.dataFim = ''
    }

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
            dataSource={locationData}
            scroll={{
                x: 150,
            }}
            pagination={{ pageSize: 3 }}
        />
    );

    const DonationForm = ({ form }) => (
        <Form
            layout="vertical"
            className="donation-form"
            form={form}
            onFinish={(values) => console.log('Success:', values)}
            onFinishFailed={(errorInfo) => console.log('Failed:', errorInfo)}
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
                rules={[{ required: true, message: 'Por favor, insira uma descrição!' }]}
            >
                <Input.TextArea rows={4} />
            </Form.Item>

            <div className={styles["form-row"]}>
                <Form.Item
                    label="Quantidade de Adultos:"
                    name="qtdAdultos"
                    rules={[{ required: true, message: 'Por favor, insira a quantidade de adultos!' }]}
                >
                    <InputNumber placeholder="Digite a quantidade" min={0} />
                </Form.Item>

                <Form.Item
                    label="Quantidade de Crianças/Adolescentes:"
                    name="qtdCriancas"
                    rules={[{ required: true, message: 'Por favor, insira a quantidade de crianças/adolescentes!' }]}
                >
                    <InputNumber placeholder="Digite a quantidade" min={0} cols={9} />
                </Form.Item>
            </div>
        </Form>
    );

    const [form] = Form.useForm();

    const getMarkers = async (lat, lng, radius) => {
        try {
            const coord = lat && lng ? `${lat},${lng}` : `${currentPosition[0]},${currentPosition[1]}`

            const { data, status } = await api.get(`/mapping/by-coordinates?coordinates=${coord}&radius=${radius}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("USER_TOKEN")}`
                },
            })

            if (status === 200) {
                const setData = new Set([...data, ...markers]);
                const arrayData = Array.from(setData);

                setMarkers(arrayData);

                setLocationData(arrayData.map(marker => {

                    const lastAction = Array.isArray(marker.mappingActions) && marker.mappingActions.length > 0
                        ? marker.mappingActions.at(-1)?.action?.datetimeEnd
                        : null;

                    const date = lastAction ? new Date(lastAction) : null;
                    const today = new Date();

                    const daysDifference = date && !isNaN(date)
                        ? Math.floor((today - date) / (1000 * 60 * 60 * 24))
                        : null;

                    const formattedDate = daysDifference !== null && !isNaN(daysDifference)
                        ? date.toLocaleDateString('pt-BR')
                        : 'Sem Ação';

                    return {
                        id: marker.id,
                        enderecos: `${marker.address.street}, ${marker.address.number}, ${marker.address.neighbourhood}`,
                        adultos: marker.qtyAdults,
                        criancas: marker.qtyChildren,
                        date: formattedDate,
                        transtorno: marker.hasDisorders ? 'Sim' : 'Não',
                        descricao: marker.description
                    };
                }));
            }
        }
        catch (e) {
            toast.error("Não foi possível localizar os markers")
            console.log("error: " + e.message)
        }
    }

    const handleSelectPlace = (e) => {
        setSearchResults(null);
        if (mapRef.current) {
            mapRef.current.setView([e.lat, e.lon], 20);
        }
    }

    const EventHandler = ({ setClickedPosition, setSearchQuery }) => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setClickedPosition([lat, lng]);

                try {
                    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
                        params: { lat, lon: lng, format: 'json' },
                    });
                    if (response.data) setSearchQuery(response.data.display_name);
                } catch (error) {
                    console.error('Erro ao obter o endereço:', error);
                }
            },
        });
        return null;
    };

    const handleModalNewMapping = () => {
        setOpenExistingMapping(false);
        setOpenNewMapping(!openNewMapping)
    }

    const handleModalExistingMapping = () => {
        setOpenExistingMapping(!openExistingMapping)
    }

    const checkLocation = async (lat, lng, address) => {
        const coord = lat && lng ? `${lat},${lng}` : `${currentPosition[0]},${currentPosition[1]}`
        const { data, status } = await api.get(`/mapping/by-coordinates?coordinates=${coord}&radius=${0.05}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("USER_TOKEN")}`
            },
        });
        if (status === 200 || status === 204) {
            if (data.length > 0) {
                setInfos({
                    lat,
                    lng,
                    address,
                    mappings: data
                });
                handleModalExistingMapping();
            } else {
                setInfos({
                    lat,
                    lng,
                    address,
                });
                handleModalNewMapping();
            }
        }
        console.log('data, ', data);
        console.log('data, ', status);
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentPosition([position.coords.latitude, position.coords.longitude])
                    getMarkers(position.coords.latitude, position.coords.longitude, 1)
                },
                (error) => console.log(error)
            )
        } else {
            toast.error("Geolocalização não suportada por este nagevador.")
        }
    }, [])

    const RecenterMap = ({ position }) => {
        const map = useMap();
        useEffect(() => {
            if (position) map.setView(position, 13);
        }, [position, map]);
        return null;
    };

    const searchAddress = async (query) => {
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    format: 'json',
                    limit: 1,
                    addressdetails: 1,
                    countrycodes: 'BR',
                },
            });

            if (response.data.length) {
                const { lat, lon, display_name } = response.data[0];
                const newPosition = [parseFloat(lat), parseFloat(lon)];
                setCurrentPosition(newPosition);
                setClickedPosition(newPosition);
                setSearchQuery(display_name);
            } else {
                alert('Endereço não encontrado. Tente ser mais específico.');
            }
        } catch (error) {
            console.error('Erro na busca do endereço:', error);
            alert('Erro ao buscar o endereço. Tente novamente.');
        }
    };

    const getIconByDays = (days) => {
        if (days === null) return MarkerIconGray; 
        if (days <= 1 && days < 4) return MarkerIconGreen;   
        if (days >= 4 && days < 13) return MarkerIconLightGreen; 
        if (days >= 13 && days < 17) return MarkerIconYellow; 
        if (days >= 17 && days < 25) return MarkerIconOrange;   
        return MarkerIconRed;              
    };

    return (
        <>
            <div className={styles.page}>
                <div className={`col-md-12 ${styles["content"]}`}>
                    <div className={styles.container}>
                        <div className={styles["top-info"]}>
                            <div className={styles["page-name"]}>
                                <a>Registro de ação</a>
                            </div>
                        </div>

                        {!showMapping && !showAddresses && (
                            <div className={`col-md-8 ${styles["default-box"]}`}>
                                <div className={styles["top-info-inside"]}>
                                    <div className={styles["page-name"]}>
                                        <a>Buscar endereços próximos de:</a>
                                    </div>
                                </div>
                                <div className={`col-md-12 ${styles["input-group"]}`}>
                                    <div className='col-md-11'>
                                        <LabelInput label={"CEP:"} placeholder={"Digite seu CEP"} value={address.cep} onChange={handleCepChange} onBlur={handleCepBlur} />
                                    </div>
                                    <div className='col-md-11'>
                                        <LabelInput label={"Logradouro:"} placeholder={"Digite seu logradouro"} value={address.logradouro}
                                            onChange={(e) =>
                                                setAddress((prevAddress) => ({
                                                    ...prevAddress,
                                                    logradouro: e.target.value,
                                                }))} />
                                    </div>
                                </div>
                                <div className={`col-md-12 ${styles["input-group"]}`}>
                                    <div className='col-md-11'>
                                        <LabelInput label={"Número:"} placeholder={"Digite o número"} value={address.numero} type="number" onChange={(e) => setAddress({ ...address, numero: e.target.value })} />
                                    </div>
                                    <div className='col-md-11'>
                                        <LabelInput label={"Bairro:"} placeholder={"Digite o bairro"} value={address.bairro}
                                            onChange={(e) =>
                                                setAddress((prevAddress) => ({
                                                    ...prevAddress,
                                                    bairro: e.target.value,
                                                }))} />
                                    </div>
                                </div>
                                <div className={`col-md-12 ${styles["input-group"]}`}>
                                    <div className='col-md-11'>
                                        <LabelInput label={"Cidade:"} placeholder={"Digite a cidade"} value={address.cidade}
                                            onChange={(e) =>
                                                setAddress((prevAddress) => ({
                                                    ...prevAddress,
                                                    cidade: e.target.value,
                                                }))} />
                                    </div>
                                    <div className='col-md-11'>
                                        <LabelInput label={"Estado:"} placeholder={"Digite o estado"} value={address.estado}
                                            onChange={(e) =>
                                                setAddress((prevAddress) => ({
                                                    ...prevAddress,
                                                    estado: e.target.value,
                                                }))} />
                                    </div>
                                </div>

                                <div className={styles["button-group"]}>
                                    <BlueButton txt="USAR LOCALIZAÇÃO ATUAL" onclick={() => handleGetLocation()} />
                                    <WhiteButton txt="PESQUISAR NO MAPA" onclick={() => setShowMapping(true)} />
                                </div>
                                <div className={styles["slider-group"]}>
                                    <p>Em um raio de (em km):</p>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={radius}
                                        onChange={(e) => setRadius(Number(e.target.value))}
                                        className={styles.slider}
                                    />
                                    <div className={styles["slider-labels"]}>
                                        {Array.from({ length: 5 }, (_, i) => i + 1).map((km) => (
                                            <span key={km} className={radius == km ? styles.active : ''}>{km} </span>
                                        ))}
                                    </div>
                                </div>
                                <div className={`col-md-12 ${styles["input-group"]}`}>
                                    <div className='col-md-11'>
                                        <LabelInput label={"Nome da Ação:"} placeholder={"Digite o nome"} value={action.nome} onChange={(e) => setAction({ ...action, nome: e.target.value })} />
                                    </div>
                                    <div className='col-md-11'>
                                        <LabelInput label={"Descrição:"} placeholder={"Digite a descrição"} value={action.descricao} onChange={(e) => setAction({ ...action, descricao: e.target.value })} />
                                    </div>
                                </div>
                                <div className={`col-md-12 ${styles["input-group"]}`}>
                                    <div className='col-md-11'>
                                        <LabelInput label={"Data Início:"} placeholder={"Digite a Data Início"} value={action.dataInicio} type={'datetime-local'} onChange={(e) => setAction({ ...action, dataInicio: e.target.value })} />
                                    </div>
                                    <div className='col-md-11'>
                                        <LabelInput label={"Data Fim:"} placeholder={"Digite a Data Fim"} value={action.dataFim} type={'datetime-local'} onChange={(e) => setAction({ ...action, dataFim: e.target.value })} />
                                    </div>
                                </div>
                                <BlueButton txt="Cadastrar Ação e Buscar Endereço" className={styles["search-button"]} onclick={() => validateAndSubmit()} />
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
                                    <MapContainer center={currentPosition} zoom={13}
                                        scrollWheelZoom={true}
                                        className={styles["interact-map"]}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <EventHandler setClickedPosition={setClickedPosition} setSearchQuery={setSearchQuery} />
                                        <RecenterMap position={currentPosition} />

                                        {clickedPosition && (
                                            <Marker position={clickedPosition} icon={customIcon} />
                                        )}
                                    </MapContainer>
                                </div>

                                <div className={styles["align-input"]}>
                                    <StandardInput
                                        placeholder={"Pesquise Aqui ou Clique no Mapa"}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                                <div className={styles["button-group"]}>
                                    <BlueButton txt="Cancelar" onclick={() => setShowMapping(false)} />
                                    <WhiteButton txt="Usar Endereço" onclick={useAddress} />
                                </div>
                            </div>
                        )}

                        {showAddresses && (
                            <div className={`col-md-8 ${styles["default-box-addresses"]}`}>
                                <div className={styles["map-addresses"]}>
                                    <MapContainer center={currentPosition} zoom={13} scrollWheelZoom={true} className={styles["interact-map"]}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        {markers.map((m, index) => {
                                            const lastAction = Array.isArray(m.mappingActions) && m.mappingActions.length > 0
                                                ? m.mappingActions.at(-1)?.action?.datetimeEnd
                                                : null;

                                            const date = lastAction ? new Date(lastAction) : null;
                                            const today = new Date();

                                            const daysDifference = date && !isNaN(date)
                                                ? Math.floor((today - date) / (1000 * 60 * 60 * 24))
                                                : null;

                                            const icon = new L.Icon({
                                                iconUrl: getIconByDays(daysDifference),
                                                iconSize: [30, 30]
                                            });

                                            return (
                                                <Marker key={index} icon={icon} position={[m.latitude, m.longitude]}>
                                                    <Popup className={styles["popup"]}>
                                                        <PinInfosModal pin={m} />
                                                    </Popup>
                                                </Marker>
                                            );
                                        })}
                                    </MapContainer>
                                    <div className={styles["div-time-action"]}>
                                        <div className={styles["label-top-time-action"]}>Tempo desde última ação</div>
                                        <div className={styles["indicator-bar"]}>
                                        </div>
                                        <div className={styles["indicator-labels"]}>
                                            <span>30 dias ou mais</span>
                                            <span class = "text-center">15 dias</span>
                                            <span class = "text-end">1 dia</span>
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
                            <p><strong>ID:</strong> {selectedRecord.id}</p>
                            <p><strong>Endereço:</strong> {selectedRecord.enderecos}</p>
                            <p><strong>Quantidade de Adultos:</strong> {selectedRecord.adultos}</p>
                            <p><strong>Quantidade de Crianças e Adolescentes:</strong> {selectedRecord.criancas}</p>
                            <p><strong>Há pessoas com transtorno:</strong> {selectedRecord.transtorno}</p>
                            <p><strong>Última ação no local:</strong> {selectedRecord.date}</p>
                            <p><strong>Descrição:</strong> {selectedRecord.descricao}</p>
                        </>
                    ) : (
                        <DonationForm form={form} />
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