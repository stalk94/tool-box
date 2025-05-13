import { useEffect } from 'react';



export function useKeyboardListener(callback: (key: string) => void) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            callback(e.key);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [callback]);
}