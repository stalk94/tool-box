'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DataRenderPage } from '../../types/page';
import { DataRenderGrid } from '../../types/editor';


interface EditorContextType {
    zoom: number
    setZoom: (v: number)=> void

    list: string[]
    setList: (names: string[]) => void;

    curentPageName: string | null;
    setPageName: (name: string | null) => void;
   
    curentPageData: DataRenderPage
    setCurrentPageData: (data: any) => void

    curBreacpoint: 'lg' | 'md' | 'sm' | 'xs'
    setCurBreacpoint: (v: 'lg' | 'md' | 'sm' | 'xs') => void

    currentToolPanel: 'catalog' | 'blocs'
    setCurrentToolPanel: (v: 'catalog' | 'blocs') => void

    curentScope: string
    setCurentScope: (scope: string)=> void
    
    curentScopeBlockData: {name: string, data: DataRenderGrid}[]
    setScopeBlockData: (arrayDataScope: {name: string, data: DataRenderGrid}[])=> void

    selectBlockData: DataRenderGrid
    setSelectBlockData: (data: DataRenderGrid)=> void

    selectedBlock: any 
    setSelectedBlock: (v: any)=> void
}
const EditorContext = createContext<EditorContextType | undefined>(undefined);



export const EditorProvider = ({ children }: { children: ReactNode }) => {
    const [zoom, setZoom] = useState(1);
    const [list, setList] = React.useState<string[]>([]);
    const [curBreacpoint, setCurBreacpoint] = React.useState<'lg' | 'md' | 'sm' | 'xs'>('lg');
    const [currentToolPanel, setCurrentToolPanel] = React.useState<'catalog' | 'blocs' >('catalog');
    const [curentPageName, setPageName] = React.useState<string>('home');
    const [curentPageData, setCurrentPageData] = React.useState<DataRenderPage>();
    const [curentScope, setCurentScope] = React.useState<string>();
    const [curentScopeBlockData, setScopeBlockData] = React.useState();
    const [selectBlockData, setSelectBlockData] = React.useState<DataRenderGrid>();
    const [selectedBlock, setSelectedBlock] = React.useState<any>();


    const save = React.useCallback(() => {
        if (typeof window !== 'undefined') {
            const data = {
                curBreacpoint,
                zoom,
                currentToolPanel,
            };
            localStorage.setItem('PAGE_EDITOR', JSON.stringify(data));
        }
    }, [curBreacpoint, zoom, currentToolPanel]);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const storageRaw = localStorage.getItem('PAGE_EDITOR');

                if (storageRaw) {
                    const storage = JSON.parse(storageRaw);

                    const savedZoom = storage?.zoom ?? 1;
                    const savedBreakpoint = storage?.curBreacpoint ?? 'lg';
                    const savedToolPanel = storage?.currentToolPanel ?? 'catalog';

                    setZoom(parseFloat(savedZoom));
                    setCurBreacpoint(savedBreakpoint);
                    setCurrentToolPanel(savedToolPanel);
                }
            } catch (err) {
                console.error('Ошибка чтения PAGE_EDITOR из localStorage', err);
            }
        }
    }, []);
    useEffect(() => {
        save();
    }, [save]);


    return (
        <EditorContext.Provider 
            value={{ 
                zoom, 
                setZoom,
                list,
                setList,
                curentPageName, 
                setPageName, 
                curentPageData, 
                setCurrentPageData,
                curBreacpoint, 
                setCurBreacpoint,
                currentToolPanel, 
                setCurrentToolPanel,
                curentScope, 
                setCurentScope,
                curentScopeBlockData, 
                setScopeBlockData,
                selectBlockData, 
                setSelectBlockData,
                selectedBlock, 
                setSelectedBlock
            }}
        >
            { children }
        </EditorContext.Provider>
    );
}


export const useEditor = (): EditorContextType => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
}