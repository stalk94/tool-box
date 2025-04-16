import React from "react";
import html2canvas from 'html2canvas';
import { LayoutCustom, ComponentSerrialize, Component } from './type';
import "react-grid-layout/css/styles.css";
import context, { cellsContent, infoState, renderState } from './context';
import { hookstate, useHookstate } from "@hookstate/core";
import { ToolBarInfo } from './Top-bar';
import { componentMap } from './modules/utils/registry';
import Tools from './Left-bar';
import GridComponentEditor from './Editor-grid';
import { writeFile } from "../app/plugins";
import GridEditor from '../components/tools/grid-editor';
//import "../style/grid.css";
import "../style/edit.css";
import './modules/index';


// это редактор блоков сетки
export default function ({ height, setHeight }) {
    const mod = useHookstate(context.mod);
    const refs = React.useRef({});                                   // список всех рефов на все компоненты
    const render = useHookstate(renderState);
    const info = useHookstate(infoState);                             // данные по выделенным обьектам
    const curCell = useHookstate(context.currentCell);                // текушая выбранная ячейка
    const cellsCache = useHookstate(cellsContent);                    // элементы в ячейках (dump из localStorage)
    //context.dragEnabled.set(true)
   
    const dumpRender = (name: string) => {
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
                const findRenderLayot = render.get({ noproxy: true }).find(l => l.i === idLayout);
                
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

        html2canvas(gridContainer, { scrollY: -window.scrollY })
            .then((canvas)=> {
                return canvas.toDataURL();
            })
            .then((v) => {
                const filename = `screenshot_${meta.name}.png`;
                meta.screen = '/db/editor/screen/' + filename;
                const content = v;

                writeFile(
                    '/db/editor/screen',
                    filename,
                    content,
                    { image: true }
                ).then(() => {
                    writeFile(
                        '/db/editor',
                        `${meta.name + '.json'}`,
                        JSON.stringify(meta, null, 2)
                    ).then(console.log)
                });
            });
    }
    const desserealize = (component: ComponentSerrialize) => {
        const { id, props, parent } = component;
        const type = props["data-type"];
        const Component = componentMap[type];
        
    
        if (!Component) {
            console.warn(`Компонент типа "${type}" не найден в реестре`);
            return null;
        }
    
        return (
            <Component
                {...props}
                ref={(el) => {
                    if (el) refs.current[id] = el;
                }}
            />
        );
    }
    // вызывается только при добавлении нового сонтента 
    const serrialize = (component: Component, cellId: string): ComponentSerrialize => {
        const props = { ...component.props };
    
        const id = Date.now();
        const type = props["data-type"];
        delete props.ref;
    
        return {
            id,
            parent: cellId,
            //offset,
            props: {
                ...props,
                'data-id': id,
                'data-type': type,
                //'data-offset': offset
            }
        };
    }
    const addComponentToCell = (cellId: string, component: Component) => {
        render.set((prev) => {
            const updatedRender = [...prev];
            const cellIndex = updatedRender.findIndex(item => item.i === cellId);

            if (cellIndex !== -1) {
                const cell = updatedRender[cellIndex];
                if(!Array.isArray(cell.content)) cell.content = [];
                const serialized = serrialize(component, cellId);

                const clone = React.cloneElement(component, 
                    { 
                        'data-id': serialized.id,
                        ref: (el)=> {
                            if(el) refs.current[serialized.id] = el;
                        }
                    }
                );
                cell.content.push(clone);

                cellsCache.set((old)=> {
                    if(!old[cellId]) old[cellId] = [serialized];
                    else old[cellId].push(serialized);
        
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
                useDump={dumpRender}
                externalPanelTrigger={(cb) => {
                    // 💡 новый трюк
                    window.triggerLeftPanel = cb;
                }}
            />
            <div style={{width: '80%', height: '100%', display: 'flex', flexDirection: 'column'}}>

                <ToolBarInfo />

                { mod.get() === 'home' &&
                    <GridComponentEditor
                        desserealize={desserealize}
                        height={height}
                    />
                }
                { mod.get() === 'grid' &&
                    <GridEditor components={[]} />
                }
            </div>
        </div>
    );
}



/**
 *  // добавить/изменить пропс (применится везде/сохранится)
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
 */
/**
 *  const desserealize =(component: ComponentSerrialize)=> {
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
 */
/**
 * const serrialize =(component: React.ReactNode, cellId: string)=> {
        if(component.props.children && typeof component.props.children === 'object') {
            console.warn('children object included in component: ', component.props.children);
        }

        const serlz = JSON.stringify(component, null, 2);
        const rslz = JSON.parse(serlz);
        rslz.id = Date.now();
        rslz.parent = cellId;

        return rslz;
    }
 */