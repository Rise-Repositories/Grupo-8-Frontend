import React, { useContext, useEffect, useState } from "react";
import styles from "./ExistingMarkerModal.module.css"
import WhiteButton from "../../buttons/whiteButton/WhiteButton";
import BlueButton from "../../buttons/blueButton/BlueButton";
import GreenButton from "../../buttons/greenButton/GreenButton";

import { Modal, Table, Space, Col, Row } from "antd";

const ExistingMarkerModal = ({ handleClose, getMarkers, infos, handleNewMapping }) => {

    const [selectedMapping, setSelectedMapping] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        {
            title: 'Endereço',
            dataIndex: 'shortAddress',
            key: 'shortAddress',
        },
        {
            title: 'Qtd. Pessoas',
            dataIndex: 'qtyPeople',
            key: 'qtyPeople',
        },
        {
            title: 'Ver Detalhes',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <WhiteButton onclick={() => openModal(record)} txt={"Ver Detalhes"} />
                </Space>
            ),
        },
    ];

    const openModal = (mapeamento) => {
        setSelectedMapping(mapeamento);
        setIsModalOpen(true);
    };

    const confirmAddMappingToUser = () => {
        setSelectedMapping(null);
        setIsModalOpen(false);
        handleClose();
    }

    const closeModal = () => {
        setSelectedMapping(null);
        setIsModalOpen(false);
    }

    const data = infos.mappings.map((mapping, index) => { return {
        key: index,
        id: mapping.id,
        shortAddress: mapping.address.street + (mapping.address.number > 0 ? ', ' + mapping.address.number : ''),
        fullAddress: mapping.address.street + 
            (mapping.address.number > 0 ? ', ' + mapping.address.number : '') + 
            (mapping.address.neighbourhood ? ', ' + mapping.address.neighbourhood : '') + 
            (mapping.address.city ? ', ' + mapping.address.city : '') + 
            (mapping.address.state ? ', ' + mapping.address.state : ''),
        qtyPeople: mapping.qtyAdults + mapping.qtyChildren,
        textQtyPeople: mapping.qtyAdults + ' adultos e ' + mapping.qtyChildren + ' crianças',
        description: mapping.description,
        referencePoint: mapping.referencePoint
    }});

    console.log('data ', data);
    console.log('data ', infos);

    return (
        <>
            <div className={styles["NewMarkerModal"]}>
                <div className={styles["modal"]}>
                    <div>
                        Existem localizações próximas ao endereço inserido.
                        Por favor, verifique se uma dessas localizações é a que você deseja cadastrar:
                    </div>
                    <div>
                    <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{ x: 'max-content' }}
                        pagination={{ pageSize: 10 }}
                    />
                    </div>
                    <div>
                        <WhiteButton onclick={() => handleNewMapping()} txt={"Cadastrar Nova Localização"} />
                    </div>
                    <div>
                        <WhiteButton onclick={() => handleClose()} txt={"Voltar Para o Mapa"} />
                    </div>
                </div>
            </div>

            <Modal
                title=""
                open={isModalOpen}
                centered
                zIndex={2000}
                onCancel={closeModal}
                footer={[
                <div className={styles["modalButtons"]}>
                    <GreenButton txt={"Sim"} onclick={confirmAddMappingToUser} />
                    <BlueButton txt={"Não, Voltar"} onclick={closeModal} />
                </div>
                ]}
            >
                <p>Este endereço já foi cadastrada em nosso sistema. Por favor, verifique as informações:</p>
                <p>Endereço: {selectedMapping?.fullAddress}</p>
                <p>Quantidade de pessoas: {selectedMapping?.textQtyPeople}</p>
                <p>Descrição: {selectedMapping?.description}</p>
                <p>Ponto de Referência: {selectedMapping?.referencePoint}</p>
                <p>Estas informações estão corretas?</p>
            </Modal>
        </>
    );
}

export default ExistingMarkerModal;