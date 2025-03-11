import React from "react";
import { send } from "../lib/engine";


class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error: Error, errorInfo: any) {
        //console.error("Ошибка в react:", error, errorInfo.componentStack);
        const data = {
            name: error.name,
            message: error.message,
            stack: errorInfo.componentStack
        }
        
        send('error', { time: new Date().toUTCString(), type: 'react', ...data }, 'POST');
    }

    render() {
        if(this.state.hasError) {
            return(
                <div style={{margin:'auto', display:'flex', flexDirection:'column'}}>
                    <h1 style={{color: 'red'}}>
                        Упс. Что-то пошло не так...
                    </h1>
                    <h3 style={{color: 'orange'}}>
                        ↻ Перезагрузите страницу
                    </h3>
                </div>
            );
        }
        return this.props.children;
    }
}


export default ErrorBoundary;