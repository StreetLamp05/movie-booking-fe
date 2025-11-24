import type { TicketCounts, Pricing } from '@/lib/types';

// Calculate total tickets from ticket counts
export function getTotalTickets(counts: TicketCounts): number {
    return counts.adult + counts.child + counts.senior;
}

// Calculate total price in cents
export function calculateTotalPrice(counts: TicketCounts, pricing: Pricing): number {
    return (
        counts.adult * pricing.adult_price_cents +
        counts.child * pricing.child_price_cents +
        counts.senior * pricing.senior_price_cents
    );
}

// Format cents to currency string
export function formatCents(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
}

// Convert row index to letter (0 -> A, 1 -> B, etc.)
export function rowIndexToLetter(index: number): string {
    return String.fromCharCode(65 + index);
}

// Format time countdown (seconds to MM:SS)
export function formatCountdown(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Check if date is in the past
export function isPastDate(isoString: string): boolean {
    return new Date(isoString) < new Date();
}

// Format date/time for display
export function formatDateTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

export function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}