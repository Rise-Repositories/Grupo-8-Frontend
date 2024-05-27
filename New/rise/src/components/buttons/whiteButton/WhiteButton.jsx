import React from "react";
import styles from "./WhiteButton.module.css";

const WhiteButton = ({
    txt
}) => {
    return (
        <div className={styles["btn-white-bg"]}>{txt}</div>
    );
};

export default WhiteButton;