/**
 *   const dragableOnStop = (component: Component, cellId: string, data: DraggableData) => {
        const element = document.querySelector(`[data-id="${cellId}"]`);

        if (element) {
            const parentWidth = element.offsetWidth;
            const parentHeight = element.offsetHeight;
            const relativeX = parentWidth > 0 ? data.x / parentWidth : 0;
            const relativeY = parentHeight > 0 ? data.y / parentHeight : 0;
            const propsData = {
                'data-relative-offset': { x: relativeX, y: relativeY },
                'data-offset': { x: data.x, y: data.y }
            }

            updateComponentProps({
                component,
                data: propsData,
                cellId,
                cellsCache,
                setRender,
                rerender: false
            });
        }
    }

 *  <div
                        data-id={layer.i}
                        onClick={(e) => onSelectCell(layer, e.currentTarget)}
                        key={layer.i}
                        style={{
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: "center",
                            border: `1px dashed ${curCell.get()?.i === layer.i ? '#8ffb50b5' : '#fb505055'}`,
                            background: curCell.get()?.i === layer.i && 'rgba(147, 243, 68, 0.003)'
                        }}
                    >
                        {Array.isArray(layer.content) && layer.content.map((component, index) => (
                            <DraggableElement
                                key={index}
                                cellId={layer.i}
                                component={component}
                                index={index}
                                useStop={(component, data) => dragableOnStop(component, layer.i, data)}
                                useDelete={removeComponentFromCell}
                            />
                        ))}
                    </div>
 */