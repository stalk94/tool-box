'use client'
import React from 'react';
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { consolidation } from '../../src/bloc/module-export';
import { RenderGridProps, DataRenderLayout, DataRenderGrid } from '../types/editor';
import Skeleton from '@mui/material/Skeleton';

const ResponsiveGridLayout = WidthProvider(Responsive);
const marginDefault: [number, number] = [5, 5];



export default function ({ scope, name, marginCell }: RenderGridProps) {
    const blockRef = React.useRef<HTMLDivElement>(null);
    const [isLoad, setLoad] = React.useState(false);
    const [render, setRender] = React.useState<DataRenderLayout[]>([]);
    const [error, setError] = React.useState<string | null>(null);


    async function fetchBlock(scope: string, name: string): Promise<DataRenderGrid> {
        const res = await fetch(`/api/block/${scope}/${name}`);
        if (!res.ok) throw new Error('Блок не найден');
        return await res.json();
    }
    React.useEffect(() => {
        if (scope && name) {
            setLoad(false);
            setError(null);

            fetchBlock(scope, name)
                .then((data) => {
                    if (data.layout) {
                        setRender(consolidation(data.layout, data.content));
                        setLoad(true);
                    } 
                    else {
                        setError('Пустой блок');
                    }
                })
                .catch((err) => {
                    console.error('Ошибка загрузки блока', err);
                    setError('Ошибка загрузки блока');
                });
        }
    }, [scope, name]);


    return (
        <div
            ref={blockRef}
            style={{
                overflow: 'hidden',
                width: '100%',
                height: '100%',
                border: `1px dashed #f2f2f237`,
            }}
        >
            { error ? (
                <div style={{ color: 'red', padding: '1rem' }}>
                    ⚠️ { error }
                </div>
            ) : isLoad ? (
                <ResponsiveGridLayout
                    className="GRID-BLOCK"
                    layouts={{ lg: render }}
                    breakpoints={{ lg: 1200 }}
                    cols={{ lg: 12 }}
                    rowHeight={30}
                    compactType={null}
                    preventCollision={true}
                    isDraggable={false}
                    isResizable={false}
                    margin={marginCell ?? marginDefault}
                    containerPadding={[0, 0]}
                >
                    { render?.map((layer) => (
                        <div
                            key={layer.i}
                            data-id={layer.i}
                            style={{
                                overflowX: 'hidden',
                                overflowY: 'auto',
                                border: `1px dashed #87848437`,
                            }}
                        >
                            { Array.isArray(layer.content) &&
                                layer.content.map((component, index) => (
                                    <div key={`${layer.i}-${index}`}>
                                        { component }
                                    </div>
                                ))
                            }
                        </div>
                    ))}
                </ResponsiveGridLayout>
            ) : (
                <div style={{ padding: 10 }}>
                    <Skeleton variant="rectangular" width="100%" height={100} />
                    <Skeleton variant="rectangular" width="100%" height={80} style={{ marginTop: 10 }} />
                    <Skeleton variant="rectangular" width="100%" height={120} style={{ marginTop: 10 }} />
                </div>
            )}
        </div>
    );
}