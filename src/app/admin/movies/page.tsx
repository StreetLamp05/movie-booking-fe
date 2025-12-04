'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddMovieModal, { MovieFormData } from './AddMovieModal';
import EditMovieModal from './EditMovieModal';
import ConfirmModal from './ConfirmModal';
import './movies.css';

interface Movie {
    id: string;
    title: string;
    genre: string;
    duration: number;
    release_date: string;
    description: string;
}

export default function MoviesPage() {
    const router = useRouter();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalState, setEditModalState] = useState<{ isOpen: boolean; movie: Movie | null }>({
        isOpen: false,
        movie: null
    });
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; movieId: string | null }>({
        isOpen: false,
        movieId: null
    });
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        checkAuth();
        fetchMovies();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auth/verify`, {
                credentials: 'include'
            });

            if (!response.ok) {
                router.push('/auth/login');
                return;
            }

            const data = await response.json();
            if (!data.is_admin && data.role !== 'admin') {
                router.push('/');
            }
        } catch (err) {
            router.push('/auth/login');
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/movies?limit=100`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();
            setMovies(data.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (movieId: string) => {
        setConfirmModal({ isOpen: true, movieId });
    };

    const handleEdit = (movie: Movie) => {
        setEditModalState({ isOpen: true, movie });
    };

    const handleConfirmDelete = async () => {
        const movieId = confirmModal.movieId;
        if (!movieId) return;

        setDeleteLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/movies/${movieId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to delete movie');
            }

            // Update movies list by filtering out the deleted movie
            setMovies(prevMovies => prevMovies.filter(m => m.id !== movieId));
            setConfirmModal({ isOpen: false, movieId: null });
            setError('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleAddMovie = async (formData: MovieFormData) => {
        try {
            // Map frontend fields to backend field names
            const backendData = {
                title: formData.title,
                categories: formData.genre,  // backend expects 'categories'
                film_rating_code: formData.rating,
                director: formData.director,
                producer: formData.producer,
                cast: formData.cast,
                synopsis: formData.synopsis,  // backend field name
                trailer_picture: formData.poster_url,  // backend field name
                video: formData.trailer_url  // backend field name for YouTube URL
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/movies`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backendData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to add movie');
            }

            const newMovie = await response.json();
            setMovies([newMovie.data || newMovie, ...movies]);
            setError('');
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const handleEditMovie = async (movieId: string, formData: MovieFormData) => {
        try {
            // Map frontend fields to backend field names
            const backendData = {
                title: formData.title,
                categories: formData.genre,  // backend expects 'categories'
                film_rating_code: formData.rating,
                director: formData.director,
                producer: formData.producer,
                cast: formData.cast,
                synopsis: formData.synopsis,  // backend field name
                trailer_picture: formData.poster_url,  // backend field name
                video: formData.trailer_url  // backend field name for YouTube URL
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/movies/${movieId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backendData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to update movie');
            }

            const updatedMovie = await response.json();
            // Update the movie in the list
            setMovies(prevMovies => prevMovies.map(m => m.id === movieId ? (updatedMovie.data || updatedMovie) : m));
            setError('');
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    if (loading) {
        return (
            <div className="movies-container">
                <div className="glass movies-loading">
                    Loading movies...
                </div>
            </div>
        );
    }

    return (
        <div className="movies-container">
            <header className="movies-header glass">
                <div>
                    <Link href="/admin" className="back-link">← Back to Dashboard</Link>
                    <h1 className="movies-title">Manage Movies</h1>
                    <p className="movies-subtitle">Add, edit, and remove movies from your catalog</p>
                </div>
                <button className="add-movie-button" onClick={() => setIsModalOpen(true)}>
                    + Add Movie
                </button>
            </header>

            {error && (
                <div className="error-message glass-error">
                    {error}
                </div>
            )}

            <section className="movies-section glass">
                <div className="movies-table-wrapper">
                    <table className="movies-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.length > 0 ? (
                                movies.map(movie => (
                                    <tr key={movie.id}>
                                        <td className="movie-title">{movie.title}</td>
                                        <td className="actions-cell">
                                            <button 
                                                className="action-button edit-btn"
                                                onClick={() => handleEdit(movie)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="action-button delete-btn"
                                                onClick={() => handleDelete(movie.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="empty-state">
                                        No movies found. Add one to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <AddMovieModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddMovie}
            />

            <EditMovieModal 
                isOpen={editModalState.isOpen}
                onClose={() => setEditModalState({ isOpen: false, movie: null })}
                onSubmit={handleEditMovie}
                movie={editModalState.movie}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title="Delete Movie"
                message="Are you sure you want to delete this movie? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmModal({ isOpen: false, movieId: null })}
                isLoading={deleteLoading}
                isDangerous={true}
            />
        </div>
    );
}
