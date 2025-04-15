import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertProvider, useAlert } from '../components/alert';
import { Button } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';


const meta: Meta<typeof AlertProvider> = {
    title: 'Module',
    component: AlertProvider,
    // tags: ["autodocs"],
    argTypes: {
       
    },
}


const TestComponent =()=> {
    const { addAlert } = useAlert();
    const { enqueueSnackbar } = useSnackbar();

    const randomVarriant = () => {
        const varrinats = ["success", "error", "warning", "info", "default"];
        return varrinats[Math.floor(Math.random() * varrinats.length)];
    }
    const randomText = () => {
        const words = [
            "Ошибка", "Успешно", "Действие", "Обновлено", "Предупреждение", "Критическая", 
            "Операция", "Выполнена", "Проблема", "Запущено", "Анализ", "Внимание", "Процесс", 
            "Ожидание", "Прервано", "Система", "Доступ", "Разрешено", "Ограничено", "Завершено", 
            "Неудача", "Обнаружено", "Требуется", "Проверка", "Перезапуск", "Результат", 
            "Конфигурация", "Сбой", "Инициализация", "Запрос", "Режим", "Соединение"
        ];

        return words[Math.floor(Math.random() * words.length)];
    }
    const useTextAllert =()=> {
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
        setInterval(()=> useTextAllert(), 2000);
        setInterval(()=> enqueueSnackbar(randomText(), { variant: randomVarriant() }), 2000)
    }, []);


    return (
        <div>
            <Button 
                color='success' 
                variant='outlined' 
                onClick={useTextAllert}
            >
                Add Alert
            </Button>
            <Button 
                color='info' 
                variant='outlined' 
                onClick={() => enqueueSnackbar(randomText(), { variant: 'success' })}
            >
                Add Snack
            </Button>
        </div>
    );
}
const Templates =(args)=> {
 
    return(
        <AlertProvider {...args}>
             <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                autoHideDuration={4000}
                preventDuplicate
            >
                <TestComponent />
            </SnackbarProvider>
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