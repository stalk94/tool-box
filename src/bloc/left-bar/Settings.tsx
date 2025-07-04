import React from "react";
import { ThemeProvider, createTheme, Palette, Theme, Button, Avatar, Rating, useTheme, Divider, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import PreviewTheme from './Preview-theme';
import { OrganizationChart } from 'primereact/organizationchart';
import { settingsSlice } from "../context";
import { ProjectConfig, RenderPageData } from '../type';
import { db } from "../helpers/export";



export default function Settings({ mod }) {
    const baseCtx = settingsSlice.base.use();
    const [data, setData] = React.useState([{ expanded: true, label: 'home' }]);
   

    const nodeTemplate = (node) => {
        if (true) {
            return (
                <div
                    style={{
                        border: '1px solid #ccc',
                        padding: '8 16',
                        borderRadius: 2
                    }}
                >
                    <div 
                        style={{
                            fontSize: 12
                        }}
                    >
                        { node.label }
                    </div>
                    <div className="node-content">
                        <div>
                            { node?.data?.name }
                        </div>
                    </div>
                </div>
            );
        }

        return node.label;
    }
    const parse = () => {
        db.get('configs').then((configs) => {
            const children = [];
            const result = [{ expanded: true, label: 'home', children: children }];
            const current = configs[baseCtx.select];
            const pages = current?.pages ?? {
                page1: { meta: { path: 'home/about' }, name: 'About' },
                page2: { meta: { path: 'home/about/team' }, name: 'Team' },
                page3: { meta: { path: 'home/contact' }, name: 'Contact' },
                page4: { meta: { path: 'home/contact/a/b' }, name: 'Contact' },
                page5: { meta: { path: 'home/contact/b/b' }, name: 'Contact' }
            };

            for (const [key, data] of Object.entries(pages)) {
                const path = data.meta?.path;
                if (!path) continue;

                const parts = path.split('/').filter(Boolean);
                let level = children;

                for (let i = 0; i < parts.length; i++) {
                    const label = parts[i];
                    if (label === 'home') continue;

                    let node = level.find((item) => item.label === label);
                    if (!node) {
                        node = {
                            label,
                            expanded: true,
                            children: [],
                            data: i === parts.length - 1
                                ? { ...data.meta }
                                : undefined,
                        };
                        level.push(node);
                    }

                    level = node.children!;
                }
            }

            setData(result);
        });
    }
    React.useEffect(() => {
        parse();
    }, [baseCtx]);
    
    

    return (
        <div
            style={{
                overflowY: 'hidden',
                marginTop: '65px',
                boxSizing: 'content-box'
            }}
        >
            {mod === 'theme' && 
                <PreviewTheme />
            }
            {mod === 'base' && 
                <div style={{height:'100%'}}>
                    <OrganizationChart
                        nodeTemplate={nodeTemplate}
                        value={data}
                    />
                </div>
            }
        </div>
    );
}