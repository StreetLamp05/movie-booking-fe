'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';


export function useQueryParams() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();


    const setParams = useCallback((updates: Record<string, string | string[] | undefined>) => {
        const usp = new URLSearchParams(searchParams?.toString());
        Object.entries(updates).forEach(([k, v]) => {
            usp.delete(k);
            if (v == null) return;
            if (Array.isArray(v)) v.forEach((x) => usp.append(k, x));
            else usp.set(k, v);
        });
        router.replace(`${pathname}?${usp.toString()}`);
    }, [router, pathname, searchParams]);


    return { searchParams, setParams };
}