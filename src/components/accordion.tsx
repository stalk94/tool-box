import React from 'react';
import { IconButton, Box } from '@mui/material';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useTheme } from '@mui/system';
import { ExpandMore } from '@mui/icons-material';


type AccordionItem = {
    /** label аккордеона */
    title: React.ReactNode
    /** тело аккордеона */
    content: React.ReactNode
}
/**
 * * `activeIndexs` - массив индексов развернутых вкладок [0, 1, 2 ...]       
 * * `tabStyle` - стили для одного раздела акордеона (header + content) ❗ только в свернутом состоянии применяется
 */
export type AccordionProps = {
    items: AccordionItem[] 
    /** массив индексов развернутых вкладок [0, 1, 2 ...] */
    activeIndexs?: number[]
    /** стили для одного раздела акордеона (header + content) !только в свернутом состоянии */
    tabStyle?: React.CSSProperties
    headerStyle?: React.CSSProperties
}


const AccordionHeader = ({ header, isExpanded, headerStyle }) => {
    const theme = useTheme();
    const useColor =(key: string)=> {
        if(theme.palette.accordion[key]) {
            return theme.palette.accordion[key];
        }
        else {
            if(key ==='headerContent') return theme.palette.navigation.main;
            else if(key ==='headerIcon') return theme.palette.accordion.headerContent ?? theme.palette.navigation.main;
            else if(key ==='headerMain') return theme.palette.card.main;
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',   // вертикльное выравнивание
                width: '100%',
                color: useColor('headerContent'),
                backgroundColor: useColor('headerMain'),
            }}
            style={{
                ...headerStyle,
                borderRadius: headerStyle?.borderRadius + 'px',
                border: `1px ${headerStyle?.borderStyle} ${headerStyle?.borderColor}`
            }}
        >
            { header }
            <IconButton
                sx={{
                    color: headerStyle?.color ?? useColor('headerIcon'),
                    marginLeft: 'auto',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', // Поворот стрелочки
                    transition: 'transform 0.3s ease', // Плавное вращение
                }}
            >
                <ExpandMore sx={{ fontSize: headerStyle?.fontSize ? (+headerStyle?.fontSize + 2) : 16 }} />
            </IconButton>
        </Box>
    );
}


/**
 * Простой многосекционный аккордеон       
 * @example
 * <Accordion 
 *  activeIndexs={[0]}    <- развернутой по дефолту будет первая вкладка
 *  tabStyle - стиль внутреннего мюню раздела
 *  headerStyle - стиль заголовка раздела
 *  items={[
 *      { title: "FAQ", content: <div>Content 1</div> },
 *      { title: <Box>кастомный title</Box>, content: "Свяжитесь с нами" }
 *  ]} 
 * />
 */
export default function CustomAccordion({ items, activeIndexs, tabStyle, headerStyle }: AccordionProps): React.JSX.Element {
    const [activeIndex, setActiveIndex] = React.useState(activeIndexs ?? []);
    
    const useActive =(index: number)=> {
        if(activeIndex.find(i => (i === index)) !== undefined) return true;
        else return false;
    }
    

    return(
        <React.Fragment>
            <Accordion 
                multiple 
                activeIndex={activeIndex} 
                onTabChange={(e)=> setActiveIndex(e.index)}
            >
                {items.map((elem, index) => (
                    <AccordionTab
                        style={!useActive(index) ? { marginBottom: 2 } : {} }
                        key={index}
                        header={
                            <AccordionHeader
                                headerStyle={headerStyle}
                                header={elem.title ?? 'title-' + index}
                                isExpanded={useActive(index)}
                            />
                        }
                    >
                        <Box style={{...tabStyle}}>
                            { elem.content }
                        </Box>
                    </AccordionTab>
                ))}
            </Accordion>
            <style>
                {`
                    .p-accordion-header .p-accordion-toggle-icon {
                        display: none;
                    }
                `}
            </style>
        </React.Fragment>
    );
}