import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import api from '../../api';
import { toast } from 'react-toastify';

/*
Utilização

    <div style={{ height: "50%", width: "50%" }}>
        <Heatmap semAtendimentoDesde={'2024-05-25T00:00:00'} />
    </div>

- width e height podem ser aplicados por classe, mas é bom sempre ter uma div ao redor
    que tenha tamanho definido.
- Prop semAtendimentoDesde não é obrigatório. Caso não tenha pega pontos não atendidos há mais
    de 1 mês por padrão. Formato da data tem que ser 'yyyy-MM-ddThh:mm:ss'
    (tem que ser um T entre parte de data e de hora, espaço faz a requisição no back falhar)
*/


function HeatmapData(props) {
    
    const [curLayer, setCurLayer] = useState(null);
    const map = useMap();

    useEffect(() => {
        const heatmapOptions = {
            max: 1.0,
            maxZoom: 15,
            radius: 50,
            gradient: { 0.2: 'blue', 0.6: 'yellow', 1.0: 'red' }
        };

        if (curLayer) {
            map.removeLayer(curLayer);
        }
        setCurLayer(L.heatLayer(props.pontos, heatmapOptions).addTo(map));
    }, [props]);
}

const Heatmap = ({semAtendimentoDesde}) => {

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

        let defaultDate = new Date();
        defaultDate.setMonth(defaultDate.getMonth() - 1);

        const requestConfig = {
            params: {
                radiusToGroup: 100.0,
                olderThan: semAtendimentoDesde ? semAtendimentoDesde : defaultDate.toISOString().split('.')[0]
            }
        };

        api.get('/data/heatmap', requestConfig).then((res) => {
            setPontosMapaCalor(res.data);

        }).catch((err) => {
            toast.error('Erro ao carregar dados do mapa de calor');
        });
    }, [semAtendimentoDesde]);

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