import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NextLink from 'next/link';
import BreadcrumbsNav from '../../components/breadcrumbs';



export function BreadcrumbsNextAdapter(props: { nameMap?: Record<string, string> }) {
	const pathname = usePathname();
	const router = useRouter();


	return (
		<BreadcrumbsNav
			pathname={pathname}
			push={router.push}
			nameMap={props.nameMap}
			separator={<span style={{ color: '#999' }}>•</span>}
			Link={({ href, children }) => (
				<NextLink href={href} style={{ textDecoration: 'none' }}>
					{ children }
				</NextLink>
			)}
		/>
	);
}