import React from "react";

type MutatorsProps = {
    children: React.ReactNode
    /** имена компонентов к которым добавятся пропсы */
    types?: string[] | 'html'
    /** обьект с полями пропс для компонентов */
    props?: Record<string, any>
}



/**
 * Добавляет либо изменяет пропсы у children
 * @example 
 *  <Mutators 
 *     types={['p']}
 *     props={{ 
 *        test: 1, 
 *        style: {color: 'red'},
 *     }}
 *   >
 *     { children }
 *  </Mutators>
 */
export function Mutators({ children, types, props }: MutatorsProps) {
    const useReplaceProps =()=> {
        const finder =(child)=> {
            let result = false;

            if(child?.type?.render) {
                const name: string = child?.type?.render.name;

                if(name && Array.isArray(types)) {
                    types.forEach((elem)=> {
                        if(name.includes(elem)) {
                            result = true;
                        }
                    });
                }
            }

            return result;
        }
        const consolidate =(child)=> {
            const result = {};

            Object.keys(props).map((name)=> {
                if(child.props[name]) {
                    if(typeof child.props[name] === 'object'){
                        result[name] = {...child.props[name], ...props[name]};
                    }
                }
                else result[name] = props[name];
            });

            return React.cloneElement(child, result);
        }
        
        return React.Children.map(children, (child)=> {
            if (React.isValidElement(child)) {
                // для всех элементов
                if(types === undefined) {
                    return consolidate(child);
                }
                // для всех html элементов
                else if(types === 'html' && typeof child.type === 'string') {
                    return consolidate(child);
                }
                // для реакт элементов
                else if(Array.isArray(types)) {
                    if (typeof child.type === 'string' && types.includes(child.type)) {
                        return consolidate(child);
                    }
                    else if(finder(child)) {
                        return consolidate(child);
                    }
                    else if(child.type?.name && types.includes(child.type?.name)) {
                        return consolidate(child);
                    }
                    else return child;
                }
                else return child;
            }
        });
    }
    

    return useReplaceProps();
}