import React from 'react';
import { Button } from '@mui/material';
import { TextInput, CheckBoxInput, NumberInput } from '../../../index';
import { SupabaseAuthData } from './storage';

type FormProps = { 
    config: SupabaseAuthData
    onClick: (config: SupabaseAuthData)=> void 
}
const TestUrl = 'https://bhgrcocadwsejwodvzql.supabase.co';
const TestKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZ3Jjb2NhZHdzZWp3b2R2enFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MzY5NTksImV4cCI6MjA2NDIxMjk1OX0.ijFGDKECfWYBULzTDUtIJMFaAJN1N-70ygQSzMONQIg';


export default function({ config, onClick }: FormProps) {
    const [data, setData] = React.useState<SupabaseAuthData>();
 
    const sx: React.CSSProperties = { fontSize: 12 };
    const onChange =(key: 'key'|'url'|'tableName'|'anonKey'|'pollingInterval', value: string)=> {
        setData((old)=> {
            old[key] = value;
            return old;
        });
    }
    React.useEffect(()=> {
        setData({
            ...config,
            url: TestUrl,
            anonKey: TestKey,
        });
    }, [config]);


    return(
        <>
            <TextInput
                labelSx={sx}
                label='supabase url'
                position='left'
                value={data?.url}
                onChange={(v)=> onChange('url', v)}
            />
            <TextInput
                labelSx={sx}
                label='supabase anon key'
                position='left'
                value={data?.anonKey}
                onChange={(v)=> onChange('anonKey', v)}
            />
            <TextInput
                labelSx={sx}
                label='table name'
                position='left'
                value={data?.tableName ?? 'kv_store'}
                onChange={(v)=> onChange('tableName', v)}
            />
            <TextInput
                labelSx={sx}
                label='row unical identifier key'
                position='left'
                value={data?.key}
                onChange={(v)=> onChange('key', v)}
            />
            <NumberInput
                labelSx={sx}
                label='delay poling'
                position='left'
                disabled={!data?.pollingInterval}
                value={data?.pollingInterval ?? 0}
                max={100}
                min={0}
                onChange={(v)=> {
                    if(v) onChange('pollingInterval', v * 1000);
                    else onChange('pollingInterval', 0);
                }}
            />
            <CheckBoxInput
                value={data?.pollingInterval ? true : false}
                label='enable poling'
                onChange={(v)=> {
                    if(v) onChange('pollingInterval', 5 * 1000);
                    else  onChange('pollingInterval', 0);
                }}
            />
            <Button 
                variant='outlined'
                color='success'
                sx={{
                    mt: 1
                }}
                onClick={()=> onClick(data)}
            >
                connected
            </Button>
        </>
    );
}