'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import type { CardPaymentRequest, CardPayment } from '@/lib/types';
import './card-payment-form.css';

interface CardPaymentFormProps {
    onSubmit: (payment: CardPaymentRequest) => void;
    isSubmitting?: boolean;
    error?: string;
    savedCards?: CardPayment[];
}

export interface CardPaymentFormHandle {
    validate: () => boolean;
    getPaymentData: () => CardPaymentRequest | null;
    getSavedCardId: () => string | null;
}

const CardPaymentForm = forwardRef<CardPaymentFormHandle, CardPaymentFormProps>(
    ({ onSubmit, isSubmitting = false, error, savedCards = [] }, ref) => {
        const [selectedSavedCardId, setSelectedSavedCardId] = useState<string>('');
        const [cardNumber, setCardNumber] = useState('');
        const [expiry, setExpiry] = useState('');
        const [cardholderName, setCardholderName] = useState('');
        const [cardType, setCardType] = useState<'debit' | 'credit'>('credit');
        
        const [billingStreet, setBillingStreet] = useState('');
        const [billingCity, setBillingCity] = useState('');
        const [billingState, setBillingState] = useState('');
        const [billingZip, setBillingZip] = useState('');

        const selectedSavedCard = savedCards.find(c => c.billing_info_id === selectedSavedCardId);

        const isUsingNewCard = !selectedSavedCardId;
        const isNewCardValid = cardNumber && expiry && cardholderName;
        const canSubmit = !!selectedSavedCardId || !!isNewCardValid;

        useImperativeHandle(ref, () => ({
            validate: () => canSubmit,
            getSavedCardId: () => selectedSavedCardId || null,
            getPaymentData: () => {
                if (isNewCardValid) {
                    // Use form data
                    const [month, year] = expiry.split('/');
                    const fullYear = `20${year}`;

                    const payment: CardPaymentRequest = {
                        card_number: cardNumber,
                        card_exp_month: month,
                        card_exp_year: fullYear,
                        card_cvv: '000',
                        cardholder_name: cardholderName,
                        card_type: cardType,
                        billing_street: billingStreet,
                        billing_city: billingCity,
                        billing_state: billingState.toUpperCase(),
                        billing_zip_code: billingZip,
                    };
                    return payment;
                }
                return null;
            }
        }));

        const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.replace(/[^\d\s]/g, '');
            const formatted = value
                .replace(/\s/g, '')
                .replace(/(.{4})/g, '$1 ')
                .trim();
            setCardNumber(formatted.slice(0, 19));
        };

        const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            setExpiry(value.slice(0, 5));
        };

        const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.replace(/\D/g, '');
            setBillingZip(value.slice(0, 5));
        };

        const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
            setBillingState(value.slice(0, 2));
        };

        return (
            <div className="card-payment-form">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>
                    Payment Information
                </h3>

                {error && (
                    <div className="payment-error" style={{
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        color: '#ef4444',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="saved-card">Use Saved Card</label>
                    <select
                        id="saved-card"
                        className="form-input"
                        value={selectedSavedCardId}
                        onChange={(e) => setSelectedSavedCardId(e.target.value)}
                        disabled={isSubmitting}
                    >
                        <option value="">Use New Card</option>
                        {savedCards.map(card => (
                            <option key={card.billing_info_id} value={card.billing_info_id}>
                                {card.card_type.charAt(0).toUpperCase() + card.card_type.slice(1)} - {card.cardholder_name}
                            </option>
                        ))}
                    </select>
                </div>

                {isUsingNewCard && (
                    <>
                        <div className="form-group">
                            <label htmlFor="cardholder-name">Cardholder Name</label>
                            <input
                                id="cardholder-name"
                                type="text"
                                className="form-input"
                                placeholder="John Doe"
                                value={cardholderName}
                                onChange={(e) => setCardholderName(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card-number">Card Number</label>
                            <input
                                id="card-number"
                                type="text"
                                className="form-input"
                                placeholder="1234 1234 1234 1234"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div className="form-row-inline">
                            <div className="form-group">
                                <label htmlFor="card-type">Card Type</label>
                                <select
                                    id="card-type"
                                    className="form-input"
                                    value={cardType}
                                    onChange={(e) => setCardType(e.target.value as 'debit' | 'credit')}
                                    disabled={isSubmitting}
                                    required
                                >
                                    <option value="credit">Credit Card</option>
                                    <option value="debit">Debit Card</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="expiry">Expiry (MM/YY)</label>
                                <input
                                    id="expiry"
                                    type="text"
                                    className="form-input"
                                    placeholder="12/25"
                                    maxLength={5}
                                    value={expiry}
                                    onChange={handleExpiryChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="billing-street">Street Address</label>
                            <input
                                id="billing-street"
                                type="text"
                                className="form-input"
                                placeholder="123 Main Street"
                                value={billingStreet}
                                onChange={(e) => setBillingStreet(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div className="form-row-inline">
                            <div className="form-group">
                                <label htmlFor="billing-city">City</label>
                                <input
                                    id="billing-city"
                                    type="text"
                                    className="form-input"
                                    placeholder="Athens"
                                    value={billingCity}
                                    onChange={(e) => setBillingCity(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="billing-state">State</label>
                                <input
                                    id="billing-state"
                                    type="text"
                                    className="form-input"
                                    placeholder="GA"
                                    maxLength={2}
                                    value={billingState}
                                    onChange={handleStateChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="billing-zip">ZIP Code</label>
                                <input
                                    id="billing-zip"
                                    type="text"
                                    className="form-input"
                                    placeholder="30601"
                                    maxLength={5}
                                    value={billingZip}
                                    onChange={handleZipChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    },
);

CardPaymentForm.displayName = 'CardPaymentForm';

export default CardPaymentForm;
