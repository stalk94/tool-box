import { Project, ts, SyntaxKind } from 'ts-morph';
import path from 'path';

const clean = (val) => val.replace(/^['"]|['"]$/g, '');

function resolveTypeRecursively(type, depth = 0) {
	if (depth > 10) return { type: 'TooDeep', possibleValues: [] };

	if (type.isStringLiteral()) {
		return { type: 'string', possibleValues: [clean(type.getText())] };
	}

	if (type.isUnion()) {
		const unionTypes = type.getUnionTypes().map(t => resolveTypeRecursively(t, depth + 1));
		return {
			type: [...new Set(unionTypes.map(t => t.type))],
			possibleValues: [...new Set(unionTypes.flatMap(t => t.possibleValues || []))],
		};
	}

	if (type.isIntersection()) {
		const intersected = type.getIntersectionTypes().map(t => resolveTypeRecursively(t, depth + 1));
		return {
			type: intersected.map(t => t.type),
			children: intersected.flatMap(t => t.children || []),
			possibleValues: [],
		};
	}

	const symbol = type.getSymbol() || type.getAliasSymbol?.();
	if (symbol) {
		const decls = symbol.getDeclarations();
		const text = type.getText();

		if (/^Partial<.*>$/.test(text) || /^Pick<.*>$/.test(text) || /^Omit<.*>$/.test(text)) {
			const inner = type.getAliasTypeArguments()?.[0];
			if (inner) return resolveTypeRecursively(inner, depth + 1);
		}

		if (decls.length > 0) {
			const decl = decls[0];
			const targetType = decl.getType?.() ?? type;

			if (targetType.getProperties().length > 0) {
				const children = targetType.getProperties().map((p) => {
					const decls = p.getDeclarations();
					const decl = decls[0];
					if (!decl) return { name: p.getName(), type: 'unknown', possibleValues: [] };

					const subType = p.getTypeAtLocation(decl);
					const resolved = resolveTypeRecursively(subType, depth + 1);

					return {
						name: p.getName(),
						type: resolved.type,
						possibleValues: resolved.possibleValues,
						...(resolved.children ? { children: resolved.children } : {}),
					};
				});

				return { type: 'object', children, possibleValues: [] };
			}
		}
	}

	return { type: clean(type.getText()), possibleValues: [] };
}
function findImportPath(sourceFile, componentName) {
	const imports = sourceFile.getImportDeclarations();

	for (const imp of imports) {
		const defaultImport = imp.getDefaultImport()?.getText();
		const namedImports = imp.getNamedImports();
		const namespaceImport = imp.getNamespaceImport()?.getText();
		const modulePath = imp.getModuleSpecifierValue();

		if (defaultImport === componentName) {
			return { modulePath, importDeclaration: imp, type: 'default' };
		}

		for (const named of namedImports) {
			const name = named.getName();
			const alias = named.getAliasNode()?.getText();
			if (name === componentName || alias === componentName) {
				return { modulePath, importDeclaration: imp, type: 'named' };
			}
		}

		if (namespaceImport && componentName.startsWith(namespaceImport + ".")) {
			return { modulePath, importDeclaration: imp, type: 'namespace' };
		}
	}

	return null;
}


export default function parseComponentProps(pathFile, componentName) {
	const tsConfigPath = path.resolve('tsconfig.json');
	const project = new Project({ tsConfigFilePath: tsConfigPath });
	let sourceFile = project.getSourceFile(pathFile);

	if (!sourceFile) {
		throw new Error(`File not found: ${pathFile}`);
	}

	let exportSymbol;

	if (componentName) {
		// ищем импорт
		const importData = findImportPath(sourceFile, componentName);
		if (!importData) throw new Error(`Component "${componentName}" not found or not imported.`);

		const importedSourceFile = importData.importDeclaration.getModuleSpecifierSourceFile();
		if (!importedSourceFile) {
			throw new Error(`Failed to resolve source file for import "${importData.modulePath}"`);
		}

		sourceFile = importedSourceFile;

		if (importData.type === 'default') {
			exportSymbol = sourceFile.getDefaultExportSymbol();
		} else if (importData.type === 'named') {
			exportSymbol = sourceFile.getExportSymbols().find(s => s.getName() === componentName);
		}

		if (!exportSymbol) throw new Error(`Export "${componentName}" not found in module.`);
	} 
	else {
		exportSymbol = sourceFile.getDefaultExportSymbol();
		if (!exportSymbol) throw new Error('Default export not found.');
	}

	const declarations = exportSymbol.getDeclarations();
	const componentType = declarations[0]?.getType();
	if (!componentType) throw new Error('Failed to get component type');

	const callSig = componentType.getCallSignatures()?.[0];
	if (!callSig) throw new Error('Component is not callable (no call signature)');

	const propsParam = callSig.getParameters()?.[0];
	if (!propsParam) throw new Error('Component does not take props');

	const propsType = propsParam.getTypeAtLocation(sourceFile);

	return propsType.getProperties().map((prop) => {
		const name = prop.getName();
		const decls = prop.getDeclarations();
		if (!decls.length) return null;

		const decl = decls[0];
		const type = prop.getTypeAtLocation(decl);
		const resolved = resolveTypeRecursively(type);

		return {
			name,
			type: resolved.type,
			possibleValues: resolved.possibleValues,
			...(resolved.children ? { children: resolved.children } : {}),
		};
	}).filter(Boolean);
}

/**
 * export default function (path, tsConfigPath = '../../tsconfig.json', componentName) {
	const project = new Project({ tsConfigFilePath: tsConfigPath });
	const sourceFile = project.getSourceFileOrThrow(path);
	const defaultType = findDefaultExportedType(sourceFile);

	// Находим prop-тип (например, FC<Props>)
	const propsType = defaultType.getCallSignatures()?.[0]?.getParameters()?.[0]?.getTypeAtLocation(sourceFile);
	if (!propsType) throw new Error('Не удалось найти тип пропсов');

	const result = propsType.getProperties().map((prop) => {
		const name = prop.getName();
		const decls = prop.getDeclarations();
		if (!decls.length) return null;

		const decl = decls[0];
		const type = prop.getTypeAtLocation(decl);
		const resolved = resolveTypeRecursively(type);

		return {
			name,
			type: resolved.type,
			possibleValues: resolved.possibleValues,
			...(resolved.children ? { children: resolved.children } : {}),
		};
	}).filter(Boolean);

	return result;
}
 */