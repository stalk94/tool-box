import React, {useState, useEffect} from 'react';
import Imgix from 'react-imgix';
import { useCellContext } from './utils/hooks';


//! на переделку
export const ImageWrapper = React.forwardRef((props: any, ref) => {
    const {
        src,
        alt = '',
        imgixParams = {},
        sizes = '100vw',
        objectFit = 'cover',
        style = {},
        ...otherProps
    } = props;

    const componentId = props['data-id'];
    const {
        cellRect,
        componentIndex,
        components,
    } = useCellContext(componentId);

    const [availableHeight, setAvailableHeight] = useState<number>(0);

    // 🔁 Следим за общей суммой высот через requestAnimationFrame
    useEffect(() => {
        if (!cellRect || componentIndex === null) return;

        let frameId: number;

        const observe = () => {
            let usedHeight = 0;

            components.forEach((comp, index) => {
                if (index === componentIndex) return;

                const id = comp?.props?.['data-id'];
                const el = document.querySelector(`[data-editor-id="${id}"]`) as HTMLElement;

                if (el) {
                    const height = el.offsetHeight;
                    usedHeight += height; // 📌 суммируем все высоты
                }
            });

            const resultHeight = Math.max(0, cellRect.height - usedHeight);

            setAvailableHeight(prev =>
                Math.abs(prev - resultHeight) > 1 ? resultHeight : prev
            );

            frameId = requestAnimationFrame(observe);
        };

        observe();

        return () => cancelAnimationFrame(frameId);
    }, [cellRect?.height, componentIndex, components.length]);

    const combinedStyle = {
        width: '100%',
        height: `${availableHeight}px`,
        objectFit,
        display: 'block',
        ...style,
    };

    return (
        <Imgix
            //ref={ref}
            data-type="Image"
            src={src}
            sizes={sizes}
            imgixParams={imgixParams}
            htmlAttributes={{
                alt,
                style: combinedStyle,
                ...otherProps
            }}
        />
    );
});