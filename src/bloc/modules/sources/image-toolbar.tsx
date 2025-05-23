import React from 'react';
import { Box, IconButton } from "@mui/material";
import { Add, DeleteForever, Upload, Download } from '@mui/icons-material';
import { FaPaste } from "react-icons/fa6";
import { uploadFile } from 'src/app/plugins';


export const LoaderToolWrapper = (props) => {
    const [load, setLoad] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { name, children, src, select, index, setSelect, onAdd, onDelete, style, isDelCentre } = props;

    const handleUpload = async (file: File) => {
        let type;
        setLoad(true);

        if (file.type.startsWith('image/')) type = 'image';
        if (file.type.startsWith('video/')) type = 'video';

        const filename = `${name}.${file.name.split('.').pop()}`;
        const url = await uploadFile(file, filename);
        const tempUrl = `${url}?v=${Date.now()}`;
        onAdd(tempUrl, type);
        setLoad(false);
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    }
    

    return (
        <div key={index}
            onClick={(e)=> setSelect(index)}
            style={{
                position: 'relative',
                overflow: 'hidden',
                border: (select === index && !isDelCentre) && '2px solid #58beea8d',
                background: select === index ? '#35422e10' : 'transparent'
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '85%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    zIndex: 2,
                    padding: '2 12',
                    borderRadius: 1,
                    ...style
                }}
            >
                <IconButton
                    size='small'
                    onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.click();
                    }}
                    sx={{
                        border: '1px solid #ffffff99',
                        background: '#ffffff12',
                        borderRadius: 2,
                        padding: '2px 12px',
                        cursor: 'pointer',
                        zIndex: 5,
                        opacity: 0.8,
                        fontSize: 14,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(12px)', 
                        '&:hover': {
                            background: '#ffffffcc',
                            opacity: 1,
                        }
                    }}
                >
                    <Upload sx={{fontSize: 16}} />
                </IconButton>
                <IconButton
                    size='small'
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    sx={{
                        border: '1px solid #e2727299',
                        background: '#ffffff12',
                        borderRadius: 2,
                        padding: '2px 4px',
                        cursor: 'pointer',
                        ml: 0.5,
                        zIndex: 5,
                        opacity: 0.8,
                        fontSize: 14,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(12px)',
                        '&:hover': {
                            background: '#fb404038',
                            opacity: 1,
                        }
                    }}
                >
                    <DeleteForever sx={{color: '#c65555', fontSize: 20}} />
                </IconButton>
            </Box>

            { children }

            <input
                type="file"
                accept="image/*,video/*"
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
}