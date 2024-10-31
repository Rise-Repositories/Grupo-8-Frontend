import styles from "./NewMarkerModal.module.css"
import LabelInput from "../../inputs/labelInput/LabelInput";
import RedButton from "../../buttons/redButton/RedButton";
import BlueButton from "../../buttons/blueButton/BlueButton";
import api from "../../../api";
import {toast} from "react-toastify"
import { useState } from "react";


const NewMarkerModal = ({ handleClose, getMarkers, infos }) => {
    const [number, setNumber] = useState(infos.address.house_number);
    const [cep, setCep] = useState(infos.address.postcode);
    const [complement, setComplement] = useState("");
    const [reference, setReference] = useState("");
    const [qtyAdults, setQtyAdults] = useState("");
    const [qtyChildren, setQtyChildren] = useState("");
    const [description, setDescription] = useState("")

    const handleCreateMarker = async () => {
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
            }
        }

        try{
            const { status } = await api.post("/mapping", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("USER_TOKEN")}`
                }
            })

            if(status === 200 || status === 201){
                toast.success("Mapeamento criado com sucesso")
            }

            await getMarkers()
            handleClose()
        }
        catch(e){
            if(e.response.status === 400){
                toast.error("Preencha corretamente os campos")
            }
            toast.error("Erro ao criar o mapeamento")
        }
    }

    return (
        <div className={styles["NewMarkerModal"]}>
            <div className={styles["modal"]}>
                <h2>Novo Pin</h2>
                <form className={styles["form"]}>
                    <LabelInput value={infos.address.road} label="Rua" placeholder="Rua" readOnly/>
                    <div className={styles["Row"]}>
                        <LabelInput value={number} label="Numero" placeholder="Numero" onInput={(e) => setNumber(e.target.value)}/>
                        <LabelInput value={cep} label="CEP" placeholder="CEP" onInput={(e) => setCep(e.target.value)}/>
                    </div>
                    <div className={styles["Row"]}>
                        <LabelInput label="Complemento" placeholder="Complemento" onInput={(e) => setComplement(e.target.value)}/>
                        <LabelInput label="Referencia" placeholder="Ponto de Referencia" onInput={(e) => setReference(e.target.value)}/>
                    </div>
                    <div className={styles["Row"]}>
                        <LabelInput label="Adultos" placeholder="Quantidade Adultos" onInput={(e) => setQtyAdults(e.target.value)}/>
                        <LabelInput label="Crianças" placeholder="Quantidade Crianças" onInput={(e) => setQtyChildren(e.target.value)}/>
                    </div>
                    <div>
                        <p className={styles["textarea-label"]}>Descriçao</p>
                        <textarea onInput={(e)  => setDescription(e.target.value)} className={styles["textarea"]} placeholder="Observações"></textarea>
                    </div>
                </form>
                <div className={styles["Row"]}>
                    <RedButton onclick={handleClose} txt="Fechar" customStyle={styles["button"]}/>
                    <BlueButton onclick={handleCreateMarker} txt="Salvar" customStyle={styles["button"]}/>
                </div>
            </div>
        </div>
    );
}

export default NewMarkerModal;