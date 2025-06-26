import { LayoutCustom, LayoutOptionBlockData, ComponentSerrialize } from '../type';


export class ControllerGroup {
    options: LayoutOptionBlockData
    storage: Record<string, any> = {}
    name: string;
    private boundHandler: (data: any) => void;


    constructor(name: string, options: LayoutOptionBlockData) {
        this.options = options;
        this.name = name;

        this.boundHandler = this.handleEvent.bind(this);
        sharedEmmiter.on('event', this.boundHandler);
    }
    handleEvent(data: any) {
        if (data.dataGroup === this.name) {
            console.green('event: ', data);

            if (data.type === 'onChange' && data.name) {
                this.storage[data.name] = data.value;
            } 
            else if (data.type === 'onClick') {
                this.fetch();
            }
        }
    }
    async fetch() {
        if (!this.options.url) {
            console.error('not url api', this.storage);
            return;
        }

        const res = await fetch(this.options.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.storage)
        });
    }
    destroy() {
        sharedEmmiter.off('event', this.boundHandler);
    }
}


const registr = {
    groups: <Record<string, ControllerGroup>>{},

    init(name: string, cell: LayoutCustom) {
        const options = { ...cell?.props?.options };

        if (!registr.groups[name]) {
            registr.groups[name] = new ControllerGroup(name, options);
        }
    },
    destroy(name: string) {
        if (registr.groups[name]) {
            registr.groups[name].destroy();  // отписка
            delete registr.groups[name];
        }
    },
    clearAll() {
        Object.keys(registr.groups).forEach((name) => {
            registr.groups[name].destroy();
        });
        registr.groups = {};
    },
    inject(components: ComponentSerrialize[], cell: LayoutCustom) {
        return components.map((cmp, index) => {
            const copy = structuredClone(cmp);

            if (cell?.props?.type === 'form') {
                const group = cell?.props?.['data-group'] ?? cell.i;
                copy.props['data-group'] = group;
            }
            return copy;
        });
    }
}


export default registr;