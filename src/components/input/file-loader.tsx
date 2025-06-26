import React, { useRef, useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import { InputPaper, InputBaseCustom  } from './atomize';
import { Box, IconButton, Typography, useTheme, TextField, Button } from '@mui/material';
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
export type SimpleFileLoaderProps = {
    children: React.ReactNode;
    onUpload: (files: File[] | File) => void;
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // в байтах (например, 5 * 1024 * 1024)
    onReject?: (reason: string) => void;
    style?: React.CSSProperties;
    className?: string;
    dragActiveClassName?: string;
}
export type ComboLoader = {
    value?: File
    onChange: (path: string)=> void
}


export function SimpleFileLoader({
    children,
    onUpload,
    accept,
    multiple = false,
    maxSize,
    onReject,
    style,
    className,
    dragActiveClassName,
}: SimpleFileLoaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setDragOver] = useState(false);

    const openFileDialog = () => inputRef.current?.click();
    const validateFiles = (files: FileList): File[] | null => {
        const list = Array.from(files);

        if (maxSize) {
            const tooBig = list.find((file) => file.size > maxSize);
            if (tooBig) {
                onReject?.(`Файл "${tooBig.name}" превышает лимит ${Math.round(maxSize / 1024 / 1024)} MB`);
                return null;
            }
        }

        if (accept) {
            const acceptedTypes = accept.split(',').map((type) => type.trim());
            const rejected = list.find(file =>
                !acceptedTypes.some(type =>
                    type.startsWith('.') ? file.name.endsWith(type) : file.type === type
                )
            );
            if (rejected) {
                onReject?.(`Файл "${rejected.name}" не соответствует формату: ${accept}`);
                return null;
            }
        }

        return list;
    }
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);

        const files = e.dataTransfer.files;
        const valid = validateFiles(files);
        if (!valid) return;

        onUpload(multiple ? valid : valid[0]);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const valid = validateFiles(files);
        if (!valid) return;

        onUpload(multiple ? valid : valid[0]);
        e.target.value = ''; // allow re-upload same file
    }
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    }
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
    }
    const combinedClassName = [className, isDragOver && dragActiveClassName,]
        .filter(Boolean)
        .join(' ');

    
    return (
        <div
            onClick={openFileDialog}
            onDrop={handleDrop}
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDragLeave}
            className={combinedClassName}
            style={{ cursor: 'pointer', ...style }}
        >
            <input
                type="file"
                hidden
                ref={inputRef}
                onChange={handleChange}
                accept={accept}
                multiple={multiple}
            />
            {children}
        </div>
    );
}
export function FileLoaderCombo({ value, onChange, ...props }: ComboLoader) {
    const [url, setUrl] = React.useState(value ?? '');
    const placeholderStyle = {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.9rem',         // ≈ 14px
        //fontStyle: 'italic',
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
        ...props?.styles?.placeholder
    }

    const handleFile = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result as string;
            const id = `img-${Date.now()}`;
            const images = await get('images') || {};
            images[id] = base64;
            await set('images', images);

            setUrl(id);
            onChange(id);
        };
        reader.readAsDataURL(file);
    }


    return (
        <InputPaper {...props}>
            <TextField
                label="URL изображения"
                size="small"
                value={url}
                onChange={(e) => {
                    const val = e.target.value;
                    setUrl(val);
                    onChange(val);
                }}
                sx={{
                    width: '100%',
                    minWidth: '60px',
                    minHeight: '38px',
                    background: 'transparent',
                    padding: 0,
                    pl: props.left ? 1 : 2,
                    pr: 2,
                    pt: 0.1,
                    flex: 1,
                    '& input': {
                        position: 'relative',
                        zIndex: 2,
                        background: 'transparent',
                        minHeight: 30,
                        //border: '1px solid red',
                    },
                    '& input::placeholder, & textarea::placeholder': placeholderStyle,
                    ...props.sx
                }}
            />
            <IconButton
                component="label"
                variant="outlined"
                size="small"
                sx={{fontSize:10}}
            >
                
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files?.[0]) handleFile(e.target.files[0]);
                    }}
                />
            </IconButton>
        </InputPaper>
    );
}


export default function FileLoader({
    value,
    onChange,
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
        if (typeof window === 'undefined') return;

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
        onChange?.(multiple ? filtered : filtered[0]);
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
                accept={accept ? accept : undefined}
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
                
                <UploadFile sx={{ mr: 1, color: theme.palette.input.placeholder, ...props?.styles?.icon }} />

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
                        sx={{ opacity: 0.5, ml: 1, ...props?.styles?.placeholder }}
                    >
                        { placeholder }
                    </Typography>
                )}
            </Box>
        </InputPaper>
    );
}