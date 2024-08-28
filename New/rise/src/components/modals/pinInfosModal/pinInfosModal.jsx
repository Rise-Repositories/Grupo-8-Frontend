import styles from './pinInfosModal.module.css';
import { FaChild, FaMale, FaMapMarker, FaCalendar, FaQuestionCircle } from 'react-icons/fa';


const PinInfosModal = ({ pin }) => {
    return (
        <div className={styles["info-area"]}>
            <div className={`${styles["info-row"]} ${styles["between"]}`}>
                <div className={styles["info-row"]}>
                    <FaMale size={20}/>
                    <p>{pin.qtyAdults} Adultos</p>
                </div>
                <div className={styles["info-row"]}>
                    <FaChild size={20}/>
                    <p>{pin.qtyChildren} Criancas</p>
                </div>
            </div>

            <div className={`${styles["info-row"]}`}>
                <div className={styles["info-row"]}>
                    <FaCalendar size={20}/>
                    <p>Criado Em:</p>
                </div>
                <p>{pin.date}</p>
            </div>

            <div className={styles["info-column"]}>
                <div className={styles["info-row"]}>
                    <FaMapMarker size={20}/>
                    <p>Localizacao</p>
                </div>
                <p>{pin.address.street}, {pin.address.number}</p>
            </div>

            {
                pin.description &&
                <div className={styles["info-column"]}>
                    <div className={styles["info-row"]}>
                        <FaQuestionCircle size={20}/>
                        <p>Descricao</p>
                    </div>
                    <p>{pin.description}</p>
                </div>
            }
        </div>
    );
}

export default PinInfosModal;