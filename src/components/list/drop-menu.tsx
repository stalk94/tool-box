import type { DropMenuProps } from './type';



export default function Menu({ style, onSelect, items, onlyId, ...props }: DropMenuProps) {
    return(
        <ul
            className={`
                dropdown 
                menu
                shadow-sm
                bg-[var(--color-base-400)]
                max-h-60 
                overflow-y-auto 
                z-[9999]
            `}
            style={style}
            { ...props }
        >
            {items.map((item, index) => (
                <li
                    key={item.id ?? index}
                    style={{ padding: 0 }}
                >
                    <span 
                        style={{ borderRadius:0 }}
                        className={`
                            text-neutral-200 
                            border-b-1 
                            border-b-neutral-800
                            hover:bg-neutral-600
                        `}
                        onClick={(e)=> onSelect?.(onlyId ? (item.id ?? item) : item)}
                    >
                        { item?.label 
                            ? item.label
                            : item
                        }
                    </span>
                </li>
            ))}
        </ul>
    );
}