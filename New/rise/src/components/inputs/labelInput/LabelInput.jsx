import React from "react";
import styles from "./LabelInput.module.css";
import StandardInput from "../standardInput/StandardInput";

const LabelInput = ({
    placeholder, label, onInput, mask, type, onBlur
}) => {
    return (
        <div className={`${styles["label-input"]} form-group`}>
            <label className="form-label">{label}</label>
            <StandardInput placeholder={placeholder} className="form-control" onInput={onInput} mask={mask} type={type} onBlur={onBlur}/>
        </div>
    );    
};

export default LabelInput;
