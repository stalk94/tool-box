import React from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import BreadcrumbsNav from '../../components/breadcrumbs'



export function BreadcrumbsReactRouterAdapter(props: { nameMap?: Record<string, string> }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    return (
        <BreadcrumbsNav
            pathname={pathname}
            push={navigate}
            nameMap={props.nameMap}
            separator={<span style={{ color: '#999' }}>•</span>}
            Link={({ href, children }) => (
                <RouterLink to={href} style={{ textDecoration: 'none' }}>
                    { children }
                </RouterLink>
            )}
        />
    );
}