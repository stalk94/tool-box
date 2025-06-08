import React from 'react';
import { Modal } from '../../index';
import DataTable, { SupabaseAuthData } from './sources/storage';
import FormConnected from './sources/ConfigForm';
import { useComponentSizeWithSiblings } from './helpers/hooks';
import { ComponentProps } from '../type';
import { exportedTable } from './export/bloks';
import { updateComponentProps } from '../helpers/updateComponentProps';
import { testSupabaseConnection } from './sources/providers';

///////////////////////////////////////////////////////////////////////////////
type TableSourcesProps = ComponentProps & {
    fullWidth: boolean
    style: React.CSSProperties
    header: string 
    sourceType: 'json' | 'supabase' | 'google' | 'json-url'
    source?: string | [] | undefined
    config?: SupabaseAuthData
    styles: {
        body: React.CSSProperties & {
            background: string
            borderColor: string
            textColor: string
        }
        header: React.CSSProperties & {
            background: string
        }
        thead: React.CSSProperties & {
            background: string
            textColor: string
        }
    }
}
///////////////////////////////////////////////////////////////////////////////

// ! export code non job
export const DataTableWrapper = React.forwardRef((props: TableSourcesProps, ref) => {
    const [isErrorConnection, setErrorConnection] = React.useState<undefined|string>();
    const [verifyConfig, setConfig] = React.useState<SupabaseAuthData|undefined>();
    const [openModal, setOpenModal] = React.useState(false);
    const [isLoad, setisLoad] = React.useState(false);
    const {
        'data-id': dataId,
        'data-type': dataType,
        style={},
        header,
        footer,
        sourceType,
        source,
        fullWidth,
        fontSizeHead,
        file,
        styles,
        config,
        ...otherProps
    } = props;
    const { width, height } = useComponentSizeWithSiblings(dataId);

    
    const exportCode = (call) => {
        const inferColumns = (data: any[]) => {
            const result = [];
            const first = data[0];

            Object.keys(first).map((key) => {
                if (key.length > 0 && key !== 'id') result.push({
                    field: key,
                    header: key.toUpperCase(),
                })
            });

            return result;
        }

        const code = exportedTable(
            data,
            inferColumns(data),
            fontSizeHead,
            {...style, display: 'block', width: '100%'},
            styles,
            otherProps
        );
        
        call(code);
    }
    //? добавить сохранение в save storage
    const supabaseConnect = (config: SupabaseAuthData) => {
        testSupabaseConnection(config.url, config.anonKey, config.tableName)
            .then((res) => {
                if (res) {
                    setConfig(config);
                    updateComponentProps({
                        component: { props },
                        data: { config }
                    });
                    setOpenModal(false);
                    setisLoad(true);
                }
                else {
                    setConfig(config);
                    setErrorConnection('not connection supabase');
                    setOpenModal(true);
                }
            });
    }
    React.useEffect(() => {
        setisLoad(false);
        setErrorConnection(undefined);

        if(sourceType === 'supabase') {
            if(config?.anonKey || config?.url) {
                supabaseConnect(config);
            }
            else {
                setConfig({
                    anonKey: config?.anonKey ?? '',
                    url: config?.url ?? '',
                    tableName: config?.tableName ?? 'kv_store',
                    key: config?.key ?? 'user-5421748935'
                });
                setOpenModal(true);
            }
        }
        else if(sourceType === 'json' || sourceType === 'google') {
            setConfig(undefined);
            setisLoad(true);
        }
    }, [config, sourceType]);
    React.useEffect(() => {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props]);


    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='DataTable'
            style={{ 
                ...style, 
                width: '100%',
                maxHeight: height
            }}
        >
            { isLoad &&
                <DataTable
                    header={header}
                    footer={footer}
                    sourceType={sourceType}
                    source={source}
                    config={verifyConfig}
                    onSelect={() => {}}
                    file={file}
                    fontSizeHead={fontSizeHead}
                    onChange={(changeData)=> console.gray('change data:', changeData)}
                    style={{
                        width: '100%', 
                        height:  height ?? '100%',
                        overflowX: 'auto'
                    }}
                />
            }
            <Modal
                open={openModal}
                setOpen={setOpenModal}
            >
                <div style={{display: 'flex', flexDirection:'column'}}>
                    <FormConnected
                        onClick={supabaseConnect}
                        config={verifyConfig}
                    />
                </div>
            </Modal>
        </div>
    );
});