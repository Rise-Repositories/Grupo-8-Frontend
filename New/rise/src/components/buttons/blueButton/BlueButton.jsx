import React from "react";
import styles from "./BlueButton.module.css";

const BlueButton = ({
    txt, onclick
}) => {
    return (
        <div className={styles["btn-blue-bg"]} onClick={onclick}>{txt}</div>
    );
};

export default BlueButton;