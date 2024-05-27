import React from "react";
import styles from "./BlueButton.module.css";

const BlueButton = ({
    txt
}) => {
    return (
        <div className={styles["btn-blue-bg"]}>{txt}</div>
    );
};

export default BlueButton;