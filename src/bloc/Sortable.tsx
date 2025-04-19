import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import context, { infoState, renderState } from './context'; 
import { useHookstate } from '@hookstate/core';
import { Component } from './type';
import { getComponentById } from './utils/editor';

//! особые условия стилей для компонентов (!это костыли, вся логика в обертки идет)
class Styler {
    ref: Element
    styleWrapper: React.CSSProperties
    children: Component

    constructor(children, styleWrapper) {
        this.ref = document.querySelector(`[data-id="${children.props['data-id']}"]`);
        this.styleWrapper = styleWrapper;
        this.children = children;
        this.type = this.children.props['data-type'];
        this.init();
    }
    Typography() {
        this.ref.style.width = '100%'
    }
    init() {
        const childProps = this.children.props;

        if(childProps.style) {
            const style = childProps.style;
            
            if(childProps.fullWidth) {
                this.styleWrapper.display === 'block'
                this.styleWrapper.display = 'flex';
                this.styleWrapper.width = '100%';

                if(this.ref) {
                    if(this[this.type]) this[this.type]();
                    // что бы кнопка с иконками не ратекелась
                    this.ref.style.display = 'flex';
                }
            }
        }
    }
}


export function SortableItem({ id, children, ...props }: { id: number, children: Component }) {
    const itemRef = React.useRef<HTMLDivElement>(null);
    const [isLastInRow, setIsLastInRow] = React.useState(false);        // флаг то что элемент последний в строке
    const dragEnabled = useHookstate(context.dragEnabled);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
        id ,
        disabled: !dragEnabled.get()        // ✅ глобальный флаг
    });

    
    const styleWrapper: React.CSSProperties = {
        position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        width: children.props.fullWidth ? (children.props.width ?? '100%') : 'fit-content',
        display: 'inline-flex',
        verticalAlign: 'top',
        cursor: dragEnabled.get() ? 'grab' : 'default',
        // для отладки
        paddingTop: 3,
        paddingBottom: 3,
        borderRight: '1px dotted #8580806b',
        transformOrigin: 'center',
        scale: isDragging ? '0.95' : '1',
    }
    //ANCHOR - отслеживает ключевые свойства(маркеры) на компоненте и устанавливает на обертку спец стили
    const useSetStyleFromPropsComponent = () => {
        if(children?.props) {
            const childProps = children.props;

            const styler = new Styler(children, styleWrapper);
        }
        
        return styleWrapper;
    } 
    const handleClick = () => {
        // Ищем компонент в render по id
        const all = renderState.get({ noproxy: true });
        const found = all
            .flatMap(layer => layer.content ?? [])
            .find(comp => comp?.props?.['data-id'] === id);

        if (found) {
            infoState.select.content.set(found);

            // Визуально подсветим
            document.querySelectorAll('[data-id]').forEach(el => {
                el.classList.remove('editor-selected');
            });
            const el = document.querySelector(`[data-id="${id}"]`);
            if (el) el.classList.add('editor-selected');
        }
    }
    React.useEffect(() => {
        if (!itemRef.current) return;

        const update = () => {
            const parent = itemRef.current?.parentElement;
            if (!parent) return;

            const items = Array.from(parent.children) as HTMLElement[];

            // Найдём себя и проверим — последняя ли строка
            const self = itemRef.current;
            const selfTop = self.getBoundingClientRect().top;

            const lastInSameRow = items
                .filter((el) => el.getBoundingClientRect().top === selfTop)
                .pop();
            
            setIsLastInRow(lastInSameRow === self);
        };

        update();
        const resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(itemRef.current);

        return () => resizeObserver.disconnect();
    }, []);
    

    return (
        <div
            ref={(node) => {
                setNodeRef(node);
                itemRef.current = node;
            }}
            style={useSetStyleFromPropsComponent()}
            {...attributes}
            {...(dragEnabled.get() ? listeners : {})}
            onClick={handleClick} 
            onDoubleClick={()=> {
                const comp = getComponentById(id);
                EVENT.emit('leftBarChange', {
                    currentToolPanel: 'component',
                    curSubpanel: 'props',
                    curentComponent: comp
                });
            }}
            { ...props }
        >
            { children }
        </div>
    );
}