import { Breadcrumbs, BreadcrumbsProps } from '@lib/index';
import React from 'react';

export default function BreadcrumbWrap(pathname = 'test/app', nameMap) {
    const handlePush = (href: string) => {
        // реализация маршрутизатора
        sharedEmmiter.emit('event', {
            path: href,
            type: 'navigation'
        });
    };

    return (
        <div
            style={{
                marginTop: '0px',
                marginLeft: '30px',
                width: '100%',
                display: 'block'
            }}
        >
            <Breadcrumbs
                nameMap={nameMap}
                pathname={pathname}
                separator={undefined}
                push={href => handlePush(href)}
                linkStyle={{}}
                Link={({ href, children }) => (
                    <div onClick={() => handlePush(href)}>{children}</div>
                )}
            />
        </div>
    );
}
