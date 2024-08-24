import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import styles from "./Home.module.css";
import { useEffect, useRef, useState } from "react";
import { FaSearch, FaMapPin } from "react-icons/fa";
import NewMarkerModal from "../../components/modals/newMarkerModal/NewMarkerModal";
import axios from "axios";
import { toast } from "react-toastify";
import NavbarMobile from "../../components/navbar/navbarMobile/NavbarMobile";

import StandartInput from "../../components/inputs/standardInput/StandardInput";
import api from "../../api";
import { Icon } from "leaflet";

import MarkerIcon from "../../utils/imgs/marker.png";
import PinInfosModal from "../../components/modals/pinInfosModal/pinInfosModal";

const Home = () => {
    const [markers, setMarkers] = useState([])

    const [currentPosition, setCurrentPosition] = useState();
    const [search, setSearch] = useState();
    const [serachResults, setSearchResults] = useState();
    const [open, setOpen] = useState(false);
    const [infos, setInfos] = useState()
    const mapRef = useRef();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if(position.coords){
                    setCurrentPosition([-23.52343833033088, -46.52506611668173])
                    //setCurrentPosition([position.coords.latitude, position.coords.longitude]);
                    getMarkers(-23.52343833033088, -46.52506611668173)
                    
                }
                else{
                    setCurrentPosition([-23.5505, -46.6333]);
                }
            },
            (error) => console.log(error)
        )
    },[])

    const getMarkers = async (lat, lng) => {
        try{
            const coord = lat && lng ?`${lat},${lng}` : `${currentPosition[0]},${currentPosition[1]}`

            const {data, status} = await api.get(`/mapping/by-coordinates?coordinates=${coord}&radius=${10}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("USER_TOKEN")}`
                },
            })

            if(status === 200){
                const setData = new Set([...data, ...markers])
                const arrayData = Array.from(setData)
                setMarkers(arrayData)
            }
        }
        catch(e){
            toast.error("Erro ao buscar os pins")
        }
    }
    const handleSearch = async () => {
        try{
            const {data, status} = await axios.get(`https://nominatim.openstreetmap.org/search?q=${search}&format=json&limit=5&addressdetails=1`)

            if(status === 200){
                const results = data.map((item) => {
                    return {
                        lat: item.lat,
                        lon: item.lon,
                        display_name: `${item.address.road}, ${item.address.suburb} - ${item.address.postcode}`
                    }
                })

                setSearchResults(results);
            }
        }
        catch(e){
            toast.error("Erro ao buscar endereco")
        }
    }
    const handleSelectPlace = (e) => {
        setSearchResults(null);
        if(mapRef.current){
            mapRef.current.setView([e.lat, e.lon], 20);
        }
    }
    const EventHandler = () => {
        const map = useMapEvent({
            click: async () => {
                const {lat, lng} = map.getCenter();

                const {data, status} = await axios.get(`https://nominatim.openstreetmap.org/search?q=${lat},${lng}&format=json&limit=5&addressdetails=1`)

                const {address} = data[0]

                if(address.country !== "Brasil"){
                    toast.error("Localização fora do Brasil")
                    return
                }

                if(status !== 200){
                    toast.error("Erro ao buscar endereco")
                    return
                }

                setInfos({
                    lat,
                    lng,
                    address,
                })

                handleModal()
            },
            moveend: () => {
                console.log(currentPosition)
                if(!currentPosition) return
                const newPosition = map.getCenter()
                const distance = map.distance(newPosition,{
                    lat: currentPosition[0],
                    lng: currentPosition[1]
                })
                console.log(distance)
                if(distance > 10000){
                    setCurrentPosition([newPosition.lat, newPosition.lng])
                    getMarkers(newPosition.lat, newPosition.lng)
                }
            }
        })
    }
    const handleModal = () => {
        setOpen(!open)
    }
    const icon = new Icon({
        iconUrl: MarkerIcon,
        iconSize: [30,30]
    })

    return (
        <div>
            <NavbarMobile />
            <div className={styles["middle-pin"]}>
                <FaMapPin size={30} color="#b91c1c"/>
            </div>
            <div className={styles["search-area"]}>
                {
                    serachResults &&
                    <div className={styles["search-results"]}>
                        {
                            serachResults.map((item, index) => {
                                return (
                                    <div key={index} className={styles["search-result"]} onClick={() => handleSelectPlace(item)}>
                                        {item.display_name}
                                    </div>
                                )
                            })
                        }
                        <button className={styles["close-button"]} onClick={() => setSearchResults(null)}>Cancelar</button>
                    </div>
                }
                <div className={styles["search-row"]}>
                    <button className={styles["search-button"]} onClick={() => handleSearch()}>
                        <FaSearch size={20} color={"#000"} />
                    </button>
                    <StandartInput customStyle={styles["search-input"]} placeholder={"Pesquisar"} onInput={(e) => setSearch(e.target.value)}/>
                    <div clasname></div>
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
                        {
                            markers.map((m, index) => (
                                <Marker key={index} icon={icon} position={[m.latitude, m.longitude]}>
                                    <Popup className={styles["popup"]}>
                                        <PinInfosModal pin={m}/>
                                    </Popup>
                                </Marker>
                            ))
                        }
                    </MapContainer>
                : null
            }
            {
                open &&
                    <NewMarkerModal getMarkers={getMarkers} handleClose={handleModal} infos={infos}/>

            }
        </div>
    )
}

export default Home;