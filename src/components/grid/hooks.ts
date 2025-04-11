

// поиск в DOM компонента
export const selectContentFromDataId = (dataId: number) => {
    const element = document.querySelector(`[data-id="${dataId}"]`);
    const bound = element.getBoundingClientRect();

}