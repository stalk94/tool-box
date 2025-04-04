import React from "react";
import { Tooltip, alpha, TooltipProps } from "@mui/material";



export default function({ children, placement, title, ...props }: TooltipProps) {
    
    return (
        <Tooltip 
            title={title} 
            placement={placement}
            { ...props }
            sx={{
                "& .MuiTooltip-tooltip": {
                    backgroundColor: "black",
                    color: "white",
                    fontSize: "16px",
                    padding: "10px",
                    borderRadius: "8px",
                },
                ...props.sx,
            }}
        >
            { children }
        </Tooltip>
    );
}