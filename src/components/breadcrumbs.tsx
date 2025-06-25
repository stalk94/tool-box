import React from 'react';
import { Breadcrumbs, Typography, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Home } from '@mui/icons-material';


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
    isMobile?: boolean
    pathname: string
    push: (href: string) => void
    nameMap?: Record<string, string>
    separator?: string | React.ReactNode
    linkStyle?: React.CSSProperties
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


export default function BreadcrumbsNav({ pathname, push, Link, separator, nameMap, linkStyle, isMobile }: BreadcrumbsNavProps) {
    const isMounted = React.useRef(false);
    const parentRef = React.useRef<HTMLDivElement>(null);
    const itemRefs = React.useRef<HTMLSpanElement[]>([]);
    const [collapsed, setCollapsed] = React.useState(false);
    
    const commonSx = (isLast: boolean) => ({
        textTransform: 'capitalize',
        fontWeight: isLast ? 500 : 400,
        opacity: isLast ? 0.7 : 1,
        ...linkStyle
    });
    const crumbs = useBreadcrumbs(pathname, {
        nameMap,
        base: { 
            label: (
                <Home 
                    sx={{
                        ...commonSx(false), 
                        fontSize: linkStyle.fontSize + 6
                    }} 
                />
            ),
            href: '/' 
        },
    });

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        if(isMounted.current) {
            const checkOverflow = () => {
                if (!parentRef.current) return;
                const el = parentRef.current;
                const totalItemsWidth = itemRefs.current.reduce((sum, item) => {
                    return sum + (item?.getBoundingClientRect().width ?? 0) + (5+14);
                }, 0);
                setCollapsed(el.offsetWidth < totalItemsWidth);
            }

            const observer = new ResizeObserver(checkOverflow);
            if (parentRef.current) observer.observe(parentRef.current);

            // также на инициализацию
            checkOverflow();

            return () => observer.disconnect();
        }
        else if(!isMounted.current) {
            isMounted.current = true;
        }
    }, []);
    if (isMobile || collapsed) {
        const current = crumbs.at(-1);
        const previous = crumbs.at(-2) || crumbs[0];

        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    margin: 8,
                    cursor: 'pointer',
                }}
                onClick={() => push(previous?.href || '/')}
            >
                <ArrowBackIcon fontSize="small" />
                <Typography 
                    sx={commonSx(true)}
                >
                    { current?.label }
                </Typography>
            </div>
        );
    }
    

    return (
        <Breadcrumbs
            ref={parentRef}
            aria-label="breadcrumb"
            separator={separator}
            sx={{ 
                m: 1,
                my: 0.5,
                '& .MuiBreadcrumbs-separator': {
                    opacity: 0.7
                },
            }}
        >
            { crumbs.map((segment, index) =>
                segment.isLast ? (
                    <Typography
                        ref={(el) => (itemRefs.current[index] = el!)}
                        key={segment.href}
                        sx={{
                            color: "text.secondary",
                            ...commonSx(true)
                        }}
                    >
                        { segment.label }
                    </Typography>
                ) : (
                        <Link key={segment.href} href={segment.href}>
                            <Typography
                                sx={{
                                    color: 'text.primary',
                                    ...commonSx(false),
                                    '&:hover': {
                                        cursor: 'pointer',
                                        opacity: 0.7
                                    },
                                }}
                                ref={(el) => (itemRefs.current[index] = el!)}
                            >
                                { segment.label }
                            </Typography>
                        </Link>
                )
            )}
        </Breadcrumbs>
    );
}