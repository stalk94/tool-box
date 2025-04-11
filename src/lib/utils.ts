

/**
 * из коофициента относительного смешения расчитает абсолютное			
 * * `dataRelative: {x: 0.1, y: 0.1}`
 */
export const getAbsoluteOffset = (dataRelative: {x:number,y:number}, container: Element) => {
	const relativeOffset = (dataRelative.x && dataRelative.y) ? dataRelative : { x: 0, y: 0 }; 
	
	if(container) {
		const currentCellWidth = container?.offsetWidth;
		const currentCellHeight = container?.offsetHeight;
	   
		const defaultX = relativeOffset.x * currentCellWidth;
		const defaultY = relativeOffset.y * currentCellHeight;

		return {x: Math.round(defaultX), y: Math.round(defaultY)}
	}
}
/**
 * 	Высчитывает коофициент относительного смешения относительно своего контейнера    
 * 	`dataRelative: {x: 420, y: 1000}`
 */
export const getRelativeOffset = (dataAbsolute: {x:number,y:number}, container: Element) => {
	if(container) {
		const parentWidth = container?.offsetWidth;
    	const parentHeight = container?.offsetHeight;
    	const relativeX = parentWidth > 0 ? dataAbsolute.x / parentWidth : 0;
    	const relativeY = parentHeight > 0 ? dataAbsolute.y / parentHeight : 0;

		return {
			x: relativeX,
			y: relativeY
		}
	}
}



export function getDateString() {
	const date = new Date();

	const day = date.getDate(); // День месяца (1–31)
	const month = date.getMonth() + 1; // Месяц (0–11, поэтому +1)
	const year = date.getFullYear(); // Год

	const hours = date.getHours(); // Часы (0–23)
	const minutes = date.getMinutes(); // Минуты
	const seconds = date.getSeconds(); // Секунды

	// Форматируем в строку
	const d = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
	const t = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

	return ({
		date: d,
		time: t
	});
}