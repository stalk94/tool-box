import React from "react";
import html2canvas from 'html2canvas';
import { LayoutCustom, ComponentSerrialize, ContentFromCell } from './type';
import "react-grid-layout/css/styles.css";
import context, { cellsContent, infoState } from './context';
import { hookstate, useHookstate } from "@hookstate/core";
import { ToolBarInfo } from './Top-bar';
import { listAllComponents, listConfig } from './config/render';
import Tools from './Left-bar';
import GridComponentEditor from './Editor-grid';
import { writeFile } from "../app/plugins";
import "../style/grid.css";
import "../style/edit.css";


// это редактор блоков сетки
export default function ({ height }) {
    const refs = React.useRef({});                                   // список всех рефов на все компоненты
    const [render, setRender] = React.useState<LayoutCustom []>([]);
    const info = useHookstate(infoState);                             // данные по выделенным обьектам
    const curCell = useHookstate(context.currentCell);                // текушая выбранная ячейка
    const cellsCache = useHookstate(cellsContent);                    // элементы в ячейках (dump из localStorage)
    
    
    const makePrewiew = async(elem: HTMLElement) => {
        const canvas = await html2canvas(elem, { useCORS: true, scrollY: -window.scrollY });
        return canvas.toDataURL();
    }
    const dumpRender =(name: string)=> {
        const gridContainer: HTMLDivElement = document.querySelector('.GRID-EDITOR');
        const children = Array.from(gridContainer.children);
        const cache = cellsCache.get({ noproxy: true });
         
        const meta = {
            name: name ?? Date.now(),
            data: new Date().toJSON(),
            screen: undefined,
            container: {
                width: info.container.width.get(),
                height: info.container.height.get()
            },
            layers: []
        }
        
        
        Object.keys(cache).map((idLayout)=> {
            const found = children.find(el => el.getAttribute('data-id') === idLayout);
            
            if(found) {
                const cacheLayout = cache[idLayout];
                const bound = found.getBoundingClientRect();
                const findLayout = context.layout.get().find((l)=> l.i === idLayout);
                const findRenderLayot = render.find(l => l.i === idLayout);
                
                meta.layers.push({
                    ...findRenderLayot,
                    name: findLayout?.content,
                    size: {
                        width: bound.width,
                        height: bound.height,
                    },
                    content: cacheLayout
                });
            }
        });

        makePrewiew(gridContainer).then((v)=> {
            const filename = `screenshot_${meta.name}.png`;
            meta.screen = '/db/editor/screen/'+filename;
            const content = v;

            writeFile(
                '/db/editor/screen', 
                filename,
                content,
                { image: true }
            ).then(()=> {
                writeFile(
                    '/db/editor', 
                    `${meta.name+'.json'}`, 
                    JSON.stringify(meta, null, 2)
                ).then(console.log)
            });
        });
    }
    // добавить/изменить пропс (применится везде/сохранится)
    const editRenderComponentProps =(component: ContentFromCell, data: Record<string, any>)=> {
        const cellId = curCell.get()?.i;
        const curCache = cellsCache.get({ noproxy: true });
        const clone = React.cloneElement(component, data);
        const id = clone.props['data-id'];

        if (curCache[cellId]) {
            const findIndex = curCache[cellId].findIndex(e => e.id === id);
            if(findIndex !== -1) {
                cellsCache.set((old)=> {
                    Object.keys(data).map((dataKey)=> {
                        const props = old[cellId][findIndex].props;
                        if(props) props[dataKey] = data[dataKey];
                    });
                    
                    return old;
                });
            }
        }
        // перерендер
        setRender((layers)=> {
            const newLayers = layers.map((layer)=> {
                if(Array.isArray(layer.content)) {
                    const findindex = layer.content.findIndex(c => c.props['data-id'] === id);
                    if(findindex !== -1) layer.content[findindex] = clone;
                }

                return layer;
            });

            return [...newLayers];
        });
    }
    const serrialize =(component: React.ReactNode, cellId: string)=> {
        if(component.props.children && typeof component.props.children === 'object') {
            console.warn('children object included in component: ', component.props.children);
        }

        const serlz = JSON.stringify(component, null, 2);
        const rslz = JSON.parse(serlz);
        rslz.id = Date.now();
        rslz.parent = cellId;

        return rslz;
    }
    const desserealize =(component: ComponentSerrialize)=> {
        const type = component.props["data-type"];
        if(component.props.children && typeof component.props.children === 'object') {
            component.props.children = '';
        }

        const Consolid = listAllComponents[type];
        

        if(Consolid) return (
            <Consolid 
                data-offset={component.offset}
                data-id={component.id}
                ref={(el) => {
                    if (el) refs.current[component.id] = el;
                }}
                { ...component.props } 
            />
        );
    }
    const addComponentToCell = (cellId: string, component: React.ReactNode) => {
        setRender((prev) => {
            const updatedRender = [...prev];
            const cellIndex = updatedRender.findIndex(item => item.i === cellId);

            if (cellIndex !== -1) {
                const cell = updatedRender[cellIndex];
                if(!Array.isArray(cell.content)) cell.content = [];


                const rsrlz = serrialize(component, cellId);
                const clone = React.cloneElement(component, 
                    { 
                        'data-id': rsrlz.id,
                        ref: (el)=> {
                            if(el) refs.current[rsrlz.id] = el;
                        }
                    }
                );
                cell.content.push(clone);

                cellsCache.set((old)=> {
                    if(!old[cellId]) old[cellId] = [rsrlz];
                    else old[cellId].push(rsrlz);
        
                    return old;
                });
            }
            return updatedRender;
        });
    }
    
    
    return(
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
            <Tools
                addComponentToLayout={(elem)=> {
                    if(curCell.get()?.i) addComponentToCell(curCell.get().i, elem);
                }}
                useEditProps={editRenderComponentProps}
                useDump={dumpRender}
            />
            <div style={{width: '80%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                <ToolBarInfo 
                    render={render}
                    useEditProps={editRenderComponentProps}
                />
                {/* область редактора сетки */}
                <GridComponentEditor
                    render={render}
                    setRender={setRender}
                    desserealize={desserealize}
                    height={height}
                />
            </div>
        </div>
    );
}