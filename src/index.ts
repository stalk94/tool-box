// все инпуты
export * from './components/input';

// все формы
export * from './components/form';
export type { Schema } from './components/form/types';

// модалка
export * from './components/modal';
// формы
export * from './components/form';
// карточка
export * from './components/carts';
// карусели
export * from './components/carousel';
// для текста
export * from './components/text';

// снек бар
export { SnackbarProvider, useSnackbar } from 'notistack';

// навигация
export { default as Breadcrumbs } from './components/breadcrumbs';
export { useBreadcrumbs } from './components/breadcrumbs';
export type { BreadcrumbsNavProps as BreadcrumbsProps } from './components/breadcrumbs';

// таблица данных primereact модернизированная
export { default as DataTable } from './components/data-table';
export type{ DataTablePropsWrapper as DataTableProps } from './components/data-table';

// appBar
export { default as AppBar } from './components/app-bar';
// слоты appBar
export { Start, LinearNavigation, MobailBurger } from './components/app-bar';

// левая панелька как в vs code
export { default as LeftSideBar } from './components/nav-bars/left-nav';
export { default as LeftSideBarAndTool } from './components/nav-bars/tool-left';

// Акордеон нормальный
export { default as Accordion } from './components/accordion';
export type { AccordionProps } from './components/accordion';

// всплываюшие информационные окна
export { AlertProvider, useAlert } from './components/alert';
export type { AlertManagerProps } from './components/alert';

// иконки флажки
export { default as Flag } from './components/tools/flag';
// кнопка с поведением выпадаюшего списка
export { default as SelectButton } from './components/popup/select.button';

// выпадаюшее меню при наведении на элемент с кастомным содержимым
export { default as HoverPopover } from './components/popup/HoverPopover';
export type { HoverPopoverProps } from './components/popup/HoverPopover';

export { default as DomInspector } from './components/tools/inspector';