import { ComponentSerrialize } from '../type';
import { updateComponentProps } from './updateComponentProps';
import { settingsSlice, infoSlice } from "../context";



export function setPadding(side: 'Top'|'Left'|'Right', component: ComponentSerrialize, direction: 'increment' | 'decrement') {
	const step = settingsSlice.panel.stepSize.get();
    const clone = structuredClone(component);
	const style = clone.props.style ?? {};
	const key = `margin${side}` as keyof React.CSSProperties;
	const reverseSideMap: Record<typeof side, 'Top' | 'Left' | 'Right'> = {
        Top: 'Top', // если добавишь Bottom — можно расширить
        Left: 'Right',
        Right: 'Left',
    };
    const reverseSide = reverseSideMap[side];
    const reverseKey = `margin${reverseSide}` as keyof React.CSSProperties;

	const raw = style[key];
	let current = 0;
    let usePercent = false;
	
	if (typeof raw === 'string') {
		usePercent = raw.trim().endsWith('%');
		current = parseFloat(raw);
	}
    else if (typeof raw === 'number') {
		if (component.props.fullWidth) current = 0;
		else current = raw;
	}
	if (component.props.fullWidth) usePercent = true;
		
	
	let next = direction === 'increment' ? current + step : current - step;
	delete style[key];
	delete style[reverseKey];

	if (next < 0) {
		if (side === 'Top') next = 0;
		// 🔁 Реверс направления и стороны
		else return setPadding(reverseSide, component, direction === 'increment' ? 'decrement' : 'increment');
	}
	
	style[key] = usePercent ? `${next}%` : next;
	clone.props.style = style;
	infoSlice.select.content.set(clone);
	
	updateComponentProps({
        component: component,
        data: { style: style },
		undo: true
    });
}