import { DomInspector } from '../index';
import React, { useState, useEffect } from 'react';
import { useControls, Leva } from 'leva';
import { useEditorContext, useRenderState, useCellsContent, useInfoState, useStorageContext } from "./context";
import { useHookstate } from '@hookstate/core';



export default function ({children}) {
    const [meta, setMeta] = React.useState({dataId:null, dataType:null});
    const refDataSelect = React.useRef(null); 
    const [selected, setSelected] = useState<HTMLElement | null>(null);
    const select = useHookstate(useInfoState().select);


    const [, set] = useControls(() => {

        return {

        }
    }, [meta]);



    useEffect(() => {
        const content = select.content.get({ noproxy: true });

        if (React.isValidElement(content)) {
            const props = structuredClone(content.props);
           
            setMeta({
                dataId: props?.['data-id'],
                dataType: props?.['data-type']
            });

            delete props['data-id'];
            delete props?.['data-type'];
            
            refDataSelect.current = props
        }
    }, [select.content]);
    
    return (
        <>
            <Leva collapsed={false} />
            <div
                style={{width: '80%', height: '100%', display: 'flex', flexDirection: 'column'}}
            >
                { children }
            </div>
        </>
    );
}