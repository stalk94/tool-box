/**
 * Базовый интерфейс варрианта товара
 */
export interface Variant {
    id: number | string
    color?: string
    size?: string
    price: number
    discountPrice?: number
    description?: string

    stock: number
    images?: string[],
    article?: string
    isActive: true
}


/**
 * Базовый интерфейс товара
 */
export interface Item {
    /** ✔️ доступен ли */
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;

    id: number | string;
    /** 🏷️ имя, название */
    title: string;
    /** ✍ описание */
    description: string;
    /** 🌟 например: 'одежда', 'услуга', 'цифровой', и т.д. */
    type: string;

    /** валюта 'USD', 'RUB' */
    currency: string;  
    price: number;
    discountPrice?: number | null;
             
    images?: string[];
  
    /** лимиты на складе */
    stock?: {
        /** 📦 сколько в наличии */
        quantity: number;
        /** ᦠ можно ли продавать бесконечно */
        unlimited?: boolean;
    };
  
    /** 🚩 основные данные, которые можно настраивать */
    meta?: {
        /** 📌 массив тегов, например ['новинка', 'топ'] */
        tags?: string[];
        /** категория, например 'обувь' */
        category?: string;
        /** 🏷️ бренд товара  */
        brand?: string;
        article?: string;
        /** ⭐ рейтинг  */
        rating?: number;
        /** 👁️ просмотры  */
        reviewsCount?: number;
    };

    /** 📏 динамические свойства — подстраиваются под тип товара */
    properties?: {
        [key: string]: string | number | boolean | Record<string, any>;
    };

    /** 🔗 варрианты позиции, к примеру разные цвета, размеры (можно связать с properties) */
    variants?: Variant[]
  
    /** ? кастомные поля от конструктора */
    custom?: {
        [key: string]: any;
    };
}


/*
  ФИЛЬТРЫ
*/
export type FilterType = 'slider' | 'chekbox' | 'toggle';

export interface BaseFilter {
  label: string;
  id: string;
  type: FilterType;
}
export interface ToggleOption {
  label: string;
  id: string;
}
export interface CheckboxOption {
  label: string;
  id: string;
}

export interface ToggleFilter extends BaseFilter {
  type: 'toggle';
  options: ToggleOption[];
}
export interface CheckboxFilter extends BaseFilter {
  type: 'chekbox';
  multi: boolean;
  options: CheckboxOption[];
}
export interface SliderFilter extends BaseFilter {
  type: 'slider';
  options: {
    label: string;
    value: [number, number];
  };
}


export type DynamicFilter = ToggleFilter | CheckboxFilter | SliderFilter;