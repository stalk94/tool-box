'use client'
import React from 'react';
import { useEditor } from './context';
import { DataRenderPage } from '../../types/page';
import LeftTools from './LeftTools';
import TopBar from './TopBar';
import WorkArea from './WorkArea';



export default function PageEditor({ listsPages, setShowBlocEditor }: { listsPages: string[], setShowBlocEditor: (v: boolean) => void }) {
    const {
        zoom,
        curentScope,
        curentScopeBlockData,
        setScopeBlockData,
        setList,
        curentPageName,
        curentPageData,
        setCurrentPageData
    } = useEditor();


    const pagaDump = async () => {
        if (!curentPageName || !curentPageData) {
            console.warn('Нет данных для сохранения страницы');
            return;
        }

        try {
            const response = await fetch(`/api/pages/${curentPageName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(curentPageData),
            });

            if (!response.ok) {
                throw new Error(`Ошибка при сохранении страницы: ${response.statusText}`);
            }

            console.log('✅ Страница успешно сохранена');
        }
        catch (error) {
            console.error('❌ Ошибка при сохранении страницы:', error);
        }
    }
    async function fetchPage(name: string): Promise<DataRenderPage> {
        const res = await fetch(`/api/pages/${name}`);
        if (!res.ok) throw new Error('page не найден');
        return await res.json();
    }

    // ? Внимание глобальная переменная
    React.useEffect(() => {
        globalThis.ZOOM = zoom;
    }, [zoom]);
    React.useEffect(() => {
        if (curentPageName) {
            globalThis.EDITOR = false;

            fetchPage(curentPageName)
                .then(setCurrentPageData)
                .catch(console.error)
        }
    }, [curentPageName]);
    React.useEffect(() => {
        if (curentScope) {
            fetch(`/api/block/${curentScope}`)
                .then((res) => res.json())
                .then((data) => {
                    if (!data.error) setScopeBlockData(data);
                    else console.error(data.error);
                })
                .catch(console.error)
        }
    }, [curentScope]);
    React.useEffect(() => {
        setList(listsPages);
    }, []);
    

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
            <LeftTools
                useDump={pagaDump}
                addPage={console.log}
            />
            <div style={{ width: '80%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <TopBar
                    setShowBlocEditor={setShowBlocEditor}
                />
                { curentPageData && <WorkArea /> }
            </div>
        </div>
    );
}