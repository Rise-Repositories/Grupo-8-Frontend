import React from "react";
import styles from "./GreenButton.module.css";

const GreenButton = ({
    txt, onclick
}) => {
    return (
        <div className={styles["btn-green-bg"]} onClick={onclick}>{txt}</div>
    );
};

export default GreenButton;