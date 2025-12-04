'use client';

import './ConfirmModal.css';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
    isLoading?: boolean;
    isDangerous?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onClose,
    isLoading = false,
    isDangerous = false
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <>
            <div className="confirm-overlay" onClick={onClose}></div>
            <div className="confirm-modal">
                <div className="confirm-header">
                    <h2>{title}</h2>
                    <button className="confirm-close" onClick={onClose}>×</button>
                </div>

                <div className="confirm-body">
                    <p>{message}</p>
                </div>

                <div className="confirm-footer">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`btn-confirm ${isDangerous ? 'btn-danger' : ''}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : confirmText}
                    </button>
                </div>
            </div>
        </>
    );
}
