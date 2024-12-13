import React from "react";
import styles from "./WhiteButton.module.css";

const WhiteButton = ({
    txt, onclick
}) => {
    return (
        <div className={styles["btn-white-bg"]} onClick={onclick}>{txt}</div>
    );
};

export default WhiteButton;