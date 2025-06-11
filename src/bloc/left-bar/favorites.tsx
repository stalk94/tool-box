import React from "react";



export default function ({ category, setCategory, desserealize }) {
    const [blankComponents, setBlankComponents] = React.useState<React.JSX.Element[]>([]);

    React.useEffect(() => {
        if (category === 'blank') {
            (async () => {
                const value = await db.get('blank');
                const result = Object.keys(value || {}).map(key => desserealize(value[key]));
                setBlankComponents(result);
            })();
        }
    }, [category]);

    return (
        <>
            <div 
            {category === 'blank' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {blankComponents.map((el, i) => (
                        <div key={i} style={{ width: 80, height: 80, overflow: 'hidden', border: '1px solid #ccc' }}>
                            <div
                                style={{
                                    transform: `scale(0.2)`,
                                    transformOrigin: 'top left',
                                    width: `${100 / 0.2}%`,
                                    height: `${100 / 0.2}%`,
                                    pointerEvents: 'none',
                                }}
                            >
                                { el }
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}