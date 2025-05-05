'use client'
import React from 'react';
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { consolidation } from '../../src/bloc/module-export';
import { RenderGridProps, DataRenderLayout, DataRenderGrid } from '../types/editor';
import Skeleton from '@mui/material/Skeleton';

const ResponsiveGridLayout = WidthProvider(Responsive);
const marginDefault: [number, number] = [5, 5];
type Props =
  | { data: DataRenderGrid; marginCell?: [number, number]; style?: React.CSSProperties; preview?: boolean; }
  | { scope: string; name: string; marginCell?: [number, number]; style?: React.CSSProperties; preview?: boolean; }



export default function (props: Props) {
    const blockRef = React.useRef<HTMLDivElement>(null);
    const [isLoad, setLoad] = React.useState(false);
    const [render, setRender] = React.useState<DataRenderLayout[]>([]);
    const [error, setError] = React.useState<string | null>(null);

    const marginCell = 'marginCell' in props ? props.marginCell : undefined;
  

    const load = async () => {
        setLoad(false);
        setError(null);

        try {
            if ('data' in props) {
                const { layout, content } = props.data;
                setRender(consolidation(layout, content));
                setLoad(true);
            }
            else {
                const res = await fetch(`/api/block/${props.scope}/${props.name}`);
                if (!res.ok) throw new Error('Блок не найден');
                const data: DataRenderGrid = await res.json();
                setRender(consolidation(data.layout, data.content));
                setLoad(true);
            }
        }
        catch (err) {
            console.error('Ошибка загрузки блока', err);
            setError('Ошибка загрузки блока');
        }
    }
    React.useEffect(() => {
        load();
    }, [JSON.stringify(props)]);


    return (
        <div
            ref={blockRef}
            style={{
                overflow: 'hidden',
                width: '100%',
                height: '100%',
                ...(props.preview ? {} : { border: `1px dashed #f2f2f237` }),
                ...props.style
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
                                ...(props.preview ? {} : { border: '1px dashed #87848437' })
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