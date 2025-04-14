import React from 'react';
import { Box } from '@mui/material';


type FixedSlideProps = {
	width?: string | number;
	height: string | number;
	children: React.ReactNode;
}


export default function FixedSlide({ width = '100%', height, children }: FixedSlideProps) {
	return (
		<Box
			sx={{
				width,
				height,
				boxSizing: 'border-box',
				overflow: 'hidden',
				display: 'flex !important',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Box
				sx={{
					maxWidth: '100%',
					maxHeight: '100%',
					width: '100%',
					height: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{children}
			</Box>
		</Box>
	);
}


/**
 * <Box
			sx={{
				width,
				height,
				boxSizing: 'border-box',
				overflow: 'hidden',
				display: 'flex !important',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{ children }
		</Box>
 */