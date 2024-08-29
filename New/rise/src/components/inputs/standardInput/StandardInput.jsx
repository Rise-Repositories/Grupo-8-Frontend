import React from "react";
import styles from "./StandardInput.module.css";
import InputMask from "react-input-mask";

const StandardInput = ({
    placeholder, onInput, mask, type, onBlur, customStyle, value, disabled, ...others
}) => {
    return (
        <InputMask 
            value={value}
            mask={mask} 
            type={type ? type : 'text'} 
            className={`${styles["standard-input"]} ${customStyle}`} 
            placeholder={placeholder} 
            onInput={onInput}
            onBlur={onBlur}
            {...others}
            disabled={disabled}
        />
    );
};

export default StandardInput;
