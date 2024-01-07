import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: "root",
})
export class DataService {
    constructor(private http: HttpClient) {}

    private async request(method: string, url: string, data?: any) {
        const token = "";

        const result = this.http.request(method, url, {
            body: data,
            responseType: "json",
            observe: "body",
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return new Promise((resolve, reject) => {
            result.subscribe(resolve, reject);
        });
    }

    get(table: string, id?: number) {
        let url: string = id
            ? `${environment.serverUrl}/${table}/${id}`
            : `${environment.serverUrl}/${table}`;
        return this.request("GET", url);
    }

    getFrom(table: string, fromTable: string, id: number) {
        let url: string = `${environment.serverUrl}/${table}/${fromTable}/${id}`;
        return this.request("GET", url);
    }

    getExcluding(table: string, id: number) {
        let url: string = `${environment.serverUrl}/${table}/excluding/${id}`;
        return this.request("GET", url);
    }

    getFromExcluding(
        table: string,
        fromTable: string,
        id: number,
        excludeId: number
    ) {
        let url: string = `${environment.serverUrl}/${table}/${fromTable}/${id}/excluding/${excludeId}`;
        return this.request("GET", url);
    }

    insert(table: string, data: any) {
        let url: string = `${environment.serverUrl}/${table}`;
        return this.request("POST", url, data);
    }

    update(table: string, data: any) {
        let url: string = `${environment.serverUrl}/${table}/${data.id}`;
        return this.request("PUT", url, data);
    }

    updateForUser(table: string, user_id: number, data: any) {
        let url: string = `${environment.serverUrl}/${table}/user/${user_id}`;
        return this.request("PUT", url, data);
    }

    delete(table: string, data: any) {
        let url: string = `${environment.serverUrl}/${table}/${data.id}`;
        return this.request("DELETE", url);
    }

    login(data: any) {
        let url: string = `${environment.serverUrl}/user/login`;
        return this.request("POST", url, data);
    }

    password(data: any) {
        let url: string = `${environment.serverUrl}/user/password`;
        return this.request("POST", url, data);
    }
}
