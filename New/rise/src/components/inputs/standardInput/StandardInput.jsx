import React from "react";
import styles from "./StandardInput.module.css";
import InputMask from "react-input-mask";

const StandardInput = ({
    placeholder, onInput, mask, type, onBlur, customStyle, value, ...others
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
        ></InputMask>
    );
};

export default StandardInput;