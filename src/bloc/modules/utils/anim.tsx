import { createRoot } from 'react-dom/client';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';



const FlyingFFromElement = ({ element, onComplete }) => {
    const controls = useAnimation();

    useEffect(() => {
        const rect = element.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        controls.set({ x: startX, y: startY, rotate: 0, scale: 1, opacity: 1 });

        controls.start({
            x: startX + 200,
            y: startY - 150,
            rotate: 720,
            scale: 0,
            opacity: 0,
            transition: {
                duration: 1.2,
                ease: 'easeOut',
            },
        }).then(() => onComplete?.());
    }, []);

    return (
        <motion.div
            animate={controls}
            initial={false}
            style={{
                position: 'fixed',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'deepskyblue',
            }}
        >
            F
        </motion.div>
    );
}

export function triggerFlyFromComponent(dataId: string) {
    const el = document.querySelector(`[data-id="${dataId}"]`);
    if (!el) return;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    const root = createRoot(container);

    root.render(
        <FlyingFFromElement element={el} onComplete={() => {
            root.unmount();
            container.remove();
        }} />
    );
}