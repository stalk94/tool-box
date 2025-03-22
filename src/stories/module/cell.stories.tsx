import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { alpha, darken, lighten, Avatar, Button, CardActionArea, CardActions, CardHeader, CardMedia, IconButton, Typography, useTheme, Grid2 } from '@mui/material';
import Card from '../../components/carts/base';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Toolbar, ToolbarCell } from '../../components/tools/grid-editor'


const meta: Meta<typeof Card> = {
    title: 'Module',
    component: Card,
}

export default meta;

const initialGridSchema1 = {
    type: "root",
    direction: "horizontal", // Направление разделителя
    children: [
        {
            type: "splitter",
            direction: "horizontal",
            id: "splitter-1",
            size: 80,
            children: [
                
                {
                    type: "panel",
                    id: "panel-1",
                    size: 20,
                    content: "PANEL 1",
                },
                {
                    type: "panel",
                    id: "panel-10",
                    size: 20,
                    content: "PANEL 10",
                },
                {
                    type: "panel",
                    id: "panel-11",
                    size: 20,
                    content: "PANEL 10",
                }
            ]
        },
        {
            type: "splitter",
            direction: "vertical",
            id: "splitter-2",
            size: 80,
            children: [
                {
                    type: "panel",
                    id: "panel-2",
                    size: 15,
                    content: "PANEL 2",
                },
                {
                    type: "panel",
                    id: "panel-10",
                    size: 20,
                    content: "PANEL 10",
                }
            ],
        },
    ],
};


const GridEditor = ({ initialGridSchema }) => {
    window.i = window.i || 0;
    const [current, setCurrent] = React.useState();
    const [gridSchema, setGridSchema] = React.useState(initialGridSchema);


    const addPanel = (type) => {
        setGridSchema((prev) => {
            const newPanel = {
                type: "panel",
                id: `panel-${Date.now()}`,
                size: 25,
                content: `New Panel ${window.i++}`,
            };

            const addToParent = (nodes) => {
                if(nodes?.map) return nodes.map((node) => {
                    if (node.type === "splitter" && node.direction === type) {
                        return { ...node, children: [...node.children, newPanel] };
                    }
                    else return node;
                });

                else return nodes;
            };

            prev.children = addToParent(prev.children);
            console.log(prev.children)
            return { ...prev };
        });
    }
    const renderGrid = (schema) => {
        const style = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dotted gray",
        }
        
        if (schema.type === "root") {
            return (
                <Splitter
                    key={`splitter-${schema.direction}-${Date.now()}`}
                    layout={schema.direction}
                    style={{border:'1px dotted gray', flexGrow:1}}
                >
                    <SplitterPanel
                        onClick={()=> setCurrent(schema.id)}
                        key={schema.id}
                        { ...style }
                    >
                        { schema.children.map((child)=> 
                            renderGrid(child)
                        )}
                    </SplitterPanel>
                </Splitter>
            );
        }
        else if (schema.type === "panel") {
            return (
                <SplitterPanel 
                    onClick={()=> setCurrent(schema.id)}
                    key={schema.id}
                    size={schema.size}
                    style={{ 
                        ...style,
                        backgroundColor: current === schema.id ? "#ed444452" : "none",
                    }}
                >
                    { schema.content }
                </SplitterPanel>
            );
        }
        else if (schema.type === "splitter") {
            return (
                <Splitter
                    key={`splitter-${schema.direction}-${Date.now()}`}
                    layout={schema.direction}
                    style={{border:'1px dotted gray',flexGrow:1}}
                >
                    { schema.children.map((child)=> 
                        renderGrid(child)
                    )}
                </Splitter>
            );
        }
    
        return null;
    }


    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "5px",
                }}
            >
                <Toolbar 
                    useAdd={addPanel} 
                    useUndo={console.log} 
                    disabled={false} 
                />
                <ToolbarCell 
                    disabled={false}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column"
                }}
            >
            { renderGrid(gridSchema) }
            { renderGrid(gridSchema) }
            </div>
        </div>
    );
}


const Templates =(args)=> {
    
    return(
        <div style={{
            padding:'1%',
            height:'100%',
            width:'100%',
            display:'flex',
            flexDirection:'row'
        }}
        >
            <GridEditor initialGridSchema={initialGridSchema1}/>
        </div>
    );
}



export const Grid: StoryObj<typeof Card> = {
    args: {
        
    },
    render: Templates
}