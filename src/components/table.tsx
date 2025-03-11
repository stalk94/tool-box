import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Dialog, DialogContent, Typography, Avatar } from "@mui/material";



const rows = [
    {
        id: 1,
        image: "https://pixlr.com/images/generator/text-to-image.webp",
        description: "Описание 1",
        date: "2024-03-10",
        number: 123,
    },
    {
        id: 2,
        image: "https://static.vecteezy.com/ti/photos-gratuite/t2/25220125-image-une-captivant-scene-de-une-tranquille-lac-a-le-coucher-du-soleil-ai-generatif-photo.jpg",
        description: "Описание 2",
        date: "2024-03-09",
        number: 456,
    },
    {
        id: 3,
        image: "https://static.gettyimages.com/display-sets/creative-landing/images/GettyImages-2181662163.jpg",
        description: "Описание 3",
        date: "2024-03-08",
        number: 789,
    },
    {
        id: 4,
        image: "https://static.gettyimages.com/display-sets/creative-landing/images/GettyImages-2181662163.jpg",
        description: "Описание 4",
        date: "2024-03-08",
        number: 789,
    },
    {
        id: 5,
        image: "https://static.vecteezy.com/ti/photos-gratuite/t2/25220125-image-une-captivant-scene-de-une-tranquille-lac-a-le-coucher-du-soleil-ai-generatif-photo.jpg",
        description: "Описание 2",
        date: "2024-03-09",
        number: 456,
    },
    {
        id: 6,
        image: "https://static.gettyimages.com/display-sets/creative-landing/images/GettyImages-2181662163.jpg",
        description: "Описание 3",
        date: "2024-03-08",
        number: 789,
    },
    {
        id: 7,
        image: "https://static.gettyimages.com/display-sets/creative-landing/images/GettyImages-2181662163.jpg",
        description: "Описание 4",
        date: "2024-03-08",
        number: 789,
    },
    
];
const columns: GridColDef<(typeof rows)[number]>[] = [
    {
        field: "image",
        headerName: "Картинка",
        width: 200,
        renderCell: (params)=> {
            //console.log(params)
            return(
                <Avatar
                    src={params.value}
                    sx={{ width: 60, height: 60, cursor: "pointer", marginTop:'10%' }}
                    onClick={()=> params.api.getRow(params.id).handleImageClick(params.value)}
                />
            );
        },
    },
    {
        field: "description",
        headerName: "Описание",
        width: 200,
        cellClassName: "custom-description",
    },
    {
        field: "date",
        headerName: "Дата",
        width: 150,
        type: "date",
        valueGetter: (value, row)=> {
            return new Date(value);
        },
    },
    {
        field: "number",
        headerName: "Число",
        width: 100,
        type: "number",
    },
];



export default function() {
    const [selectedImage, setSelectedImage] = React.useState<string|null>(null);

    const handleImageClick =(image: string)=> {
        setSelectedImage(image);
    }

    
    return(
        <React.Fragment>
            <Dialog 
                open={Boolean(selectedImage)} 
                onClose={()=> setSelectedImage(null)}
            >
                <DialogContent>
                    { selectedImage && 
                        <img src={selectedImage} alt="Large" style={{ width: "100%" }} />
                    }
                </DialogContent>
            </Dialog>
            <DataGrid
                rows={rows.map((row)=> ({ ...row, handleImageClick }))}
                columns={columns}
                //pageSizeOptions={[5]}
                getRowHeight={(params)=> {
                    const contentHeight = params.model.description.length * 2;
                    return Math.max(100, Math.min(contentHeight, 300));
                }}
                sx={{
                    "& .custom-description": { fontWeight: "bold", color: "blue" },
                    "& .MuiDataGrid-cell": { minHeight: "100px", maxHeight: "300px" },
                }}
            />
        </React.Fragment>
    );
}