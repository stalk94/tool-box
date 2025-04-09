import React from 'react';
import Galery from './galery';
import FiltersRender from './filters';
import { DynamicFilter, Item } from './type';
import { Box, BoxProps } from '@mui/material';


// список checkbox multi
const checkboxFiltersMulti = {
    label: 'Цвета',
    id: 'properties.color',
    type: 'chekbox',
    multi: true,
    options: [
        {
            label: 'Зеленый',
            id: 'green'             // указатель к значению в Item
        },
        {
            label: 'Синий',
            id: 'blue'
        },
    ]
}
const sliderFilter = {
    label: 'Цена',
    id: 'price',
    type: 'slider',
    options: {
        label: 'min - max',
        value: [10, 100] // Диапазон (min, max)
    },
}


// управляет фильтрами и списком товаров
export default function({ items, filters }) {
    const [curFilters, setCurFilters] = React.useState<Record<string, any>>({});
    const [curItems, setCurItems] = React.useState<Item[]>(items);


    // нотация id примера 'properties.name'
    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
    }
    // Обновить значение одного фильтра
    const handleChange = (id: string, value: any) => {
        setCurFilters((prev) => ({ ...prev, [id]: value }));
    }
    //! Применить фильтры к списку товаров
    const useFilter = () => {
        let result = [...items];

        for (const [filterKey, filterValue] of Object.entries(curFilters)) {
            result = result.filter((item) => {
                const itemValue = getNestedValue(item, filterKey);
               

                if (Array.isArray(filterValue)) {
                    return filterValue.includes(itemValue);
                }

                if (Array.isArray(itemValue)) {
                    return itemValue.includes(filterValue);
                }

                // Если это диапазон
                if (Array.isArray(filterValue) && typeof filterValue[0] === 'number') {
                    return itemValue >= filterValue[0] && itemValue <= filterValue[1];
                }

                return itemValue === filterValue;
            });
        }
        
        setCurItems(result);
    }
    React.useEffect(() => {
        if(items) useFilter();
    }, [curFilters, items]);


    return(
        <Box sx={{display:'flex', flexDirection:'row'}}>
            <FiltersRender
                filters={[checkboxFiltersMulti, sliderFilter]}
                values={curFilters}
                onChange={handleChange}
            />

        </Box>
    );
}