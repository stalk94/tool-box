
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