import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as reactDocgen from 'react-docgen';

export default function analyzePropsPlugin() {
	return {
		name: 'analyze-props',
		async transform(code, id) {

			if (!code) return;
			if (id.includes('.storybook') 
				|| id.includes('node_modules') 
				|| id.includes('_theme')
				|| id.includes('.stories')
				|| id.includes('button.tsx')
				|| id.includes('tools/icons.tsx')
				|| id.includes('app/plugins.ts')
			) {
				return;
			}
			if (!id.includes('/src/') && !id.endsWith('.jsx') && !id.endsWith('.tsx')) return;


			const propsInfo = [];

			// Парсим код с помощью babel-parser для TypeScript и JSX
			const ast = parser.parse(code, {
				sourceType: 'module',
				plugins: ['jsx', 'typescript'],
			});

			// Обрабатываем AST для извлечения PropTypes
			traverse(ast, {
				AssignmentExpression(path) {
					if (
						path.node.left.type === 'MemberExpression' &&
						path.node.left.property &&
						path.node.left.property.name === 'propTypes'
					) {
						const componentName = path.node.left.object.name;
						const propTypes = path.node.right.properties.map((prop) => {
							const propName = prop.key.name;
							const propValue = prop.value.callee?.name || 'undefined';
							return {
								component: componentName,
								propName,
								propValue,
							};
						});
						propsInfo.push(...propTypes);
					}
				},
			});

			// Обрабатываем TypeScript типы с помощью react-docgen
			if (id.endsWith('.tsx')) {
				try {
					const fileContent = fs.readFileSync(id, 'utf8');
					if (!fileContent.includes('export default') && !fileContent.includes('function ') && !fileContent.includes('const ')) {
						return; // Пропускаем файлы без компонентов
					}
					const parsedProps = reactDocgen.parse(fs.readFileSync(id, 'utf8'));

					Object.keys(parsedProps.props).forEach((propName) => {
						const prop = parsedProps.props[propName];
						const componentName = parsedProps.displayName || path.basename(id, '.tsx');
						const propValue = prop.type?.name || 'undefined';

						propsInfo.push({
							component: componentName,
							propName,
							propValue,
						});
					});
				} catch (err) {
					console.warn('Error parsing TypeScript with react-docgen', err);
				}
			}

			// Генерация отчета с пропсами
			const report = propsInfo
				.map((prop) => `Component: ${prop.component}, Prop: ${prop.propName}, Value: ${prop.propValue}`)
				.join('\n');
			console.log(report)
			// Записываем отчет в файл
			const reportFile = path.join(process.cwd(), 'props-report.txt');
			fs.appendFileSync(reportFile, report + '\n');

			return code;
		},
	};
}