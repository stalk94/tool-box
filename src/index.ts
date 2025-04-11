// все инпуты
export * from './components/input';

// таблица данных primereact модернизированная
export { default as DataTable } from './components/data-table';

// appBar
export { default as AppBar } from './components/app-bar';
// слоты appBar
export { Start, Center, MobailBurger } from './components/app-bar';

// левая панелька как в vs code
export { default as LeftSideBar } from './components/nav-bars/left-nav';
export { default as LeftSideBarAndTool } from './components/nav-bars/tool-left';

export type { AccordionProps } from './components/accordion';
export { default as Accordion } from './components/accordion';

// всплываюшие информационные окна
export { AlertProvider, useAlert } from './components/alert';
export type { AlertManagerProps } from './components/alert';

// базовая форма работаюшая со схемой
export { default as Form } from './components/form';
// интерфейс базовой схемы
export type { Schema } from './components/form/types';