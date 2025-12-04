'use client';

import { useEffect, useState } from 'react';

interface Promotion {
    promotion_id: string;
    code: string;
    description?: string;
    discount_percent: number;
    starts_at: string;
    ends_at: string;
    max_uses?: number;
    per_user_limit?: number;
    is_active: boolean;
    created_at: string;
}

interface SendPromotionModalProps {
    isOpen: boolean;
    promotion: Promotion | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SendPromotionModal({
    isOpen,
    promotion,
    onClose,
    onSuccess
}: SendPromotionModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [emailsSent, setEmailsSent] = useState(0);
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setError('');
            setSuccess('');
            setEmailsSent(0);
            setConfirming(false);
        }
    }, [isOpen]);

    const handleSendEmail = async () => {
        if (!promotion) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/promotions/${promotion.promotion_id}/send-email`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to send promotion emails');
            }

            setEmailsSent(data.emails_sent || 0);
            setSuccess(`Successfully sent ${data.emails_sent} promotion email(s)`);
            if (data.errors && data.errors.length > 0) {
                setError(`Encountered ${data.errors.length} error(s) during sending. Check logs for details.`);
            }
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to send promotion emails');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !promotion) {
        return null;
    }

    const startDate = new Date(promotion.starts_at).toLocaleDateString();
    const endDate = new Date(promotion.ends_at).toLocaleDateString();

    return (
        <div className="modal-overlay">
            <div className="modal-content send-promotion-modal">
                <div className="modal-header">
                    <h2>Send Promotion Email</h2>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    {success ? (
                        <div className="success-message">
                            <div className="icon">✓</div>
                            <p>{success}</p>
                        </div>
                    ) : (
                        <>
                            <div className="promotion-summary">
                                <h3>Promotion Details</h3>
                                <div className="summary-row">
                                    <span className="label">Code:</span>
                                    <span className="code">{promotion.code}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="label">Discount:</span>
                                    <span>{promotion.discount_percent}% OFF</span>
                                </div>
                                <div className="summary-row">
                                    <span className="label">Valid:</span>
                                    <span>{startDate} to {endDate}</span>
                                </div>
                                {promotion.description && (
                                    <div className="summary-row">
                                        <span className="label">Description:</span>
                                        <span>{promotion.description}</span>
                                    </div>
                                )}
                            </div>

                            <div className="email-info">
                                <p>This email will be sent to all users who have subscribed to promotional emails.</p>
                                <p className="subtle">Click "Send" to confirm and send the promotion to all subscribers.</p>
                            </div>

                            {!confirming && (
                                <div className="info-box">
                                    <strong>⚠️ Note:</strong> This action cannot be undone. The email will be sent to all subscribers.
                                </div>
                            )}

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            {confirming && (
                                <div className="confirmation-box">
                                    <p>Are you sure you want to send this promotion to all subscribers?</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="modal-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {success ? 'Close' : 'Cancel'}
                    </button>
                    {!success && (
                        <>
                            {!confirming && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setConfirming(true)}
                                    disabled={loading}
                                >
                                    Send Email
                                </button>
                            )}
                            {confirming && (
                                <>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setConfirming(false)}
                                        disabled={loading}
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleSendEmail}
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : 'Confirm & Send'}
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
