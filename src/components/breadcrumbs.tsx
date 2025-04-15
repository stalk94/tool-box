import React from 'react';
import { Breadcrumbs, Typography, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export type Breadcrumb = {
    label: string;
    href: string;
    isLast: boolean;
}
export type Options = {
    /** Карта человекочитаемых названий */
    nameMap?: Record<string, string>;
    /** Исключить сегменты (например, 'edit', 'id') */
    exclude?: string[];
    /** Начальный сегмент */
    base?: { label: string; href: string };
}
export type BreadcrumbsNavProps = {
    pathname: string
    push: (href: string) => void
    nameMap?: Record<string, string>
    separator?: string | React.ReactNode
    Link: React.ComponentType<{ href: string; children: React.ReactNode }>
}

export function useBreadcrumbs(pathname: string, options?: Options): Breadcrumb[] {
    const { nameMap = {}, exclude = [], base } = options || {};

    return React.useMemo(() => {
        const segments = pathname.split('/').filter(Boolean).filter(seg => !exclude.includes(seg));

        const crumbs: Breadcrumb[] = segments.map((seg, i) => {
            const href = '/' + segments.slice(0, i + 1).join('/');
            const label = nameMap[seg] || decodeURIComponent(seg).replace(/[-_]/g, ' ');
            return {
                label,
                href,
                isLast: i === segments.length - 1,
            };
        });

        if (base) {
            return [{ ...base, isLast: false }, ...crumbs];
        }

        return crumbs;
    }, [pathname, nameMap, exclude, base]);
}


export default function BreadcrumbsNav({ pathname, push, Link, separator, nameMap }: BreadcrumbsNavProps) {
    const isMobile = useMediaQuery('(max-width:600px)');

    const crumbs = useBreadcrumbs(pathname, {
        nameMap,
        base: { label: 'Главная', href: '/' },
    });
    const commonSx = (isLast: boolean) => ({
        textTransform: 'capitalize',
        fontSize: 14,
        fontWeight: isLast ? 500 : 400,
        opacity: isLast ? 1 : 0.7,
    });

    if (isMobile) {
        const current = crumbs.at(-1);
        const previous = crumbs.at(-2) || crumbs[0];

        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                    cursor: 'pointer',
                }}
                onClick={() => push(previous?.href || '/')}
            >
                <ArrowBackIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    { current?.label }
                </Typography>
            </div>
        );
    }

    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            separator={separator}
            sx={{ m: 1 }}
        >
            { crumbs.map((segment) =>
                segment.isLast ? (
                    <Typography
                        key={segment.href}
                        color="text.primary"
                        sx={commonSx(true)}
                    >
                        { segment.label }
                    </Typography>
                ) : (
                    <Link key={segment.href} href={segment.href}>
                        <Typography sx={commonSx(false)}>
                            { segment.label }
                        </Typography>
                    </Link>
                )
            )}
        </Breadcrumbs>
    );
}