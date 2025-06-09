import { Mark, mergeAttributes } from '@tiptap/core';



declare module '@tiptap/core' {
    interface Commands<ReturnType = any> {
        fontSize: {
            setFontSize: (size: string) => ReturnType;
            unsetFontSize: () => ReturnType;
        };
    }
    interface Commands<ReturnType = any> {
        fontFamily: {
            setFontFamily: (font: string) => ReturnType;
            unsetFontFamily: () => ReturnType;
        };
  }
}



export const FontSize = Mark.create({
    name: 'fontSize',
    addAttributes() {
        return {
            size: {
                default: null,
                parseHTML: (el) => el.style.fontSize || null,
                renderHTML: (attrs) => {
                    if (!attrs.size) return {};
                    return { style: `font-size: ${attrs.size}` };
                },
            },
        };
    },

    parseHTML() {
        return [{ style: 'font-size' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes), 0];
    },

    addCommands() {
        return {
            setFontSize:
                (size) =>
                    ({ commands }) => {
                        return commands.setMark(this.name, { size });
                    },
            unsetFontSize:
                () =>
                    ({ commands }) => {
                        return commands.unsetMark(this.name);
                    },
        };
    },
});

export const FontFamily = Mark.create({
    name: 'fontFamily',
    addAttributes() {
        return {
            family: {
                default: null,
                parseHTML: (el) => el.style.fontFamily || null,
                renderHTML: (attrs) => {
                    if (!attrs.family) return {};
                    return { style: `font-family: ${attrs.family}` };
                },
            },
        };
    },

    parseHTML() {
        return [{ style: 'font-family' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes), 0];
    },

    addCommands() {
        return {
            setFontFamily:
                (family) =>
                    ({ commands }) => {
                        return commands.setMark(this.name, { family });
                    },
            unsetFontFamily:
                () =>
                    ({ commands }) => {
                        return commands.unsetMark(this.name);
                    },
        };
    },
});