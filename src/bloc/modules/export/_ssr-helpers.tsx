type JSONContent = {
	type: string;
	attrs?: Record<string, any>;
	content?: JSONContent[];
	marks?: { type: string; attrs?: any }[];
	text?: string;
};

function renderMarks(text: string, marks?: JSONContent['marks']) {
	if (!marks) return text;

	return marks.reduce((acc, mark) => {
		if (mark.type === 'bold') return `<strong>${acc}</strong>`;
		if (mark.type === 'italic') return `<em>${acc}</em>`;
		if (mark.type === 'link') return `<a href="${mark.attrs?.href}">${acc}</a>`;
		return acc;
	}, text);
}
export function renderJsonToHtml(json: JSONContent): string {
	if ('text' in json) {
		return renderMarks(json.text ?? '', json.marks);
	}

	const inner = (json.content || []).map(renderJsonToHtml).join('');

	switch (json.type) {
		case 'paragraph':
			return `<p>${inner}</p>`;
		case 'heading':
			const level = json.attrs?.level ?? 1;
			return `<h${level}>${inner}</h${level}>`;
		case 'bulletList':
			return `<ul>${inner}</ul>`;
		case 'orderedList':
			return `<ol>${inner}</ol>`;
		case 'listItem':
			return `<li>${inner}</li>`;
		case 'text':
			return inner;
		case 'hardBreak':
			return `<br/>`;
		default:
			return inner; // если неизвестный тип — пропускаем обёртку
	}
}

export function toJsx(json: JSONContent|string|undefined|null) {
	const rendeHtml =(value: JSONContent)=> {
		const result = renderJsonToHtml(value);
		const match = result.match(/^<p([^>]*)>([\s\S]*)<\/p>$/);
		
		if (match) {
			const attrs = match[1];                     // всё после <p
			const content = match[2];                   // внутренний HTML
			return `<div ${attrs}>${content}</div>`;
		}

		return  result;
	}

	if(typeof json === 'object') {
		const html = rendeHtml(json);
		return <div dangerouslySetInnerHTML={{ __html: html }} />;
	}
	else return json;
}