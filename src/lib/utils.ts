


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