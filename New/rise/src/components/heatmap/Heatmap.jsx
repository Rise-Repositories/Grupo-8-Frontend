import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import api from '../../api';
import { toast } from 'react-toastify';

function HeatmapData(props) {
    const heatmapOptions = {
        max: 1.0,
        maxZoom: 15,
        radius: 50,
        gradient: { 0.2: 'blue', 0.6: 'yellow', 1.0: 'red' }
    };
    console.log(props.pontos);
    const map = useMap();
    L.heatLayer(props.pontos, heatmapOptions).addTo(map);
}

const Heatmap = () => {

    const [position, setPosition] = useState(null);
    const [pontosMapaCalor, setPontosMapaCalor] = useState([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((curPosition) => {
                setPosition([curPosition.coords.latitude, curPosition.coords.longitude]);
            
            }, (error) => {
                console.error("Erro ao obter a localização: ", error);
            });
        } else {
            console.error("Geolocalização não é suportada pelo navegador.");
        }

        const requestConfig = {
            params: {
                radiusToGroup: 100.0,
                olderThan: '2024-06-04T00:00:00'
            }
        };

        api.get('/mapping/heatmap', requestConfig).then((res) => {
            setPontosMapaCalor(res.data);

        }).catch((err) => {
            toast.error('Erro ao carregar dados do mapa de calor');
        });
    }, [position]);

    return (
        <>
            <MapContainer
                center={position || [-23.5581592, -46.6614485]}
                zoom={position || 13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <HeatmapData pontos={pontosMapaCalor} />
            </MapContainer>
        </>
    );
};

export default Heatmap;