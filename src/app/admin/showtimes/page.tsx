'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddShowtimeModal, { ShowtimeFormData } from './AddShowtimeModal';
import EditShowtimeModal, { ShowtimeFormData as EditShowtimeFormData } from './EditShowtimeModal';
import './showtimes.css';

interface Movie {
    id: string;
    title: string;
}



export default function MoviesPage() {
    const router = useRouter();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [showtimes, setShowtimes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalState, setEditModalState] = useState<{ isOpen: boolean; movie: Movie | null }>({
        isOpen: false,
        movie: null
    });

    useEffect(() => {
        checkAuth();
        fetchMovies();
        fetchShowtimes();
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

    const fetchShowtimes = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/showtimes?limit=100`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch showtimes');
            }

            const data = await response.json();
            setShowtimes(data.data);
        } catch (err: any) {
            setError(err.message);
        }
    }; 

    const getShowtimeCount = (movieId: string) => {
        return showtimes.filter(showtime => showtime.movie_id === movieId).length;
    }

    const handleAddShowtime = async (showtimeData: ShowtimeFormData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/showtimes`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(showtimeData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to add showtime');
            }

            const newShowtime = await response.json();
            setShowtimes([newShowtime.data || newShowtime, ...showtimes]);
            setError('');
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const handleEditShowtime = async (showtimeId: string, showtimeData: EditShowtimeFormData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/showtimes/${showtimeId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(showtimeData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to update showtime');
            }

            const updatedShowtime = await response.json();
            setShowtimes(prevShowtimes => 
                prevShowtimes.map(st => st.showtime_id === showtimeId ? (updatedShowtime.data || updatedShowtime) : st)
            );
            setError('');
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const handleEdit = (movie: Movie) => {
        setEditModalState({ isOpen: true, movie });
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
                    <h1 className="movies-title">Manage Showtimes</h1>
                    <p className="movies-subtitle">Add, edit, and remove showtimes from your catalog</p>
                </div>
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
                                <th>Showtimes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.length > 0 ? (
                                movies.map(movie => (
                                    <tr key={movie.id}>
                                        <td className="movie-title">{movie.title}</td>
                                        <td className="showtime-count">
                                            {getShowtimeCount(movie.id)}
                                        </td>
                                        <td className="showtime-actions">
                                            {getShowtimeCount(movie.id) === 0 ? (
                                                <button 
                                                    className="action-button add-btn"
                                                    onClick={() => setIsModalOpen(true)}       
                                                    >
                                                    Add Showtime
                                                    </button>  
                                            ) : (
                                                <>
                                                    <button 
                                                        className="action-button add-btn"
                                                        onClick={() => setIsModalOpen(true)}       
                                                        >
                                                        Add Showtime
                                                    </button>  
                                                    <button 
                                                        className="action-button edit-btn"
                                                        onClick={() => handleEdit(movie)}
                                                        >
                                                        Edit Showtimes
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="empty-state">
                                        No movies found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <AddShowtimeModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddShowtime}
            />

            <EditShowtimeModal 
                isOpen={editModalState.isOpen}
                onClose={() => setEditModalState({ isOpen: false, movie: null })}
                onSubmit={handleEditShowtime}
                movie={editModalState.movie}
            />

        </div>
    );
}
