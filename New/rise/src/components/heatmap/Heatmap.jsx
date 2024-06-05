import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import api from '../../api';
import { toast } from 'react-toastify';

const Heatmap = () => {

    const [position, setPosition] = useState(null);
    const [pontosMapaCalor, setPontosMapaCalor] = useState([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((curPosition) => {
                console.log(curPosition);
                setPosition([curPosition.coords.latitude, curPosition.coords.longitude]);
            }, (error) => {
                console.error("Erro ao obter a localização: ", error);
            });
        } else {
            console.error("Geolocalização não é suportada pelo navegador.");
        }

        let heatmapConfig = {
            params: {
                radiusToGroup: 100.0,
                olderThan: '2024-06-04T00:00:00'
            }
        };

        api.get('/mapping/heatmap', heatmapConfig).then((res) => {
            console.log(res);
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
                style={{ height: "80vh", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <HeatmapLayer
                    fitBoundsOnLoad
                    fitBoundsOnUpdate
                    points={pontosMapaCalor}
                    latitudeExtractor={m => m[0]}
                    longitudeExtractor={m => m[1]}
                    intensityExtractor={m => m[2]} 
                    radius={50}
                    gradient={ {0.2: 'blue', 0.6: 'orange', 1.0: 'red'} } />
            </MapContainer>
        </>
    );
};

export default Heatmap;