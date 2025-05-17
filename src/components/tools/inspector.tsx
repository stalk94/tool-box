import React, { useEffect, useRef, useState } from 'react';

interface DomSelectOverlayProps {
    active: boolean;
    onSelect: (el: HTMLElement, styles: CSSStyleDeclaration) => void;
    onHover?: (el: HTMLElement) => void;
    highlightColor?: string;
    allowedSelectors?: string[]; // Ограничение по селекторам
}


interface DomSelectOverlayProps {
  active: boolean;
  onSelect: (el: HTMLElement, styles: CSSStyleDeclaration) => void;
  onHover?: (el: HTMLElement) => void;
  highlightColor?: string;
  allowedSelectors?: string[]; // Ограничение по селекторам
}



export default function DomSelectOverlay({
  active,
  onSelect,
  onHover,
  highlightColor = 'rgba(0, 128, 255, 0.3)',
  allowedSelectors = []
}: DomSelectOverlayProps) {
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const paddingRef = useRef<HTMLDivElement | null>(null);
  const marginRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current ?? document.createElement('div');
    const paddingBox = paddingRef.current ?? document.createElement('div');
    const marginBox = marginRef.current ?? document.createElement('div');

    overlayRef.current = overlay;
    paddingRef.current = paddingBox;
    marginRef.current = marginBox;

    if (active) {
      Object.assign(overlay.style, {
        position: 'fixed',
        zIndex: '99999',
        pointerEvents: 'none',
        border: `2px dashed ${highlightColor}`,
        background: highlightColor,
        transition: 'all 0.05s ease-in-out'
      });

      Object.assign(paddingBox.style, {
        position: 'fixed',
        zIndex: '99998',
        pointerEvents: 'none',
        background: 'rgba(255, 255, 0, 0.3)'
      });

      Object.assign(marginBox.style, {
        position: 'fixed',
        zIndex: '99997',
        pointerEvents: 'none',
        background: 'rgba(255, 165, 0, 0.3)'
      });

      document.body.appendChild(marginBox);
      document.body.appendChild(paddingBox);
      document.body.appendChild(overlay);
    }

    const isAllowed = (el: HTMLElement) => {
      if (allowedSelectors.length === 0) return true;
      return allowedSelectors.some(sel => el.closest(sel));
    };

    const findTopMostElement = (x: number, y: number): HTMLElement | null => {
      const elements = document.elementsFromPoint(x, y) as HTMLElement[];
      return elements.find(el => el !== overlay && el !== paddingRef.current && el !== marginRef.current && isAllowed(el)) || null;
    };

    const onMouseMove = (e: MouseEvent) => {
      const el = findTopMostElement(e.clientX, e.clientY);
      if (!el) return;

      setHoveredEl(el);
      if (onHover) onHover(el);

      if (active) {
        const rect = el.getBoundingClientRect();
        const computed = window.getComputedStyle(el);

        const marginTop = parseFloat(computed.marginTop);
        const marginLeft = parseFloat(computed.marginLeft);
        const marginBottom = parseFloat(computed.marginBottom);
        const marginRight = parseFloat(computed.marginRight);

        const paddingTop = parseFloat(computed.paddingTop);
        const paddingLeft = parseFloat(computed.paddingLeft);
        const paddingBottom = parseFloat(computed.paddingBottom);
        const paddingRight = parseFloat(computed.paddingRight);

        Object.assign(marginBox.style, {
          top: `${rect.top - marginTop}px`,
          left: `${rect.left - marginLeft}px`,
          width: `${rect.width + marginLeft + marginRight}px`,
          height: `${rect.height + marginTop + marginBottom}px`
        });

        Object.assign(paddingBox.style, {
          top: `${rect.top + paddingTop}px`,
          left: `${rect.left + paddingLeft}px`,
          width: `${Math.max(rect.width - paddingLeft - paddingRight, 0)}px`,
          height: `${Math.max(rect.height - paddingTop - paddingBottom, 0)}px`
        });

        Object.assign(overlay.style, {
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`
        });
      }
    };

    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const el = findTopMostElement(e.clientX, e.clientY);
      if (el) {
        const computed = window.getComputedStyle(el);
        onSelect(el, computed);
      }
    };

    const cleanup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onClick, true);
      overlay.remove();
      paddingBox.remove();
      marginBox.remove();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onClick, true);

    return () => {
      cleanup();
    };
  }, [active, allowedSelectors]);

  return null;
}
