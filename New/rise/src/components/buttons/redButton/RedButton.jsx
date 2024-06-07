import React from "react";
import styles from "./RedButton.module.css";

const RedButton = ({
    txt, onclick
}) => {
    return (
        <div className={styles["btn-red-bg"]} onClick={onclick}>{txt}</div>
    );
};

export default RedButton;