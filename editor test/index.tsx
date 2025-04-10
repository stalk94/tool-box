import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { createRoot } from 'react-dom/client';
import { useEditor } from '@craftjs/core';
import { Editor, Frame, Element } from '@craftjs/core';
import { ButtonComponent } from './b';
import { TypographyComponent } from './t';
import PageFromJson, { craftToSimpleJson } from './render';



const Toolbox = ({ useSetJson, onAdd }) => {
    const { connectors } = useEditor();
    const { query } = useEditor();
   

    return (
        <div style={{ padding: 10, borderRight: '1px solid #ddd' }}>
            <Button 
                onClick={()=> {
                    console.log(JSON.parse(query.serialize()));
                    const simplified = craftToSimpleJson(query.serialize());
                    useSetJson(simplified);
                }}
            >
                save
            </Button>
            <div
                ref={(ref) => ref && connectors.create(ref, <ButtonComponent />)}
                style={{
                    padding: '5px',
                    border: '1px solid #ccc',
                    cursor: 'grab',
                    background: '#fff',
                }}
            >
                ➕ MUI Butto
            </div>
            <div
                ref={ref => ref && connectors.create(ref, <TypographyComponent />)}
                style={{
                    padding: '5px',
                    border: '1px solid #ccc',
                    cursor: 'grab',
                    background: '#fff',
                }}
            >
                ➕ MUI Typography
            </div>
        </div>
    );
}


function App() {
    const [components, setComponents] = React.useState([]);
    const [json, setJson] = React.useState();
    
    
    return (
        <>
            <PageFromJson json={json} toCode={true} />
            <Editor resolver={{ ButtonComponent, TypographyComponent }}>
                <div style={{ display: 'flex', height: '100vh',width:'100vw' }}>
                    <Toolbox 
                        useSetJson={setJson} 
                        onAdd={(elem)=> setComponents([...components, elem])}
                    />
                    <Box sx={{ 
                            flex: 1, 
                            padding: 1, 
                            background: '#ffffff38', 
                            //position: "relative"
                        }}
                    >
                        <Frame>
                            <Element 
                                is="div" 
                                canvas 
                                style={{ padding: 2, border: '1px solid red' }}
                            >
                                { components }
                            </Element>
                        </Frame>
                    </Box>
                </div>
            </Editor>
        </>
    );
}


createRoot(document.querySelector(".root")).render(<App/>);