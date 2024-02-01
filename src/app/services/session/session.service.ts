import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    constructor() { }

    public set(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    public get(key: string): string {
        return localStorage.getItem(key);
    }

    public clear(key?: string): void {
        if (key !== undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.clear();
        }
    }

    public exists(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
}
