import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    constructor() { }

    public set(key, value) {
        localStorage.setItem(key, value);
    }

    public get(key) {
        return localStorage.getItem(key);
    }

    public clear() {
        localStorage.clear();
    }
}
