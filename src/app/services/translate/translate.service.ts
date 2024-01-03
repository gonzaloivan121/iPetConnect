import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TranslateService {

    private data: any = {};
    private currentLanguage: string;

    constructor(private http: HttpClient) { }

    use(lang: string): Promise<{}> {
        this.currentLanguage = lang;

        return new Promise<{}>((resolve) => {
            const langPath = `./assets/i18n/${lang || 'gb'}.json`;

            this.http.get(langPath).subscribe(
                (response) => {
                    this.data = response || {};
                    resolve(this.data);
                }, (err) => {
                    this.data = {};
                    resolve(this.data);
                }
            );
        });
    }

    get(key: string) {
        return this.data[key] || key;
    }

    getCurrentLanguage(): string {
        return this.currentLanguage;
    }
}