import React from "react";
import styles from "./StandardInput.module.css";

const StandardInput = ({
    placeholder, onInput
}) => {
    return (
        <input type="text" className={styles["standard-input"]} placeholder={placeholder} onInput={onInput}></input>
    );
};

export default StandardInput;