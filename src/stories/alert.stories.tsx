import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertProvider, useAlert } from '../components/alert';
import Buttons from '../components/button';


const meta: Meta<typeof AlertProvider> = {
    title: 'Module',
    component: AlertProvider,
    // tags: ["autodocs"],
    argTypes: {
       
    },
}


const TestComponent =()=> {
    const { addAlert } = useAlert();

    const useTextGet =()=> {
        const words = [
            "Ошибка", "Успешно", "Действие", "Обновлено", "Предупреждение", "Критическая", 
            "Операция", "Выполнена", "Проблема", "Запущено", "Анализ", "Внимание", "Процесс", 
            "Ожидание", "Прервано", "Система", "Доступ", "Разрешено", "Ограничено", "Завершено", 
            "Неудача", "Обнаружено", "Требуется", "Проверка", "Перезапуск", "Результат", 
            "Конфигурация", "Сбой", "Инициализация", "Запрос", "Режим", "Соединение"
        ];
        const arr = ['error', 'warning', 'success', 'info'];

        
        const length = Math.floor(Math.random() * (14 - 6 + 1)) + 6;
        const randomText = Array.from({ length }, ()=> 
            words[Math.floor(Math.random() * words.length)]
        ).join(" ");

        const type = arr[Math.floor(Math.random() * arr.length)];
        addAlert(type, randomText);
    }
    React.useEffect(()=> {
        setInterval(()=> useTextGet(), 2000);
    }, []);


    return (
        <div>
            <Buttons.Button 
                color='success' 
                variant='outlined' 
                onClick={useTextGet}
            >
                Add Alert
            </Buttons.Button>
        </div>
    );
}
const Templates =(args)=> {
 
    return(
        <AlertProvider {...args}>
            <TestComponent />
        </AlertProvider>
    );
}



type Story = StoryObj<typeof AlertProvider>;
export default meta;
export const AlarmManager: Story = {
    args: {
        
    },
    render: (props)=> <Templates {...props} />
}