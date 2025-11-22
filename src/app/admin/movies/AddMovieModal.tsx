'use client';

import { useState } from 'react';
import './AddMovieModal.css';

interface AddMovieModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (movieData: MovieFormData) => Promise<void>;
}

export interface MovieFormData {
    title: string;
    genre: string[];
    synopsis: string;
    poster_url?: string;
    rating?: string;
    trailer_url?: string;
    director?: string;
    producer?: string;
    cast?: string;
}

export default function AddMovieModal({ isOpen, onClose, onSubmit }: AddMovieModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<MovieFormData>({
        title: '',
        genre: [],
        synopsis: '',
        poster_url: '',
        rating: 'PG',
        trailer_url: '',
        director: '',
        producer: '',
        cast: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'duration' ? parseFloat(value) : value
        }));
    };

    const handleGenreChange = (genreValue: string) => {
        setFormData(prev => ({
            ...prev,
            genre: prev.genre.includes(genreValue)
                ? prev.genre.filter(g => g !== genreValue)
                : [...prev.genre, genreValue]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSubmit(formData);
            setFormData({
                title: '',
                genre: [],
                synopsis: '',
                poster_url: '',
                rating: 'PG',
                trailer_url: '',
                director: '',
                producer: '',
                cast: ''
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to add movie');
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
                    <h2>Add New Movie</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Movie title"
                        />
                    </div>

                    <div className="form-group">
                        <label>Genres *</label>
                        <div className="genre-checkboxes">
                            {['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Documentary'].map(genre => (
                                <label key={genre} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.genre.includes(genre)}
                                        onChange={() => handleGenreChange(genre)}
                                    />
                                    <span>{genre}</span>
                                </label>
                            ))}
                        </div>
                        {formData.genre.length === 0 && <p className="form-error">Select at least one genre</p>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="rating">Rating *</label>
                            <select
                                id="rating"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                required
                            >
                                <option value="G">G</option>
                                <option value="PG">PG</option>
                                <option value="PG-13">PG-13</option>
                                <option value="R">R</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="director">Director *</label>
                            <input
                                id="director"
                                type="text"
                                name="director"
                                value={formData.director}
                                onChange={handleChange}
                                placeholder="Director name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="producer">Producer *</label>
                            <input
                                id="producer"
                                type="text"
                                name="producer"
                                value={formData.producer}
                                onChange={handleChange}
                                placeholder="Producer name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="synopsis">Synopsis *</label>
                        <textarea
                            id="synopsis"
                            name="synopsis"
                            value={formData.synopsis}
                            onChange={handleChange}
                            placeholder="Movie synopsis"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cast">Cast *</label>
                        <input
                            id="cast"
                            type="text"
                            name="cast"
                            value={formData.cast}
                            onChange={handleChange}
                            placeholder="e.g. Actor 1, Actor 2, Actor 3"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="poster_url">Poster URL *</label>
                        <input
                            id="poster_url"
                            type="url"
                            name="poster_url"
                            value={formData.poster_url}
                            onChange={handleChange}
                            placeholder="https://example.com/poster.jpg"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="trailer_url">Trailer YouTube Link *</label>
                        <input
                            id="trailer_url"
                            type="url"
                            name="trailer_url"
                            value={formData.trailer_url}
                            onChange={handleChange}
                            placeholder="https://www.youtube.com/watch?v=..."
                            required
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Movie'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
