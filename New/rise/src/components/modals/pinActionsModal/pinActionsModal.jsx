import styles from './pinActionsModal.module.css';
import { FaInfoCircle, FaMapMarker, FaCalendar, FaQuestionCircle } from 'react-icons/fa';


const PinActionsModal = ({ action }) => {
    const statusTranslations = {
        "PENDING": "Pendente",
        "IN PROGRESS": "Em Andamento",
        "CANCELED": "Cancelada",
        "DONE": "Finalizada",
    };

    return (
        <div className={styles["info-area"]}>
            <div className={`${styles["info-row"]}`}>
                <div className={styles["info-row"]}>
                    <FaInfoCircle size={20} />
                    <p>Status:</p>
                </div>
                <p>{statusTranslations[action.status] || action.status || "Pendente"}</p>
            </div>

            <div className={`${styles["info-row"]}`}>
                <div className={styles["info-row"]}>
                    <FaQuestionCircle size={20} />
                    <p>Nome:</p>
                </div>
                <p>{action.name}</p>
            </div>


            <div className={`${styles["info-row"]}`}>
                <div className={styles["info-row"]}>
                    <FaCalendar size={20} />
                    <p>Data de Ínício:</p>
                </div>
                <p>{new Date(action.datetimeStart).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            <div className={`${styles["info-row"]}`}>
                <div className={styles["info-row"]}>
                    <FaCalendar size={20} />
                    <p>Data Fim:</p>
                </div>
                <p>{new Date(action.datetimeEnd).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>


            <div className={styles["info-row"]}>
                <div className={styles["info-row"]}>
                    <FaMapMarker size={20} />
                    <p>Raio de Alance:</p>
                </div>
                <p>{action.radius} Km</p>
            </div>

            {
                action.description &&
                <div className={styles["info-column"]}>
                    <div className={styles["info-row"]}>
                        <FaQuestionCircle size={20} />
                        <p>Descricao</p>
                    </div>
                    <p>{action.description}</p>
                </div>
            }
        </div>
    );
}

export default PinActionsModal;