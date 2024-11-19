import styles from "./NewMarkerModal.module.css"
import LabelInput from "../../inputs/labelInput/LabelInput";
import RedButton from "../../buttons/redButton/RedButton";
import BlueButton from "../../buttons/blueButton/BlueButton";
import Checkbox from "../../inputs/checkboxInput/CheckboxInput";
import api from "../../../api";
import { toast } from "react-toastify"
import { useState, useEffect } from "react";


const NewMarkerModal = ({ handleClose, getMarkers, infos }) => {
    const [number, setNumber] = useState(infos.address.house_number);
    const [cep, setCep] = useState(infos.address.postcode);
    const [complement, setComplement] = useState("");
    const [reference, setReference] = useState("");
    const [qtyAdults, setQtyAdults] = useState("");
    const [qtyChildren, setQtyChildren] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [optionsActionTags, setOptionsActionsTags] = useState([
        { label: 'Comida', value: 1 },
        { label: 'Itens de Higiene', value: 2 },
        { label: 'Roupas/Cobertores', value: 3 },
        { label: 'Outros', value: 4 }
    ]);

    useEffect(() => {
        api.get('/tags',
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("USER_TOKEN")}`
                },
            }).then(response => {
                setOptionsActionsTags(response.data.map(tag => {
                    return {
                        label: tag.name,
                        value: tag.id
                    };
                }));
            }).catch(error => {
            });
    }, [])

    const handleTagChange = (id) => {
        setTags((prevTags) =>
            prevTags.includes(id)
                ? prevTags.filter((tag) => tag !== id)
                : [...prevTags, id]
        );
    };

    const handleCreateMarker = async () => {
        if (tags.length === 0) {
            toast.error("Selecione pelo menos uma tag");
            return;
        }
        const payload = {
            qtyAdults: qtyAdults,
            qtyChildren: qtyChildren,
            referencePoint: reference,
            latitude: infos.lat,
            longitude: infos.lng,
            hasDisorders: false,
            description: description,
            address: {
                cep: cep,
                number: number,
                complement: complement
            },
            tags: tags
        }

        try {
            const { status } = await api.post("/mapping", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("USER_TOKEN")}`
                }
            }).carch((err) => {
                toast.error('Erro ao criar o mapeamento. Tente novamente mais tarde.');
            });

            if (status === 200 || status === 201) {
                toast.success('Mapeamento criado com sucesso');
            }

            await getMarkers()
            handleClose()
        }
        catch (e) {
            if (e.response.status === 400) {
                toast.error("Preencha corretamente os campos")
            } else {
                toast.error("Erro ao criar o mapeamento")
            }
        }
    }

    return (
        <div className={styles["NewMarkerModal"]}>
            <div className={styles["modal"]}>
                <h2>Novo Pin</h2>
                <form className={styles["form"]}>
                    <LabelInput value={infos.address.road} label="Rua" placeholder="Rua" readOnly />
                    <div className={styles["Row"]}>
                        <LabelInput value={number} label="Numero" placeholder="Numero" onInput={(e) => setNumber(e.target.value)} />
                        <LabelInput value={cep} label="CEP" placeholder="CEP" onInput={(e) => setCep(e.target.value)} />
                    </div>
                    <div className={styles["Row"]}>
                        <LabelInput label="Complemento" placeholder="Complemento" onInput={(e) => setComplement(e.target.value)} />
                        <LabelInput label="Referencia" placeholder="Ponto de Referencia" onInput={(e) => setReference(e.target.value)} />
                    </div>
                    <div className={styles["Row"]}>
                        <LabelInput label="Adultos" placeholder="Quantidade Adultos" onInput={(e) => setQtyAdults(e.target.value)} />
                        <LabelInput label="Crianças" placeholder="Quantidade Crianças" onInput={(e) => setQtyChildren(e.target.value)} />
                    </div>
                    <div className={styles["Row-title"]}>
                        <a>Necessidade <span className={styles["Row-subtitle"]}>(Selecione pelo menos uma)</span>:</a>
                    </div>
                    <div className={styles["Row-checkbox-flex"]}>
                        {optionsActionTags.map((option) => (
                            <Checkbox
                                key={option.value}
                                label={option.label}
                                checked={tags.includes(option.value)}
                                onChange={() => handleTagChange(option.value)}
                            />
                        ))}
                    </div>
                    <div>
                        <p className={styles["textarea-label"]}>Descriçao</p>
                        <textarea onInput={(e) => setDescription(e.target.value)} className={styles["textarea"]} placeholder="Observações"></textarea>
                    </div>
                </form>
                <div className={styles["Row"]}>
                    <RedButton onclick={handleClose} txt="Fechar" customStyle={styles["button"]} />
                    <BlueButton onclick={handleCreateMarker} txt="Salvar" customStyle={styles["button"]} />
                </div>
            </div>
        </div>
    );
}

export default NewMarkerModal;