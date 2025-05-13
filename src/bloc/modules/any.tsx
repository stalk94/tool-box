import React from 'react';
import { Divider, DividerProps, Box } from '@mui/material';
import { ComponentProps } from '../type';
import { deserializeJSX } from '../utils/sanitize';
import { LinearNavigation, MobailBurger } from '../../index';
import { updateComponentProps } from '../utils/updateComponentProps';
import { uploadFile } from 'src/app/plugins';



type LinearWrapperProps = {
    'data-id': string
    style: React.CSSProperties
    linkItems: {
        id: string
        label?: string
        icon?: React.ReactNode
        /** 🔥 кастомный параметр подсветит элемент как выбранный */
        select?: any
        comand?: (item: any) => void
        divider?: React.ReactNode | boolean
    }[]
}
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


export const LinearNavigationWrapper = React.forwardRef((props: LinearWrapperProps, ref) => {
    const { 
        ['data-id']: dataId, 
        style,
        linkItems,
        ...otherProps 
    } = props;

    const componentId = props['data-id'];
    const handlerClickNavigation =(path: 'string')=> {
        console.log(path);
    }
    // ANCHOR - трансформатор id в rout
    const transformUseRouter =()=> {
        const func =(items, parent?: string)=> {
            return items.map((elem, index)=> {
                if(!parent) elem.path = '/' + elem.id;
                else elem.path = parent + '/' + elem.id;
    
                elem.comand =()=> handlerClickNavigation(elem.path);
    
                if(elem.children) {
                    func(elem.children, elem.path);
                }
    
                return elem;
            });
        }
    
        const result = func(linkItems ?? []);
        return result;
    }


    return (
        <LinearNavigation
            sx={{
                justifyContent: 'flex-end',
                mr: 2
            }}
            items={transformUseRouter()}
        />
    );
});

