import React from "react";
import styles from "./StandardInput.module.css";
import InputMask from "react-input-mask";

const StandardInput = ({
    placeholder, onInput, mask, type, onBlur
}) => {
    return (
        <InputMask 
            mask={mask} 
            type={type ? type : 'text'} 
            className={styles["standard-input"]} 
            placeholder={placeholder} 
            onInput={onInput}
            onBlur={onBlur}
            ></InputMask>
    );
};

export default StandardInput;