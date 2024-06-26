import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class BadWordsService {
    private dataByLocale: {} = {};
    private data: string[] = [];
    private locales: string[];

    constructor(private http: HttpClient) {}

    public setup(): Promise<{}> {
        return new Promise<{}>((resolve) => {
            const badWordsPath = "./assets/bad-words/bad-words.json";

            this.http.get(badWordsPath).subscribe(
                (response: {}) => {
                    this.dataByLocale = response || {};
                    this.locales = Object.keys(this.dataByLocale);
                    for (let i = 0; i < this.locales.length; i++) {
                        const locale = this.locales[i];
                        for (let j = 0; j < this.dataByLocale[locale].length; j++) {
                            const word = this.dataByLocale[locale][j];
                            this.data.push(word);
                        }
                    }

                    resolve(this.dataByLocale);
                },
                (err) => {
                    this.dataByLocale = {};
                    this.locales = Object.keys(this.dataByLocale);
                    resolve(this.dataByLocale);
                }
            );
        });
    }

    private clean(text: string): string {
        return text.toLowerCase().replace(/[\s+]+/g, " ");
    }

    private tokenize(text: string): string[] {
        const withPunctuation = text.replace("/ {2,}/", " ").split(" ");
        const withoutPunctuation = text
            .replace(/[^\w\s]/g, "")
            .replace("/ {2,}/", " ")
            .split(" ");

        return withPunctuation.concat(withoutPunctuation);
    }

    private cleanAndTokenize(text: string): string[] {
        return this.tokenize(this.clean(text));
    }

    public supported(): string[] {
        return this.locales;
    }

    public words(locale: string): string[] {
        return this.dataByLocale[locale];
    }

    public check(text: string): boolean {
        const tokens: string[] = this.cleanAndTokenize(text);

        let result: boolean = false;

        for (let i in tokens) {
            for (let j = 0; j < this.data.length; j++) {
                const word = this.data[j];
                if (word.toLowerCase() === tokens[i]) {
                    result = true;
                    break;
                }
            }
        }

        return result;
    }

    public checkByLocale(locale: string, text: string): boolean {
        let result: boolean = false;

        if (typeof this.dataByLocale[locale] === "undefined") {
            return result;
        }

        const tokens: string[] = this.cleanAndTokenize(text);

        for (let i in tokens) {
            for (let j = 0; j < this.dataByLocale[locale]; j++) {
                const word = this.dataByLocale[locale][j];
                if (word.toLowerCase() === tokens[i]) {
                    result = true;
                    break;
                }
            }
        }

        return result;
    }

    public get() {
        return this.data;
    }
}
