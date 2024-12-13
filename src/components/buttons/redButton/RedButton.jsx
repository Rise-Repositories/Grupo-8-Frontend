import React from "react";
import styles from "./RedButton.module.css";

const RedButton = ({
    txt, onclick, customStyle
}) => {
    return (
        <div className={`${styles["btn-red-bg"]} ${customStyle}`} onClick={onclick}>{txt}</div>
    );
};

export default RedButton;