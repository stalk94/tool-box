import React from 'react';
import { Accordion, AccordionProps } from '../../index';
import { Divider, DividerProps, Box } from '@mui/material';
import { ComponentProps } from '../type';
import { deserializeJSX } from '../utils/sanitize';


/**
 * Нужно: Tabs, BottomNavigation, SpeedDial
 * Rating в инпуты!
 */
type DividerWrapperProps = DividerProps & ComponentProps;
type AccordionWrapperProps = AccordionProps & ComponentProps;


export const DividerWrapper = React.forwardRef((props: DividerWrapperProps, ref) => {
    const { ['data-id']: dataId, children, fullWidth, ...otherProps } = props;
    const parsedChild = React.useMemo(() => deserializeJSX(children), [children]);


    return (
        <Divider
            ref={ref}
            data-id={dataId}
            data-type='Divider'
            {...otherProps}
        >
            { parsedChild }
        </Divider>
    );
});

export const AccordionWrapper = React.forwardRef((props: AccordionWrapperProps, ref) => {
    const { ['data-id']: dataId, style, items, tabStyle, activeIndexs, fullWidth, ...otherProps } = props;
    
    // добавить элементы
    const parse =()=> {
        const maps = {
            Box: Box
        }

        return items.map((item) => ({
            title: deserializeJSX(item.title, maps),
            content: deserializeJSX(item.content, maps),
        }));
    }
    const parsedItems = React.useMemo(() => parse(), [items]);


    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='Accordion'
            style={{ ...style, width: '100%', display: 'block' }}
            { ...otherProps }
        >
            <Accordion
                activeIndexs={activeIndexs}
                tabStyle={tabStyle}
                items={parsedItems}
            />
        </div>
    );
});

