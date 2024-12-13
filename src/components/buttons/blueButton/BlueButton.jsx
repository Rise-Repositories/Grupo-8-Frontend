import React from "react";
import styles from "./BlueButton.module.css";

const BlueButton = ({
    txt, onclick, customStyle
}) => {
    return (
        <div className={`${styles["btn-blue-bg"]} ${customStyle}`} onClick={onclick}>{txt}</div>
    );
};

export default BlueButton;