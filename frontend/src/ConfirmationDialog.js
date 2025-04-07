import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

const ConfirmationDialog = ({ title, onConfirm, onCancel }) => {
    return ReactDOM.createPortal(
        <div className="dialog-overlay">
            <div className="dialog-box">
                <h5>{title}</h5>
                <div className="dialog-buttons">
                    <button onClick={onConfirm} className="final-confirm-button">YES</button>
                    <button onClick={onCancel} className="final-cancel-button">NO</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationDialog;
