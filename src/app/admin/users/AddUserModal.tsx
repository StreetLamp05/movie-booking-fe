'use client';

import { useState } from 'react';
import './AddUserModal.css';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: UserFormData) => Promise<void>;
}

export interface UserFormData {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    role?: 'admin' | 'user';
    is_verified?: boolean;
}

export default function AddUserModal({ isOpen, onClose, onSubmit }: AddUserModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        role: 'user',
        is_verified: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value } = target;
        const isCheckbox = (target as HTMLInputElement).type === 'checkbox';
        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? (target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSubmit(formData);
            setFormData({
                email: '',
                first_name: '',
                last_name: '',
                password: '',
                role: 'user',
                is_verified: false
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to add user');
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
                    <h2>Add New User</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="user@example.com"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first_name">First Name *</label>
                            <input
                                id="first_name"
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                placeholder="First name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Last Name *</label>
                            <input
                                id="last_name"
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                placeholder="Last name"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Password"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="role">Role *</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="form-group checkbox-group">
                            <label htmlFor="is_verified">
                                <input
                                    id="is_verified"
                                    type="checkbox"
                                    name="is_verified"
                                    checked={formData.is_verified}
                                    onChange={handleChange}
                                />
                                <span>Verified</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
