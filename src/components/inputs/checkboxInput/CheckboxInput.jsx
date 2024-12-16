import React from 'react';
const Checkbox = ({ label, checked, onChange, onInput, name, disabled = false }) => {
  return (
    <label style={{ display: 'flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        onInput={onInput}
        name={name}
        disabled={disabled}
        style={{ marginRight: '8px' }}
      />
      {label}
    </label>
  );
};
export default Checkbox;