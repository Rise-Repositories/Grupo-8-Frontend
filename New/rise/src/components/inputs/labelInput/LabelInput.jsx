import React from "react";
import styles from "./LabelInput.module.css";
import StandardInput from "../standardInput/StandardInput";

const LabelInput = ({
    placeholder, label, onInput, mask, type, onBlur, value, customStyle, ...rest
}) => {
    return (
        <div className={`${styles["label-input"]} form-group`}>
            <label className="form-label">{label}</label>
            <StandardInput value={value} customStyle={customStyle}  placeholder={placeholder} onInput={onInput} mask={mask} type={type} onBlur={onBlur} {...rest}/>
        </div>
    );    
};

export default LabelInput;
