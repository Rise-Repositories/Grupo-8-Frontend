import React, { useContext, useEffect, useState } from 'react';
import { Modal, Calendar } from "antd";
import BlueButton from "../../components/buttons/blueButton/BlueButton";
import WhiteButton from "../../components/buttons/whiteButton/WhiteButton";

const CalendarFilter = ({dataFiltro, setDataFiltro}) => {

    const [dataFiltroTemp, setDataFiltroTemp] = useState(dataFiltro);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {}, []);

    const calendarioAlterarData = (value, source) => {
        setDataFiltroTemp(value.format('YYYY-MM-DDT00:00:00'));
    };

    const confirmarData = () => {
        setDataFiltro(dataFiltroTemp);
        closeCalendario();
    };

    const closeCalendario = () => {
        setDataFiltroTemp(dataFiltro);
        setIsCalendarOpen(false);
    };

    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, ' / ');
    };

    return (
        <>
            <WhiteButton txt={formatarData(dataFiltro)} onclick={() => setIsCalendarOpen(true)} />
            <Modal
                open={isCalendarOpen}
                onCancel={() => closeCalendario()}
                footer={null}
                centered>
                <Calendar fullscreen={false} onSelect={calendarioAlterarData} />
                <BlueButton txt={"Selecionar Data"} onclick={confirmarData} />
            </Modal>
        </>
    );
};

export default CalendarFilter;