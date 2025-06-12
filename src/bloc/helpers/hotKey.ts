import { ComponentSerrialize } from '../type';
import { updateComponentProps } from './updateComponentProps';
import { settingsSlice, infoSlice } from "../context";


export function setPadding(side: 'Top'|'Left'|'Right', component: ComponentSerrialize, direction: 'increment' | 'decrement') {
	const step = settingsSlice.panel.stepPosition.get();
    const clone = structuredClone(component);
	const style = clone.props.style ?? {};
	const key = `margin${side}` as keyof React.CSSProperties;

	const raw = style[key];
	let current = 0;
    let usePercent = false;

	if (typeof raw === 'string') {
		usePercent = raw.trim().endsWith('%');
		current = parseFloat(raw);
	}
    else if (typeof raw === 'number') {
		if(component.props.fullWidth) current = 0;
		else current = raw;
	}
	
	// сделать множитель incr/decr
	const next = direction === 'increment' ? current + step : current - step;
	style[key] = component.props.fullWidth ? `${next}%` : next;

	clone.props.style = style;
	infoSlice.select.content.set(clone);
	
	updateComponentProps({
        component: component,
        data: { style: style }
    });
}