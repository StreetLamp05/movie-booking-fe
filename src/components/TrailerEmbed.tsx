'use client';

import * as React from 'react';
import './TrailerEmbed.css';

function extractYouTubeId(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
        if (u.hostname.includes('youtube.com')) {
            if (u.pathname.includes('embed/')) {
                // Handle embed URLs like https://www.youtube.com/embed/6hB3S9bIaco
                return u.pathname.split('/embed/')[1];
            }
            return u.searchParams.get('v');
        }
        return null;
    } catch { return null; }
}

export default function TrailerEmbed({ url }: { url: string }) {
    const id = extractYouTubeId(url);

    // Always try to embed if we have an ID
    if (id) {
        return (
            <div className="glass trailer-container">
                <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title="Movie Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="trailer-iframe"
                />
            </div>
        );
    }

    // Only show button as fallback for non-YouTube URLs
    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="glass watch-trailer-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
            Watch Trailer (External Link)
        </a>
    );
}