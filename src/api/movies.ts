import { API_BASE_URL } from "./config";

export async function searchMovies(query: string) {
    const res = await fetch(`${API_BASE_URL}/movies?title=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search movies');
    return res.json();
}