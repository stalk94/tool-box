import React, { useRef, useEffect, useState } from 'react';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { InputPaper, InputBaseCustom  } from './atomize';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { UploadFile, InsertDriveFile } from '@mui/icons-material';


export type FileLoaderProps = {
    value?: File | File[];
    onUpload?: (files: File[] | File) => void;
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // в байтах
    disabled?: boolean;
    placeholder?: string;
}


export default function FileLoader({
    value,
    onUpload,
    accept = '',
    multiple = false,
    maxSize,
    disabled,
    placeholder = 'Выберите файл...',
    ...props
}: FileLoaderProps) {
    const theme = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileList, setFileList] = useState<File[]>([]);


    useEffect(() => {
        if (value instanceof File) setFileList([value]);
        else if (Array.isArray(value)) setFileList(value);
    }, [value]);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const list = Array.from(files);
        const filtered = maxSize
            ? list.filter((file) => file.size <= maxSize)
            : list;

        setFileList(filtered);
        onUpload?.(multiple ? filtered : filtered[0]);

        // очистим value чтобы повторно выбирать тот же файл
        event.target.value = '';
    }
    const openFileDialog = () => {
        if (!disabled) inputRef.current?.click();
    }


    return (
        <InputPaper {...props}  disabled={disabled}>
            <input
                ref={inputRef}
                type="file"
                hidden
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={handleFileChange}
            />

            <Box
                onClick={openFileDialog}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexGrow: 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    width: '100%',
                    height: '100%',
                    minHeight: '40px',
                    px: 1,
                }}
            >
                
                <UploadFile sx={{ mr: 1, color: theme.palette.input.placeholder }} />

                {fileList.length > 0 ? (
                    <Box sx={{ flex: 1 }}>
                        {fileList.map((file, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                <InsertDriveFile sx={{ fontSize: 18, mr: 0.5 }} />
                                <Typography variant="body2" noWrap>
                                    { file.name }
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Typography 
                        variant="body2" 
                        sx={{ opacity: 0.5, ml: 1 }}
                    >
                        { placeholder }
                    </Typography>
                )}
            </Box>
        </InputPaper>
    );
}