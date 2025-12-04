'use client';

import './ConfirmModal.css';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    isDangerous?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    isLoading = false,
    isDangerous = false
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onCancel}></div>
            <div className="modal-content confirm-modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>

                <div className="confirm-message">
                    <p>{message}</p>
                </div>

                <div className="modal-footer">
                    <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button 
                        type="button" 
                        className={`btn-submit ${isDangerous ? 'btn-danger' : ''}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </>
    );
}
