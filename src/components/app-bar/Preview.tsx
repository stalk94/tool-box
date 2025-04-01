import React from "react";
import AppBar, { Start, Center, MobailBurger } from "./index";
import { AccountBox, Home, Settings, Info } from "@mui/icons-material";
import { IconButton, Box } from "@mui/material";

type Props = {
    linkItems: {
        /** !должно быть уникальным */
        id: string
        label: string 
        icon?: React.ReactNode
    }[]
}


/**
 * Презентационный AppBar скомпонованный по базовой схеме
 */
export default function({ linkItems }: Props) {
    const navLinksTest = [
        { id: 'base', label: "Главная", icon: <Home />},
        {
            id: 'services',
            label: "Услуги", 
            icon: <Settings />,
            children: [
                {  id: '1', label: "Услуга 1", icon: <Home /> },
                {  id: '2', label: "Услуга 2" },
                {  id: '3', label: "Услуга 3" },
            ]
        },
        {
            id: 'descr',
            label: "О нас",
            children: [
                { id: '1', label: "Услуга 1", icon: <Home /> },
                { id: '2', label: "Услуга 2" },
                { id: '3', label: "Услуга 3" },
            ]
        },
    ];

    // вяжется на все элементы навигации, получает rout нажатого элемента
    const handlerClickNavigation =(path: 'string')=> {
        console.log(path);
    }
    const transformUseRouter =()=> {
        const func =(items, parent?: string)=> {
            return items.map((elem, index)=> {
                if(!parent) elem.path = '/' + elem.id;
                else elem.path = parent + '/' + elem.id;
    
                elem.comand =()=> handlerClickNavigation(elem.path);
    
                if(elem.children) {
                    func(elem.children, elem.path);
                }
    
                return elem;
            });
        }
    
        const result = func(linkItems ?? navLinksTest);
        return result;
    }


    return(
        <AppBar
            elevation={1}
            start={
                <Start>
                    <Box
                        component="img"
                        src="https://arenadata.tech/wp-content/uploads/2024/10/logo-white-short.png" // Замените на ваш логотип
                        alt="Logo"
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '40px',
                            padding: '5px',
                            objectFit: 'contain',
                            borderRadius: '3px'
                        }}
                    />
                </Start>
            }
            center={
                <Center
                    items={transformUseRouter()}
                />
            }
            end={
                <React.Fragment>
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mx: 0.5 }}
                    >
                        <AccountBox />
                    </IconButton>
                    <MobailBurger
                        items={transformUseRouter()}
                    />
                </React.Fragment>
            }
        />
    );
}