import React from "react";
import styles from "./LabelInput.module.css";
import StandardInput from "../standardInput/StandardInput";

const LabelInput = ({
    placeholder, label, onInput, mask, type, onBlur, value, customStyle, disabled, ...rest
}) => {
    return (
        <div className={`${styles["label-input"]} form-group`}>
            <label className="form-label">{label}</label>
            <StandardInput 
                placeholder={placeholder} 
                customStyle={customStyle} 
                className="form-control" 
                onInput={onInput} 
                value={value}
                mask={mask} 
                type={type} 
                onBlur={onBlur} 
                disabled={disabled}
                {...rest}
            />
        </div>
    );
};

export default LabelInput;
