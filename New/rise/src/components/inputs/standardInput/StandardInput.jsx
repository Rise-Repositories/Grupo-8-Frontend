import React from "react";
import styles from "./StandardInput.module.css";

const StandardInput = ({
    placeholder
}) => {
    return (
        <input type="text" className={styles["standard-input"]} placeholder={placeholder}></input>
    );
};

export default StandardInput;