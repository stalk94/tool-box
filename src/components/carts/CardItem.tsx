import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';


/** пример карточки товара для каталога */
export default function ({ image, title, price }) {
    return(
        <Card
            sx={{
                borderRadius: '24px',
                overflow: 'hidden',
                width: 260,
                textAlign: 'center',
                boxShadow: 2,
                backgroundColor: '#fff',
            }}
        >
            <Box sx={{ p: 2 }}>
                <img
                    src={image}
                    alt={title}
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: 200,
                        objectFit: 'contain',
                    }}
                />
            </Box>
            <CardContent
                sx={{
                    backgroundColor: '#f5f6f8',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                }}
            >
                <Typography variant="body2" sx={{ mb: 1 }}>
                    { title }
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                    { price }
                </Typography>
            </CardContent>
        </Card>
    );
}