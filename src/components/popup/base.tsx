import React, { useState, ReactNode, ReactElement } from "react";
import ItemsList, { NavLinkItem } from '../menu/list';
import { SelectMenu } from '../menu/atomize';



type CustomMenuProps = {
    children: ReactNode
    items: NavLinkItem[]
    /** ❔ слушатель срабатываюший при закрытии/открытии панели */
    onOpenClose?: (value: boolean)=> void
    /** 🔥 Функция которая ставит свойство(select: true) на выбранный элемент */
    onSelect?: (item: NavLinkItem)=> void
}



export default function({ children, items, onOpenClose, onSelect }: CustomMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);


    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        if(onOpenClose) onOpenClose(true);
    }
    const handleClose = () => {
        setAnchorEl(null);
        if(onOpenClose) onOpenClose(false);
    }
    // Проверяем, что children - это элемент, с которым можно работать
    const childWithProps = (React.isValidElement(children)
        ? React.cloneElement(children as ReactElement, {
            onClick: (event: React.MouseEvent<HTMLElement>) => {
                handleOpen(event);                                      // Открытие меню
                if ((children as ReactElement).props.onClick) {
                    (children as ReactElement).props.onClick(event);    // Вызов оригинального onClick
                }
            },
        })
        : children
    );


    return (
        <React.Fragment>
            {/* Обертываем переданный children с добавлением onClick */}
            { childWithProps }

            {/* Меню */}
            <SelectMenu
                anchorEl={anchorEl} 
                open={open} 
                handleClose={handleClose}
            >
                { items.map((item, index) => (
                    <ItemsList 
                        key={index}
                        item={item}
                        onItemClick={(item)=> { 
                            onSelect && onSelect(item);
                            handleClose(); 
                        }}
                    />
                ))}
            </SelectMenu>
        </React.Fragment>
    );
}