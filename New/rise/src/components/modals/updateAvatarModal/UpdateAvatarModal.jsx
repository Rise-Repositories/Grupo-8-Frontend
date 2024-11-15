import React, { useState } from "react";
import { Modal, Steps, Button, Upload, message, Spin, ConfigProvider } from "antd";
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import api from "../../../api";

const { Step } = Steps;

const UploadAvatarModal = ({ visible, onClose, userId, onAvatarUpdate }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadResult, setUploadResult] = useState("");
    const [isError, setIsError] = useState(false);

    const handleNext = () => {
        if (currentStep === 0) {
            if (!file) {
                message.error("Por favor, selecione uma imagem antes de continuar.");
                return;
            }
            setCurrentStep(1);
            handleUpload();
        }
    };

    const handleFileChange = (info) => {
        if (info.file && info.file.originFileObj) {
            const selectedFile = info.file.originFileObj;
    
            // Verifica se o tipo de arquivo é suportado (JPEG ou PNG)
            if (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png") {
                try {
                    const previewUrl = URL.createObjectURL(selectedFile);
                    setFileUrl(previewUrl);
                    setFile(selectedFile);
                } catch (error) {
                    console.error("Erro ao criar a URL de pré-visualização:", error);
                    message.error("Erro ao carregar a imagem. Por favor, tente novamente.");
                }
            } else {
                message.error("Apenas arquivos de imagem JPEG ou PNG são permitidos.");
            }
        }
    };
    

    const handleUpload = () => {
        if (!file) {
            message.error("Selecione uma imagem para enviar.");
            return;
        }
        setLoading(true);
        const reader = new FileReader();

        reader.onload = async () => {
            const fileData = reader.result.split(',')[1];
            let base64String = "";

            if (file.type === "image/jpeg") {
                base64String = `data:image/jpeg;base64,${fileData}`;
            } else if (file.type === "image/png") {
                base64String = `data:image/png;base64,${fileData}`;
            } else {
                message.error("Formato de imagem não suportado. Apenas JPEG e PNG são permitidos.");
                setLoading(false);
                return;
            }

            try {
                const token = sessionStorage.getItem('USER_TOKEN');
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };
                await api.post(`/user/file/${userId}`, {
                    fileBase64: base64String
                }, { headers });
                setUploadResult("Imagem alterada com sucesso!");
                setIsError(false);

                onAvatarUpdate(fileUrl);
            } catch (error) {
                setUploadResult("Erro ao enviar a imagem.");
                setIsError(true);
            } finally {
                setLoading(false);
            }
        };

        reader.onerror = () => {
            message.error("Erro ao ler o arquivo.");
            setLoading(false);
        };

        reader.readAsDataURL(file);
    };

    const handleClose = () => {
        setCurrentStep(0);
        setFile(null);
        setFileUrl(null);
        setUploadResult("");
        setIsError(false);
        onClose();
    };

    const beforeUpload = (file) => {
        const previewUrl = URL.createObjectURL(file);
        setFileUrl(previewUrl);
        setFile(file);
        return false;
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#2968C8",
                    borderRadius: 5,
                },
            }}
        >
            <Modal
                visible={visible}
                onCancel={handleClose}
                footer={null}
                title="Alterar foto de perfil"
            >
                <Steps current={currentStep}>
                    <Step title="Selecionar Imagem" />
                    <Step title="Carregar Imagem" />
                </Steps>
                <div style={{ marginTop: 20 }}>
                    {currentStep === 0 && (
                        <>
                            <p style={{ marginBottom: 10 }}>
                                Selecione uma nova imagem para o avatar.
                            </p>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <Upload
                                    name="avatar"
                                    listType="picture-circle"
                                    beforeUpload={beforeUpload}
                                    onChange={handleFileChange}
                                    maxCount={1}
                                    showUploadList={false}
                                >
                                    <div>
                                        <UploadOutlined />
                                        <div>Carregar</div>
                                    </div>
                                </Upload>
                                {fileUrl && <img src={fileUrl} alt="Preview" style={{ marginLeft: 10, width: '100px', height: '100px', borderRadius: '50%' }} />}
                            </div>
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
                            Salvar
                        </Button>
                    )}
                    {currentStep === 1 && (
                        <Button type="primary" onClick={handleClose}>
                            Fechar
                        </Button>
                    )}
                </div>
            </Modal>
        </ConfigProvider>
    );
};

export default UploadAvatarModal;
