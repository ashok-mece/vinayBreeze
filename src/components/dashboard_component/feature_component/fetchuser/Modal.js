import React from 'react';

const Modal = ({ message, onClose, onConfirm }) => {
    if (!message) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '5px',
                    textAlign: 'center',
                    width: '300px',
                }}
            >
                <p>{message}</p>
                <button
                    onClick={onConfirm}
                    style={{
                        padding: '5px 10px',
                        fontSize: '14px',
                        marginRight: '10px',
                        borderRadius: '5px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Confirm
                </button>
                <button
                    onClick={onClose}
                    style={{
                        padding: '5px 10px',
                        fontSize: '14px',
                        borderRadius: '5px',
                        backgroundColor: '#ccc',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
