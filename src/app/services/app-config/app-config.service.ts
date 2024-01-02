import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/interfaces';

@Injectable({ providedIn: 'root' })
export class AppConfigService {

    data: AppConfig = {};

    constructor(private http: HttpClient) { }

    load(defaults?: AppConfig): Promise<AppConfig> {
        return new Promise<AppConfig>((resolve) => {
            this.http.get('./assets/config/app.config.json').subscribe(
                (response) => {
                    console.log('using server-side configuration');
                    this.data = Object.assign({}, defaults || {}, response || {});
                    resolve(this.data);
                },
                () => {
                    console.log('using default configuration');
                    this.data = Object.assign({}, defaults || {});
                    resolve(this.data);
                }
            );
        });
    }

    write(key: string, value: any) {
        this.data[key] = value;
    }

    get(key: string) {
        return this.data[key] || key;
    }
}
