import * as React from 'react';


function extractYouTubeId(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
        if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
        return null;
    } catch { return null; }
}


export default function TrailerEmbed({ url }: { url: string }) {
    const id = extractYouTubeId(url);
    if (!id) return <a href={url} target="_blank" rel="noreferrer">Watch Trailer</a>;
    return (
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
        </div>
    );
}