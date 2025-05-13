import { Box } from '@mui/material';
import { AppBar, LinearNavigation, MobailBurger, Start } from '@lib/index';
import React from 'react';

export default function HeaderBar(linkItems = [{ id: 'test', label: 'test' }]) {
    // реализация функции клика по элементу навигации
    const handlerClickNavigation = (path: string) => {
        sharedEmmiter.emit('event', {
            path: path,
            type: 'navigation'
        });
    };
    const transformUseRouter = () => {
        const func = (items, parent?: string) => {
            return items.map((elem, index) => {
                if (!parent) elem.path = '/' + elem.id;
                else elem.path = parent + '/' + elem.id;

                elem.comand = () => handlerClickNavigation(elem.path);

                if (elem.children) {
                    func(elem.children, elem.path);
                }

                return elem;
            });
        };

        const result = func(linkItems ?? []);
        return result;
    };

    return (
        <AppBar
            style={{}}
            elevation={1}
            height={40}
            start={
                <Start>
                    <Box
                        component="img"
                        src={
                            'https://arenadata.tech/wp-content/uploads/2024/10/logo-white-short.png'
                        }
                        alt="Logo"
                        sx={{
                            maxHeight: '40px',
                            padding: '5px',
                            objectFit: 'contain',
                            borderRadius: '3px'
                        }}
                    />
                </Start>
            }
            center={<LinearNavigation sx={{}} items={transformUseRouter()} />}
            end={
                <React.Fragment>
                    <MobailBurger items={transformUseRouter()} />

                    {/** секция доп элементов */}
                </React.Fragment>
            }
        />
    );
}
