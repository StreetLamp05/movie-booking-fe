'use client';

import { useState, useEffect } from 'react';
import './AddAuditoriumModal.css';

interface EditAuditoriumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (auditoriumId: string, auditoriumData: AuditoriumFormData) => Promise<void>;
    auditorium: Auditorium | null;
}

interface Auditorium {
    id: string;
    name: string;
    num_rows: number;
    num_cols: number;
}

export interface AuditoriumFormData {
    name: string;
    num_rows: number;
    num_cols: number;
}

export default function EditAuditoriumModal({ isOpen, onClose, onSubmit, auditorium }: EditAuditoriumModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fetchingData, setFetchingData] = useState(false);
    const [formData, setFormData] = useState<AuditoriumFormData>({
        name: '',
        num_rows: 10,
        num_cols: 10
    });

    useEffect(() => {
        if (auditorium && isOpen) {
            fetchAuditoriumData(auditorium.id);
            setError('');
        }
    }, [auditorium, isOpen]);

    const fetchAuditoriumData = async (auditoriumId: string) => {
        setFetchingData(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auditoriums/${auditoriumId}`,
                { credentials: 'include' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch auditorium data');
            }

            const data = await response.json();
            const auditoriumData = data.data || data;

            setFormData({
                name: auditoriumData.name || '',
                num_rows: auditoriumData.row_count || auditoriumData.num_rows || 10,
                num_cols: auditoriumData.col_count || auditoriumData.num_cols || 10
            });
        } catch (err: any) {
            setError(err.message || 'Failed to load auditorium data');
        } finally {
            setFetchingData(false);
        }
    }

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
            if (!auditorium) throw new Error('Auditorium not found');
            await onSubmit(auditorium.id, formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update auditorium');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !auditorium) return null;

    if (fetchingData) {
        return (
            <>
                <div className="modal-overlay" onClick={onClose}></div>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Edit Auditorium</h2>
                        <button className="modal-close" onClick={onClose}>×</button>
                    </div>
                    <div className="modal-form" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                        <p>Loading auditorium data...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Edit Auditorium</h2>
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
                            {loading ? 'Updating...' : 'Update Auditorium'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
