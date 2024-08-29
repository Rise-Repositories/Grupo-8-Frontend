import React from "react";
import styles from "./LabelInput.module.css";
import StandardInput from "../standardInput/StandardInput";

const LabelInput = ({
    placeholder, label, onInput, mask, type, onBlur, disabled, value, customStyle, ...rest
}) => {
    return (
        <div className={`${styles["label-input"]} form-group`}>
            <label className="form-label">{label}</label>
             <StandardInput 
             placeholder={placeholder} 
             value={value} 
             className="form-control" 
             customStyle={customStyle}  
             placeholder={placeholder} 
             onInput={onInput} 
             mask={mask} 
             type={type} 
             disabled={disabled}
             onBlur={onBlur} 
             {...rest}
             />
        </div>
    );
};

export default LabelInput;
