'use client';

import { useState, useEffect } from 'react';
import './AddMovieModal.css';

interface EditMovieModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (movieId: string, movieData: MovieFormData) => Promise<void>;
    movie: Movie | null;
}

interface Movie {
    id: string;
    title: string;
    genre: string;
    duration: number;
    release_date: string;
    description: string;
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

export default function EditMovieModal({ isOpen, onClose, onSubmit, movie }: EditMovieModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fetchingData, setFetchingData] = useState(false);
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

    useEffect(() => {
        if (movie && isOpen) {
            fetchMovieData(movie.id);
            setError('');
        }
    }, [movie, isOpen]);

    const fetchMovieData = async (movieId: string) => {
        setFetchingData(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/movies/${movieId}`,
                { credentials: 'include' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch movie data');
            }

            const data = await response.json();
            const movieData = data.data || data;

            // Extract genres from categories
            const genres = movieData.categories 
                ? movieData.categories.map((cat: any) => typeof cat === 'string' ? cat : cat.name)
                : [];

            setFormData({
                title: movieData.title || '',
                genre: genres,
                synopsis: movieData.synopsis || '',
                poster_url: movieData.trailer_picture || '',
                rating: movieData.film_rating_code || 'PG',
                trailer_url: movieData.video || '',
                director: movieData.director || '',
                producer: movieData.producer || '',
                cast: movieData.cast || ''
            });
        } catch (err: any) {
            setError(err.message || 'Failed to load movie data');
        } finally {
            setFetchingData(false);
        }
    }

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
            if (!movie) throw new Error('Movie not found');
            await onSubmit(movie.id, formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update movie');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !movie) return null;

    if (fetchingData) {
        return (
            <>
                <div className="modal-overlay" onClick={onClose}></div>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Edit Movie</h2>
                        <button className="modal-close" onClick={onClose}>×</button>
                    </div>
                    <div className="modal-form" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                        <p>Loading movie data...</p>
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
                    <h2>Edit Movie</h2>
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
                            {loading ? 'Updating...' : 'Update Movie'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
