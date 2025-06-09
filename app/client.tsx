'use client';

import React from 'react';
import Editor from '@bloc/App';
import { Provider } from 'react-redux';
import { store } from 'statekit-react';
import GridRender from './components/GridAdapter';


export default function EditorClient({ curBreacpoint, layouts, contentCells }) {
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        globalThis.EDITOR = true;
        setIsClient(true);
    }, []);
   
    
    if(isClient) return (
        <Provider store={store}>
            <Editor />
        </Provider>
    );
}


/** 
 *  return(
        <GridRender
            curBreacpoint={ curBreacpoint}
            layouts={layouts}
            contentCells={contentCells}
        />
    );
 */