'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DataRenderPage } from '../../types/page';
import { DataRenderGrid } from '../../types/editor';


interface EditorContextType {
    list: string[]
    setList: (names: string[]) => void;

    curentPageName: string | null;
    setPageName: (name: string | null) => void;
   
    curentPageData: DataRenderPage
    setPageData: (data: DataRenderPage) => void

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
}
const EditorContext = createContext<EditorContextType | undefined>(undefined);



export const EditorProvider = ({ children }: { children: ReactNode }) => {
    const [list, setList] = React.useState<string[]>([]);
    const [curBreacpoint, setCurBreacpoint] = React.useState<'lg' | 'md' | 'sm' | 'xs'>('lg');
    const [currentToolPanel, setCurrentToolPanel] = React.useState<'catalog' | 'blocs' >('catalog');
    const [curentPageName, setPageName] = React.useState<string>('home');
    const [curentPageData, setPageData] = React.useState<DataRenderPage>();
    const [curentScope, setCurentScope] = React.useState<string>();
    const [curentScopeBlockData, setScopeBlockData] = React.useState();
    const [selectBlockData, setSelectBlockData] = React.useState<DataRenderGrid>();


    return (
        <EditorContext.Provider 
            value={{ 
                list,
                setList,
                curentPageName, 
                setPageName, 
                curentPageData, 
                setPageData,
                curBreacpoint, 
                setCurBreacpoint,
                currentToolPanel, 
                setCurrentToolPanel,
                curentScope, 
                setCurentScope,
                curentScopeBlockData, 
                setScopeBlockData,
                selectBlockData, 
                setSelectBlockData
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