import React from 'react';
import { useSnapshot } from 'valtio';
import PropTypes from 'prop-types';
import state from '../store';

const CustomButton = ({ type, title, customStyles, handleClick, disabled = false }) => {
  const snap = useSnapshot(state);

  const generateStyle = (type) => {
    if (type === "filled") {
      return {
        backgroundColor: disabled ? '#9CA3AF' : snap.color,
        color: "#fff",
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      };
    } else if (type === "outline") {
      return {
        borderWidth: "1px",
        borderColor: disabled ? '#9CA3AF' : snap.color,
        color: disabled ? '#9CA3AF' : snap.color,
        backgroundColor: 'transparent',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      };
    } else if (type === "success") {
      return {
        backgroundColor: "#10B981",
        color: "#fff",
      };
    }
    return {};
  };

  return (
    <button
      className={`px-4 py-2.5 rounded-md font-medium transition-all hover:scale-105 ${customStyles} ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={generateStyle(type)}
      onClick={disabled ? undefined : handleClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

CustomButton.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  customStyles: PropTypes.string,
  handleClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default CustomButton;