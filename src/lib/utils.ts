export const fmtMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;
export const fmtDateTime = (iso: string) => new Date(iso).toLocaleString();
export const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });


// query string helper
export const qs = (params: Record<string, any>) => {
    const u = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v == null) return;
        if (Array.isArray(v)) v.forEach((x) => u.append(k, String(x)));
        else u.set(k, String(v));
    });
    const s = u.toString();
    return s ? `?${s}` : '';
};