import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

// A confirmation dialog with options YES or NO. Offers handlers for each option:
const ConfirmationDialog = ({ title, onConfirm, onCancel }) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onCancel();
                // Remove focus from any button
                document.activeElement?.blur();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onCancel]);

    const handleOverlayClick = (event) => {
        if (event.target.className === 'dialog-overlay') {
            onCancel();
        }
    };

    // ReactDOM.createPortal() can make modals easier.
    return ReactDOM.createPortal(
        <div className="dialog-overlay" onClick={handleOverlayClick}>
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
