import React, { useState } from "react";
import { Modal, Steps, Button, Upload, message, Spin } from "antd";
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import api from "../../../api";

const { Step } = Steps;

const ImportTxtModal = ({ visible, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadResult, setUploadResult] = useState("");
    const [isError, setIsError] = useState(false);

    const handleNext = () => {
        if (currentStep === 0) {
            if (!file) {
                message.error("Por favor, envie um arquivo antes de continuar.");
                return;
            }
            setCurrentStep(1);
            handleUpload();
        }
    };

    const handleUpload = () => {
        if (!file) {
            message.error("Por favor, selecione um arquivo antes de enviar.");
            return;
        }

        setLoading(true);
        setUploadResult("");
        setIsError(false);

        const reader = new FileReader();
        reader.onload = () => {
            const fileContent = reader.result;
            api.post("data/mapping/archive/txt", fileContent, {
                headers: {
                    "Content-Type": "text/plain",
                    Authorization: "Bearer " + sessionStorage.getItem("USER_TOKEN"),
                },
            })
                .then(() => {
                    setUploadResult("Arquivo enviado e processado com sucesso!");
                    setIsError(false);
                })
                .catch((error) => {
                    setUploadResult("Erro ao processar o arquivo. Certifique-se de que o conteúdo está conforme o especificado no documento de referência.");
                    setIsError(true);
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        reader.onerror = () => {
            message.error("Erro ao ler o arquivo.");
            setLoading(false);
        };

        reader.readAsText(file);
    };

    const handleFileChange = (info) => {
        const isTxt = info.file.type === "text/plain";
        if (!isTxt) {
            message.error("Apenas arquivos .txt são permitidos.");
            return;
        }
        setFile(info.file);
    };

    const handleClose = () => {
        // Resetar estados ao fechar o modal
        setCurrentStep(0);
        setFile(null);
        setUploadResult("");
        setIsError(false);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            onCancel={handleClose}
            footer={null}
            title="Importar dados de mapeamento"
        >
            <Steps current={currentStep}>
                <Step title="Envio de dados" />
                <Step title="Processando" />
            </Steps>
            <div style={{ marginTop: 20 }}>
                {currentStep === 0 && (
                    <>
                        <p style={{ marginBottom: 10 }}>
                            Para importar dados de mapeamento, confira o documento de referência e envie um arquivo com os parâmetros indicados conforme o indicado.
                        </p>
                        <Button type="primary" href="/path/to/layout.docx" target="_blank" style={{ marginBottom: 10, textDecoration: "none" }}>
                            Documento de referência
                        </Button>
                        <Upload.Dragger
                            name="file"
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                            fileList={file ? [file] : []}
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">Arraste o arquivo para cá ou clique para selecionar</p>
                        </Upload.Dragger>
                    </>
                )}

                {currentStep === 1 && (
                    <div style={{ textAlign: "center" }}>
                        {loading ? (
                            <Spin size="large" />
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                {isError ? (
                                    <>
                                        <CloseCircleOutlined style={{ fontSize: 24, color: "red" }} />
                                        <p style={{ color: "red" }}>{uploadResult}</p>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircleOutlined style={{ fontSize: 24, color: "green" }} />
                                        <p style={{ color: "green" }}>{uploadResult}</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div style={{ marginTop: 20, textAlign: "right" }}>
                {currentStep === 0 && (
                    <Button type="primary" onClick={handleNext}>
                        Continuar
                    </Button>
                )}
                {currentStep === 1 && (
                    <Button type="primary" onClick={handleClose}>
                        Fechar
                    </Button>
                )}
            </div>
        </Modal>
    );
};

export default ImportTxtModal;
