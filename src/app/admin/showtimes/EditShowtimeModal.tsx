'use client';

import { useState, useEffect } from 'react';
import './AddShowtimeModal.css';

interface EditShowtimeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (showtimeId: string, showtimeData: ShowtimeFormData) => Promise<void>;
    movie: Movie | null;
}

interface Movie {
    id: string;
    title: string;
}

interface Auditorium {
    id: number;
    name: string;
}

export interface ShowtimeFormData {
    auditorium_id: number;
    starts_at: string;
    child_price_cents: number;
    adult_price_cents: number;
    senior_price_cents: number;
}

interface Showtime {
    showtime_id: string;
    movie_id: number;
    auditorium_id: number;
    starts_at: string;
    child_price_cents: number;
    adult_price_cents: number;
    senior_price_cents: number;
}


export default function EditShowtimeModal({ isOpen, onClose, onSubmit, movie }: EditShowtimeModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fetchingData, setFetchingData] = useState(false);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);

    useEffect(() => {
        if (movie && isOpen) {
            fetchShowtimes();
            fetchAuditoriums();
            setError('');
        }
    }, [movie, isOpen]);

    const fetchShowtimes = async () => {
        if (!movie) return;
        setFetchingData(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/showtimes?movie_id=${movie.id}`,
                { credentials: 'include' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch showtimes');
            }

            const data = await response.json();
            setShowtimes(data.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load showtime data');
        } finally {
            setFetchingData(false);
        }
    };

    const fetchAuditoriums = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auditoriums`,
                { credentials: 'include' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch auditoriums');
            }

            const data = await response.json();
            setAuditoriums(data.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load auditoriums');
        }
    }; 

    const handleDelete = async (showtimeId: string) => {
        if (!window.confirm('Are you sure you want to delete this showtime?')) return;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/showtimes/${showtimeId}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to delete showtime');
            }

            setShowtimes(prev => prev.filter(st => st.showtime_id !== showtimeId));
            setError('');
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toISOString().slice(0,16);
    };

    const formatDisplayTime = (isoString: string) => {
        const date = new Date(isoString);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const amorpm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${month} ${day}, ${year}, ${hours}:${minutes}`;
    };

    const getAuditoriumName = (auditoriumId: number) => {
        const auditorium = auditoriums.find(a => a.id === auditoriumId);
        return auditorium?.name || `Auditorium ${auditoriumId}`;
    };

    if (!isOpen || !movie) return null;

    if (fetchingData) {
        return (
            <>
                <div className="modal-overlay" onClick={onClose}></div>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Edit Showtimes - {movie.title}</h2>
                        <button className="modal-close" onClick={onClose}>×</button>
                    </div>
                    <div className="modal-form" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                        <p>Loading showtime data...</p>
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
                    <h2>Edit Showtimes - {movie.title}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <div className="showtime-list-container">
                    {showtimes.length === 0 ? (
                        <p className="empty-state">No showtimes available for this movie.</p>
                    ) : (
                        <div className="showtimes-list">
                            {showtimes.map(showtime => (
                                <ShowtimeRow
                                    key={showtime.showtime_id}
                                    showtime={showtime}
                                    auditoriums={auditoriums}
                                    onSubmit={onSubmit}
                                    onDelete={handleDelete}
                                    formatDateTime={formatDateTime}
                                    formatDisplayTime={formatDisplayTime}
                                    getAuditoriumName={getAuditoriumName}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}

interface ShowtimeRowProps {
    showtime: Showtime;
    auditoriums: Auditorium[];
    onSubmit: (showtimeId: string, showtimeData: ShowtimeFormData) => Promise<void>;
    onDelete: (showtimeId: string) => void;
    formatDateTime: (isoString: string) => string;
    formatDisplayTime: (isoString: string) => string;
    getAuditoriumName: (auditoriumId: number) => string;
}

function ShowtimeRow({
    showtime,
    auditoriums,
    onSubmit,
    onDelete,
    formatDateTime,
    formatDisplayTime,
    getAuditoriumName
}: ShowtimeRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        auditorium_id: showtime.auditorium_id,
        starts_at: formatDateTime(showtime.starts_at),
        child_price_cents: showtime.child_price_cents,
        adult_price_cents: showtime.adult_price_cents,
        senior_price_cents: showtime.senior_price_cents
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'auditorium_id') {
            setEditData(prev => ({
                ...prev,
                [name]: parseInt(value)
            }));
        } else if (name === 'child_price' || name === 'adult_price' || name === 'senior_price') {
            const dollars = parseFloat(value);
            const cents = Math.round(dollars * 100);
            const fieldName = name + '_cents';
            setEditData(prev => ({
                ...prev,
                [fieldName]: cents
            }));
        } else {
            setEditData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(showtime.showtime_id, editData);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <form onSubmit={handleSubmit} className="showtime-row editing">
                <div className="showtime-edit-grid">
                    <div className="form-group">
                        <label>Auditorium</label>
                        <select
                            name="auditorium_id"
                            value={editData.auditorium_id}
                            onChange={handleChange}
                        >
                            {auditoriums.map(aud => (
                                <option key={aud.id} value={aud.id}>
                                    {aud.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Start Time</label>
                        <input
                            type="datetime-local"
                            name="starts_at"
                            value={editData.starts_at}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Child Price ($)</label>
                        <input
                            type="number"
                            name="child_price"
                            step="0.01"
                            min="0"
                            value={(editData.child_price_cents / 100).toFixed(2)}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Adult Price ($)</label>
                        <input
                            type="number"
                            name="adult_price"
                            step="0.01"
                            min="0"
                            value={(editData.adult_price_cents / 100).toFixed(2)}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Senior Price ($)</label>
                        <input
                            type="number"
                            name="senior_price"
                            step="0.01"
                            min="0"
                            value={(editData.senior_price_cents / 100).toFixed(2)}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="showtime-row-actions">
                    <button type="submit" className="btn-save">
                        Save
                    </button>
                    <button type="button" className="btn-cancel-edit" onClick={() => setIsEditing(false)}>
                        Cancel
                    </button>
                </div>
            </form>
        );
    }
    return (
        <div className="showtime-row">
            <div className="showtime-info">
                <div className="showtime-detail">
                    <span className="label">Time: </span>
                    <span className="value">{formatDisplayTime(showtime.starts_at)}</span>
                </div>
                <div className="showtime-detail">
                    <span className="label">Auditorium: </span>
                    <span className="value">{getAuditoriumName(showtime.auditorium_id)}</span>
                </div>
                <div className="showtime-detail">
                    <span className="label">Prices: </span>
                    <span className="value">
                        Child: ${(showtime.child_price_cents / 100).toFixed(2)}, 
                        Adult: ${(showtime.adult_price_cents / 100).toFixed(2)}, 
                        Senior: ${(showtime.senior_price_cents / 100).toFixed(2)}
                    </span>
                </div>
            </div>
            <div className="showtime-row-actions">
                <button className="btn-edit-row" onClick={() => setIsEditing(true)}>
                    Edit
                </button>
                <button className="btn-delete" onClick={() => onDelete(showtime.showtime_id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}


        
