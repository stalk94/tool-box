import React from 'react';
import { Divider, DividerProps } from '@mui/material';
import { ComponentProps } from '../type';
import { deserializeJSX } from '../utils/sanitize';



type DividerWrapperProps = DividerProps & ComponentProps;


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