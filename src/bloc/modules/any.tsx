import React from 'react';
import { Divider, DividerProps, Box } from '@mui/material';
import { ComponentProps } from '../type';
import { deserializeJSX } from '../utils/sanitize';
import { updateComponentProps } from '../utils/updateComponentProps';
import { renderComponentSsr, renderComponentSsrPrerender } from './export/utils';


type DividerWrapperProps = DividerProps & ComponentProps;



export const DividerWrapper = React.forwardRef((props: DividerWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const { 'data-id': dataId, children, fullWidth, orientation, variant, ...otherProps } = props;
    const parsedChild = React.useMemo(() => deserializeJSX(children), [children]);

    degidratationRef.current = (call) => {
        const code = (`
            import React from 'react';
            import { Divider } from '@mui/material';

            export default function DividerWrap() {
                return(
                    <Divider
                        flexItem
                        orientation={"${orientation??'horizontal'}"}
                        variant={"${variant ?? 'fullWidth'}"}
                    >
                        ${ renderComponentSsr(parsedChild) }
                    </Divider>
                );
            }
        `);

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);


    return (
        <Divider
            ref={ref}
            data-id={dataId}
            data-type='Divider'
            orientation={orientation}
            variant={variant}
            flexItem
            {...otherProps}
        >
            { parsedChild }
        </Divider>
    );
});

