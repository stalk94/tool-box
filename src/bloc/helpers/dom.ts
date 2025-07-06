
/** получить emotion styles всех в контейнере */
export function extractMuiStylesForContainer(container: HTMLElement): string {
    const usedClasses = new Set<string>();

    // 1. Собираем классы ТОЛЬКО из container и его потомков
    container.querySelectorAll('*').forEach((el) => {
        el.classList.forEach((cls) => {
            if (cls.startsWith('Mui') || cls.startsWith('css-')) {
                usedClasses.add(`.${cls}`);
            }
        });
    });

    const matchedRules: string[] = [];

    // 2. Обходим только MUI / emotion стили
    for (const sheet of document.styleSheets) {
        try {
            if (
                sheet.ownerNode instanceof HTMLStyleElement &&
                sheet.ownerNode.getAttribute('data-emotion')
            ) {
                for (const rule of sheet.cssRules) {
                    if ('selectorText' in rule) {
                        const selectors = rule.selectorText.split(',');
                        const isUsed = selectors.some((sel) =>
                            Array.from(usedClasses).some((used) => sel.trim().startsWith(used))
                        );
                        if (isUsed) {
                            matchedRules.push(rule.cssText);
                        }
                    }
                }
            }
        } 
        catch (err) {
            console.warn('Cannot access stylesheet:', sheet.href, err);
        }
    }

    return matchedRules.join('\n');
}

export function oklchToRgba(oklchString: string) {
    const match = oklchString.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/);
    if (!match) return oklchString;

    const [_, lRaw, cRaw, hRaw] = match;
    const l = parseFloat(lRaw) / 100;
    const c = parseFloat(cRaw);
    const hDeg = parseFloat(hRaw);
    const h = hDeg * Math.PI / 180;

    // OKLCH → OKLab
    const aComp = Math.cos(h) * c;
    const bComp = Math.sin(h) * c;

    // OKLab → Linear sRGB
    const L = l;
    const l_ = L + 0.3963377774 * aComp + 0.2158037573 * bComp;
    const m_ = L - 0.1055613458 * aComp - 0.0638541728 * bComp;
    const s_ = L - 0.0894841775 * aComp - 1.2914855480 * bComp;

    const l3 = l_ ** 3;
    const m3 = m_ ** 3;
    const s3 = s_ ** 3;

    let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    let b = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

    // Ограничиваем значения
    r = Math.max(0, Math.min(1, r));
    g = Math.max(0, Math.min(1, g));
    b = Math.max(0, Math.min(1, b));

    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, 1)`;
}