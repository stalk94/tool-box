import React from 'react';
import { Button } from '@mui/material';
import { TextInput } from '../../../index';
import { SupabaseAuthData } from './storage';

type FormProps = { 
    config: SupabaseAuthData
    onClick: (config: SupabaseAuthData)=> void 
}
const TestUrl = 'https://bhgrcocadwsejwodvzql.supabase.co';
const TestKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZ3Jjb2NhZHdzZWp3b2R2enFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MzY5NTksImV4cCI6MjA2NDIxMjk1OX0.ijFGDKECfWYBULzTDUtIJMFaAJN1N-70ygQSzMONQIg';

export default function({ config, onClick }: FormProps) {
    const [data, setData] = React.useState<SupabaseAuthData>();
 
    const onChange =(key: 'key'|'url'|'tableName'|'anonKey', value: string)=> {
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
                label='supabase url'
                position='column'
                value={data?.url}
                onChange={(v)=> onChange('url', v)}
            />
            <TextInput
                label='supabase anon key'
                position='column'
                value={data?.anonKey}
                onChange={(v)=> onChange('anonKey', v)}
            />
            <TextInput
                label='table name'
                position='column'
                value={data?.tableName ?? 'kv_store'}
                onChange={(v)=> onChange('tableName', v)}
            />
            <TextInput
                label='row unical identifier key'
                position='column'
                value={data?.key}
                onChange={(v)=> onChange('key', v)}
            />
            <Button 
                variant='outlined'
                color='success'
                onClick={()=> onClick(data)}
            >
                connected
            </Button>
        </>
    );
}