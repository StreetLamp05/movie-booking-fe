'use client';

import { useState } from 'react';
import './AddAuditoriumModal.css';

interface AddAuditoriumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (auditoriumData: AuditoriumFormData) => Promise<void>;
}

export interface AuditoriumFormData {
    name: string;
    num_rows: number;
    num_cols: number;
}

export default function AddAuditoriumModal({ isOpen, onClose, onSubmit }: AddAuditoriumModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<AuditoriumFormData>({
        name: '',
        num_rows: 10,
        num_cols: 10
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'name' ? value : parseInt(value) || 0
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSubmit(formData);
            setFormData({
                name: '',
                num_rows: 10,
                num_cols: 10
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to add auditorium');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Auditorium</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="name">Auditorium Name *</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Theater A, Screen 1"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="num_rows">Number of Rows *</label>
                            <input
                                id="num_rows"
                                type="number"
                                name="num_rows"
                                value={formData.num_rows}
                                onChange={handleChange}
                                required
                                min="1"
                                max="50"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="num_cols">Number of Columns *</label>
                            <input
                                id="num_cols"
                                type="number"
                                name="num_cols"
                                value={formData.num_cols}
                                onChange={handleChange}
                                required
                                min="1"
                                max="50"
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', marginTop: '8px' }}>
                        <p style={{ margin: '0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                            Total Seats: <strong style={{ color: '#fff' }}>{formData.num_rows * formData.num_cols}</strong>
                        </p>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Auditorium'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
