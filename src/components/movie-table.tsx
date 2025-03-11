import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Dialog, DialogContent, Rating, Box, Tooltip } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Flag from './flag';
import { useGetMovies, Movie } from "./api";


const chekText =(text: string)=> {
    if(text.length > 20) return(
        <div className='marquee-container'>
            <div className="marquee-text">
                { text }
            </div>
        </div>
    );
    else return(
        <React.Fragment>
            { text }
        </React.Fragment>
    );
}
const MovieRating =({ rating }: { rating: number })=> {
    
    return (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
          }}
        >
            <Rating
                name="movie-rating"
                value={rating / 2}
                precision={0.5}
                readOnly
                size="small"
            />
            <span style={{paddingLeft:'10px'}}>
                { rating.toFixed(1) }
            </span>
        </Box>
    );
}

const columns: GridColDef<Movie>[] = [
    { 
        field: "image", 
        headerName: "Постер", 
        align: 'center',
        filterable: false,
        renderCell: (params)=> (
            <img 
                src={params.value} 
                alt="Poster" 
                style={{ height: '90%', objectFit: "cover", marginTop:'5%', cursor:'pointer'  }} 
                onClick={()=> params.api.getRow(params.id).handleImageClick(params.value)}
            />
        )
    },
    { 
        field: "title", 
        headerName: "Название", 
        width: 200,
        renderCell: (params)=> {
            const theme = useTheme();

            return(
                <div style={{ 
                    fontFamily: 'Arial', 
                    fontSize: '14px', 
                    color: theme.palette.mode==='dark'?'#c9fb84':'#44d917', 
                    fontWeight: 'bold',
                    wordWrap: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    { chekText(params.value) }
                </div>
            );
        }
    },
    { 
        field: "release_date", 
        headerName: "Дата выхода", 
        width: 150, 
        type: "date",
        align: 'center',
        valueGetter: (value, row)=> {
            return new Date(value);
        },
        renderCell: (params)=> {
            return (
                <div style={{ 
                    fontWeight: 'bold',
                }}>
                    { params.formattedValue }
                </div>
            );
        }
    },
    { 
        field: "rating", 
        headerName: "Рейтинг", 
        width: 150, 
        type: "number",
        align: 'center',
        renderCell: (params)=> (
            <MovieRating rating={params.value}/>
        )
    },
    { 
        field: "original_language", 
        headerName: "Язык", 
        width: 100,
        align: 'center',
        renderCell: (params)=> {
            return (
                <div style={{marginTop:'40%'}}>
                    <Flag 
                        code={params.value}
                    /> 
                </div>
            );
        }
    },
    { 
        field: "overview", 
        headerName: "Описание", 
        flex: 1,
        renderCell: (params)=> {
            const theme = useTheme();
            if(params.value==='') params.value = 'нет описания';

            return (
                <Tooltip title={params.value} arrow>
                    <div style={{
                        display: 'block',
                        height: '100%',
                        maxWidth: '95%',
                        color: theme.palette.mode==='dark'?'#a09c9c':'#252423',
                        wordWrap: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontStyle: 'italic',
                        fontSize: '12px'
                    }}>
                        { params.value }
                    </div> 
                </Tooltip>
            );
        }
    }
];
const sortingModelsDefault = [
    {
        field: 'title',
        sort: 'asc'
    },
    {
        field: 'release_date',
        sort: 'desc'
    },
    {
        field: 'original_language',
        sort: 'asc'
    }
];


export default function() {
    const { movies, loading } = useGetMovies();
    const [sortingModel, setSortingModel] = React.useState([sortingModelsDefault[1]]);
    const [filterModel, setFilterModel] = React.useState({ items: [] });
    const [selectedImage, setSelectedImage] = React.useState<string|null>(null);


    const handleImageClick =(image: string)=> {
        setSelectedImage(image);
    }
    const handleSortingModelChange =(newSortingModel)=> {
        //console.log(newSortingModel);
        setSortingModel(newSortingModel);
        localStorage.setItem('sortingModel', JSON.stringify(newSortingModel));
    }
    const handleFilterModelChange =(newFilterModel)=> {
        //console.log(newFilterModel);
        setFilterModel(newFilterModel);
        localStorage.setItem('filterModel', JSON.stringify(newFilterModel));
    }
    React.useEffect(()=> {
        const savedSorting = localStorage.getItem('sortingModel');
        const savedFilterModel = localStorage.getItem('filterModel');

        if(savedSorting) {
            setSortingModel(JSON.parse(savedSorting));
        }
        if(savedFilterModel) {
            setFilterModel(JSON.parse(savedFilterModel));
          }
    }, []);

    
    return(
        <React.Fragment>
            <Dialog 
                open={Boolean(selectedImage)} 
                onClose={()=> setSelectedImage(null)}
            >
                <DialogContent>
                    { selectedImage && 
                        <img 
                            src={selectedImage} 
                            alt="Large" 
                            style={{ width: "100%" }} 
                        />
                    }
                </DialogContent>
            </Dialog>
           
            <DataGrid 
                disableMultipleColumnsSorting={false}
                loading={loading}
                rows={movies.map((row)=> ({ ...row, handleImageClick }))}
                columns={columns}

                sortModel={sortingModel}
                onSortModelChange={handleSortingModelChange}
                filterModel={filterModel}
                onFilterModelChange={handleFilterModelChange}

                getRowHeight={(params)=> {
                    const contentHeight = params.model?.title?.length * 2;
                    return Math.max(100, Math.min((contentHeight ?? 100), 300));
                }}
                sx={{
                    "& .custom-description": { 
                        fontWeight: "bold", 
                        color: "red" 
                    },
                    "& .MuiDataGrid-cell": { 
                        minHeight: "100px", 
                        maxHeight: "300px" 
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        fontWeight: 'bold',
                    }
                }}
            />
        </React.Fragment>
    );
}