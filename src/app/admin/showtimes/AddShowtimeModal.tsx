'use client';

import { useState, useEffect } from 'react';
import './AddShowtimeModal.css';

interface AddShowtimeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (showtimeData: ShowtimeFormData) => Promise<void>;
    movieId?: string;
}

export interface ShowtimeFormData {
    movie_id: number;
    auditorium_id: number;
    starts_at: string;
    child_price_cents: number;
    adult_price_cents: number;
    senior_price_cents: number;
}

interface Movie {
    id: number;
    title: string;
}

interface Auditorium {
    id: number;
    name: string;
}

export default function AddShowtimeModal({ isOpen, onClose, onSubmit, movieId }: AddShowtimeModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const[movies, setMovies] = useState<Movie[]>([]);
    const[auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
    const [formData, setFormData] = useState<ShowtimeFormData>({
        movie_id: 0,
        auditorium_id: 0,
        starts_at: '',
        child_price_cents: 800,
        adult_price_cents: 1200,
        senior_price_cents: 900
    });

    useEffect(() => {
        if (isOpen) {
            fetchMovies();
            fetchAuditoriums();
        }
    }, [isOpen]);
    useEffect(() => {
        if (movieId) {
            setFormData(prev => ({
                ...prev,
                movie_id: parseInt(movieId)
            }));
        }
    }, [movieId]);

    const fetchMovies = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/movies`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch movies');
            const data = await response.json();
            setMovies(data.data || []);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const fetchAuditoriums = async () => { 
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auditorium`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch auditoriums');
            const data = await response.json();
            setAuditoriums(data.data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement |HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'movie_id' || name === 'auditorium_id') {
            setFormData(prev => ({
                ...prev,
                [name]: parseInt(value)
            }));
        } else if (name === 'child_price' || name === 'adult_price' || name === 'senior_price') {
            const dollars = parseFloat(value);
            const cents = Math.round(dollars * 100);
            const fieldName = name + '_cents';
            setFormData(prev => ({
                ...prev,
                [fieldName]: cents
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.movie_id === 0) {
            setError('Please select a movie');
            setLoading(false);
            return;
        }
        if (formData.auditorium_id === 0) {
            setError('Please select an auditorium');
            setLoading(false);
            return;
        }   

        try {
            await onSubmit(formData);
            setFormData({
                movie_id: 0,
                auditorium_id: 0,
                starts_at: '',
                child_price_cents: 800,
                adult_price_cents: 1200,
                senior_price_cents: 900
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to add showtime');
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
                    <h2>Add New Showtime</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="movie_id">Movie *</label>
                        <select
                            id="movie_id"
                            name="movie_id"
                            value={formData.movie_id}
                            onChange={handleChange}
                            required
                            disabled={!!movieId}
                        >
                            <option value={0}>Select a movie</option>
                            {movies.map(movie => (
                                <option key={movie.id} value={movie.id}>
                                    {movie.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="auditorium_id">Auditorium *</label>
                        <select
                            id="auditorium_id"
                            name="auditorium_id"
                            value={formData.auditorium_id}
                            onChange={handleChange}
                            required
                        >
                            <option value={0}>Select an auditorium</option>
                            {auditoriums.map(auditorium => (
                                <option key={auditorium.id} value={auditorium.id}>
                                    {auditorium.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="starts_at">Show Time *</label>
                        <input
                            id="starts_at"
                            type="datetime-local"
                            name="starts_at"
                            value={formData.starts_at}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="child_price">Child Price ($) *</label>
                            <input
                                id='child_price'
                                type="number"
                                name="child_price"
                                step="0.01"
                                min="0"
                                value={(formData.child_price_cents / 100).toFixed(2)}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adult_price">Adult Price ($) *</label>
                            <input
                                id='adult_price'
                                type="number"
                                name="adult_price"
                                step="0.01"
                                min="0"
                                value={(formData.adult_price_cents / 100).toFixed(2)}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="senior_price">Senior Price ($) *</label>
                            <input
                                id='senior_price'
                                type="number"
                                name="senior_price"
                                step="0.01"
                                min="0"
                                value={(formData.senior_price_cents / 100).toFixed(2)}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Showtime'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
