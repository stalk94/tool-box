import EventEmitter from "./emiter";

type ErrorRequest = {
    type: 'promise' | 'global' | 'react'
    name?: string
    message?: string
    position?: string
    source?: string
    stack?: string
    reason?: PromiseRejectionEvent.reason
    time: string
}

export interface APIEndpoints {
    'auth/login': { method: 'POST'; request: { login: string; password: string }; response: { token: string } };
    'auth/reg': { method: 'POST'; request: { login: string; password: string }; response: { token: string } };
    'error': { method: 'POST'; request: ErrorRequest; response: any };
}

export interface Events {
    error: (text: string)=> void
    success: (text: string)=> void
    warn: (text: string)=> void
    exit: (data?: any)=> void
}


declare global {
    var languages: ['GB', 'RU', 'CN', 'DE'];
    var lang: 'GB' | 'RU' | 'CN' | 'DE';
    var EventEmitter: EventEmitter
}