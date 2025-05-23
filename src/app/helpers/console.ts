declare global {
    interface Console {
        red: StyledConsole;
        green: StyledConsole;
        blue: StyledConsole;
        yellow: StyledConsole;
        gray: StyledConsole;
        bold: StyledConsole;
        sys: StyledConsole;
        api: StyledConsole;
    }

    type StyledConsole = {
        (...args: any[]): void;
        log: (...args: any[]) => void;
    };
}



function styleLog(style: string, prefix = '') {
    const fn = (...args: any[]) => {
        const { formatted, styles, rest } = prepareArgs(args, style, prefix);
        console.log(formatted, ...styles, ...rest);
    };

    fn.log = (...args: any[]) => {
        const { formatted, styles, rest } = prepareArgs(args, style, prefix);
        // Сохраняем call-site
        Function.prototype.apply.call(console.log, console, [formatted, ...styles, ...rest]);
    };

    return fn;
}

function prepareArgs(args: any[], style: string, prefix: string) {
    const formattedParts: string[] = [];
    const styles: string[] = [];
    const rest: any[] = [];

    for (const arg of args) {
        if (typeof arg === 'string' || typeof arg === 'number') {
            formattedParts.push(`%c${prefix}${arg}`);
            styles.push(style);
            prefix = ''; // только первый аргумент с префиксом
        } else {
            rest.push(arg);
        }
    }

    return {
        formatted: formattedParts.join(' '),
        styles,
        rest
    };
}

export default function extendConsole() {
    console.red = styleLog('color: red; font-weight: bold;', '❌ ');
    console.green = styleLog('color: green; font-weight: bold;', '✅ ');
    console.blue = styleLog('color: deepskyblue; font-weight: bold;', 'ℹ️ ');
    console.yellow = styleLog('color: orange; font-weight: bold;', '⚠️ ');
    console.gray = styleLog('color: gray;', '');
    console.bold = styleLog('font-weight: bold;', '');
    console.sys = styleLog('color: mediumpurple; font-weight: bold;', '⚙️ ');
    console.api = styleLog('color: teal; font-weight: bold;', '🔌 ');
}