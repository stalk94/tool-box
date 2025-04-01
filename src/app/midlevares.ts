

export function transformRouter(linkItems, handlerClick) {
    const func =(items, parent?: string)=> {
        return items.map((elem, index)=> {
            if(!parent) elem.path = '/' + elem.id;
            else elem.path = parent + '/' + elem.id;

            elem.comand =()=> handlerClick(elem);

            if(elem.children) {
                func(elem.children, elem.path);
            }

            return elem;
        });
    }

    const result = func(linkItems);
    return result;
}