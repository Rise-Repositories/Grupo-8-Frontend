import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import styles from "./Home.module.css";
import { useEffect, useRef, useState } from "react";
import NewMarkerModal from "../../components/modals/newMarkerModal/NewMarkerModal";
import ExistingMarkerModal from "../../components/modals/existingMarkerModal/ExistingMarkerModal";
import axios from "axios";
import { toast } from "react-toastify";
import NavbarMobile from "../../components/navbar/navbarMobile/NavbarMobile";

import api from "../../api";
import L, { Icon } from "leaflet";

import MarkerIcon from "../../utils/imgs/marker.png";
import PinInfosModal from "../../components/modals/pinInfosModal/pinInfosModal";
import Person from "../../utils/imgs/person.png";
import LabelInput from "../../components/inputs/labelInput/LabelInput";
import { EnvironmentOutlined, LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import RedButton from "../../components/buttons/redButton/RedButton";


const Home = () => {
    const [markers, setMarkers] = useState([])

    const [currentPosition, setCurrentPosition] = useState();
    const [geolocation, setGeolocation] = useState();
    const [search, setSearch] = useState();
    const [searchResults, setSearchResults] = useState();
    const [openNewMapping, setOpenNewMapping] = useState(false);
    const [openExistingMapping, setOpenExistingMapping] = useState(false);
    const [infos, setInfos] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const mapRef = useRef();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (position.coords) {
                    setCurrentPosition([position.coords.latitude, position.coords.longitude]);
                    setGeolocation([position.coords.latitude, position.coords.longitude]);
                    getMarkers(position.coords.latitude, position.coords.longitude)

                }
                else {
                    setCurrentPosition([-23.557868, -46.661664]);
                    setGeolocation([-23.557868, -46.661664]);
                    getMarkers(-23.557868, -46.661664);
                }
            },
            (error) => console.log(error)
        )
    },)

    const getMarkers = async (lat, lng) => {
        try {
            const coord = lat && lng ? `${lat},${lng}` : `${currentPosition[0]},${currentPosition[1]}`

            const { data, status } = await api.get(`/mapping/user/by-coordinates?coordinates=${coord}&radius=${10}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("USER_TOKEN")}`
                },
            })

            if (status === 200 || status === 204) {
                const setData = new Set([...data, ...markers])
                const arrayData = Array.from(setData)
                setMarkers(arrayData)
            }
        }
        catch (e) {
            toast.error("Erro ao buscar os pins")
        }
    }
    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const { data, status } = await axios.get(`https://nominatim.openstreetmap.org/search?q=${search}&format=json&limit=5&addressdetails=1`);
            if (status === 200) {
                const results = data.map((item) => ({
                    lat: item.lat,
                    lon: item.lon,
                    display_name: `${item.address.road}, ${item.address.suburb} - ${item.address.postcode}`
                }));
                setSearchResults(results);
            }
        } catch (e) {
            toast.error("Erro ao buscar endereco");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSearchResults = () => {
        setIsClosing(true);

        setTimeout(() => {
            setSearchResults(null);
            setIsClosing(false); 
        }, 500); 
    };



    const handleSelectPlace = (e) => {
        setSearchResults(null);
        if (mapRef.current) {
            mapRef.current.setView([e.lat, e.lon], 20);
        }
    }
    const EventHandler = () => {
        const map = useMapEvent({
            click: async () => {
                const { lat, lng } = map.getCenter();

                const { data, status } = await axios.get(`https://nominatim.openstreetmap.org/search?q=${lat},${lng}&format=json&limit=5&addressdetails=1`)

                const { address } = data[0]

                if (address.country !== "Brasil") {
                    toast.error("Localização fora do Brasil")
                    return
                }

                if (status !== 200) {
                    toast.error("Erro ao buscar endereco")
                    return
                }

                checkLocation(lat, lng, address);
            },
            moveend: () => {
                console.log(currentPosition)
                if (!currentPosition) return
                const newPosition = map.getCenter()
                const distance = map.distance(newPosition, {
                    lat: currentPosition[0],
                    lng: currentPosition[1]
                })
                console.log(distance)
                if (distance > 10000) {
                    setCurrentPosition([newPosition.lat, newPosition.lng])
                    getMarkers(newPosition.lat, newPosition.lng)
                }
            }
        })
    }
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

    const icon = new Icon({
        iconUrl: MarkerIcon,
        iconSize: [30, 30]
    })

    const personIcon = new L.Icon({
        iconUrl: Person,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    return (
        <div>
            <NavbarMobile />
            <div className={styles["middle-pin"]}>
                <EnvironmentOutlined style={{ fontSize: '30px', color: '#d34c4c' }} />
            </div>
            <div className={styles["search-area"]}>
                {
                    searchResults && (
                        <div className={`${styles["search-results"]} ${isClosing ? styles.hide : ''}`}>
                            {searchResults.map((item, index) => (
                                <div key={index} className={styles["search-result"]} onClick={() => handleSelectPlace(item)}>
                                    {item.display_name}
                                </div>
                            ))}
                            <div className="col-12 col-md-11">
                                <RedButton
                                    className={styles["close-button"]}
                                    onclick={handleCloseSearchResults}
                                    txt="Cancelar"
                                />
                            </div>
                        </div>
                    )
                }

                <div className={`row ${styles["col-md-12 d-flex flex-row"]}`}>
                    <div className="col-10 col-md-11">
                        <LabelInput placeholder={"Pesquisar"} onInput={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className={`col-2 col-md-1 d-flex align-items-center justify-content-center ${styles["search-box"]}`}>
                        <button className={styles["search-button"]} onClick={() => handleSearch()}>
                            {isLoading ? (
                                <LoadingOutlined style={{ fontSize: '16px', color: '#f5f5f5' }} />
                            ) : (
                                <SearchOutlined style={{ fontSize: '16px', color: '#f5f5f5' }} />
                            )}
                        </button>

                    </div>
                </div>

            </div>
            {
                currentPosition && markers ?
                    <MapContainer
                        zoomControl={false}
                        ref={mapRef}
                        center={currentPosition}
                        zoom={20}
                        scrollWheelZoom={true}
                        className={styles.map}
                    >
                        <EventHandler />
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {geolocation && (
                            <Marker position={geolocation} icon={personIcon}>
                                <Popup>Você está aqui</Popup>
                            </Marker>
                        )}
                        {
                            markers.map((m, index) => (
                                <Marker key={index} icon={icon} position={[m.latitude, m.longitude]}>
                                    <Popup className={styles["popup"]}>
                                        <PinInfosModal pin={m} />
                                    </Popup>
                                </Marker>
                            ))
                        }
                    </MapContainer>
                    : null
            }
            {
                openNewMapping &&
                <NewMarkerModal getMarkers={getMarkers} handleClose={handleModalNewMapping} infos={infos} />

            }
            {
                openExistingMapping &&
                <ExistingMarkerModal getMarkers={getMarkers} handleClose={handleModalExistingMapping} handleNewMapping={handleModalNewMapping} infos={infos} />

            }
        </div>
    )
}

export default Home;