import { Grid2 } from "@mui/material";
import React from "react";


/**
 * 
 *  react-grid-layout работает с координатами в сетке, а Grid2 использует пропорции (например, xs, md, lg). 
 *  Нужно подобрать масштаб, чтобы размеры совпадали.
 *
 *  Высоту (h) можно привязывать к rowHeight из редактора (30px в примере), 
 *  а ширину — к w и количеству колонок (cols)
 */
const RenderWithGrid2 = ({ layout }) => {
    return (
        <Grid2 container spacing={2}>
            { layout.map((item) => (
                <Grid2
                    key={item.i} 
                    xs={item.w * 2}         //? тут что то изменилось
                    style={{
                        height: item.h * 30,
                        background: "lightgrey",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    { `Block ${item.i}` }
                </Grid2>
            ))}
        </Grid2>
    );
  }