import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Variable } from './extension/variable';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize, FontFamily } from './extension/fonts';
import Link from '@tiptap/extension-link';


export default [
    StarterKit.configure({
        strike: false,
    }),
    Variable,
    TextStyle,
    Color,
    Highlight,
    FontSize,
    FontFamily,
    Underline,
    Strike,
    Link.configure({
        openOnClick: false, // отключаем переход при клике в редакторе
        autolink: false,
        linkOnPaste: false,
    }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
];