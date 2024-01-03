import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    constructor() { }

    public set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    public get(key: string) {
        return localStorage.getItem(key);
    }

    public clear(key?: string) {
        if (key !== undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.clear();
        }
    }
}
