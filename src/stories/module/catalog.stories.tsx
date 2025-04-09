import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Catalogs from '../../components/catalog';


const meta: Meta<typeof Catalogs> = {
    title: 'Module',
    component: Catalogs,
}

export default meta;



// сделать сохранения
const Templates =(args)=> {
    const testItem = {
        id: 0,
        title: 'Название товара',
        description: 'Конечно! Вот универсальный интерфейс Item для интернет-магазина на TypeScript — с учётом гибкости для конструктора',
        type: 'window',
        price: 1000,
        discountPrice: null,
        currency: 'USD', // валюта (можно менять на 'RUB', 'EUR', и т.д.)

        images: [
            'https://placehold.co/300x300?text=Product+1&font=roboto', 
            'https://picsum.photos/300/300'
        ],

        stock: {
            quantity: 10, // сколько в наличии
            unlimited: false // можно ли продавать бесконечно
        },

        // дополнительные данные, которые можно настраивать
        meta: {
            tags: ['new'], // массив тегов, например ['новинка', 'топ']
            category: '',
            brand: '',
            article: '',
            rating: 10,
            reviewsCount: 100
        },

        // динамические свойства — подстраиваются под тип товара
        properties: {
            color: 'red', // цвет
            size: '', // размер
            material: '', // материал
            weight: '', // вес
            dimensions: {
                width: '',
                height: '',
            }
        },

        variants: [
            {
            id: 1, // уникальный ID для варианта
            color: 'red', // цвет варианта
            size: 'M', // размер варианта
            price: 100, // цена для данного варианта
            stock: 10, // количество в наличии
            images: ['https://picsum.photos/300/300', 'https://picsum.photos/300/300'], // изображения для этого варианта
            article: 'RED-M', // уникальный артикул для варианта
            discountPrice: 90, // скидка для варианта
            isActive: true, // доступность варианта
            },
            {
            id: 2, // уникальный ID для варианта
            color: 'blue', // цвет варианта
            size: 'L', // размер варианта
            price: 110, // цена для данного варианта
            stock: 5, // количество в наличии
            images: ['https://picsum.photos/300/300', 'https://picsum.photos/300/300'], // изображения для этого варианта
            article: 'BLUE-L', // уникальный артикул для варианта
            discountPrice: 100, // скидка для варианта
            isActive: true, // доступность варианта
            }
        ],

        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
    const testItem2 = {
        ...testItem,
        price: 400
    }
    testItem2.properties.color = 'green';
    const itemsTest = [testItem, testItem ,testItem ,testItem, testItem];


    return(
        <div style={{width: '100%', height: '100%'}}>
            <Catalogs
                items={itemsTest}
            />
        </div>
    );
}



export const Catalog: StoryObj<typeof Catalogs> = {
    args: {
        
    },
    render: Templates
}