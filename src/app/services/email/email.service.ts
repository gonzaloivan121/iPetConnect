import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface IEmail {
    email: string;
    name: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    constructor(private http: HttpClient) {}

    private async post(url: string, data: IEmail) {
        const token = '';

        const result = this.http.post(url, {
            body: data,
            responseType: 'json',
            observe: 'body',
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
        return new Promise((resolve, reject) => {
            result.subscribe(resolve, reject);
        })
    }

    Send(data: IEmail) {
        return this.post(`${environment.serverUrl}/email/send`, data);
    }
}
