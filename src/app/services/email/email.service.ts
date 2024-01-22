import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IEmail } from 'src/app/interfaces';

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    constructor(private http: HttpClient) {}

    private async post(url: string, data: IEmail) {
        const token = "";

        const result = this.http.post(url, data,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
                responseType: "json",
                observe: "body"
            }
        );
        return new Promise((resolve, reject) => {
            result.subscribe(resolve, reject);
        })
    }

    Send(data: IEmail) {
        return this.post(`${environment.serverUrl}/email/send`, data);
    }
}
