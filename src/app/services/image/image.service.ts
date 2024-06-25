import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Buffer } from "buffer";
import { IImageCategoryType } from "src/app/interfaces";

@Injectable({
    providedIn: "root",
})
export class ImageService {
    constructor(private http: HttpClient) {}

    private async request(method: string, url: string, data?: any) {
        const token = this.encode(
            `${environment.imageRecognition.key}:${environment.imageRecognition.secret}`
        );

        const result = this.http.request(method, url, {
            body: data,
            responseType: "json",
            observe: "body",
            headers: {
                Authorization: "Basic " + token,
            },
        });

        return new Promise((resolve, reject) => {
            result.subscribe(resolve, reject);
        });
    }

    private encode(str: string): string {
        return Buffer.from(str, "binary").toString("base64");
    }

    tags(data: FormData) {
        let url: string = `${environment.imageRecognition.endpoint}/tags`;
        return this.request("POST", url, data);
    }

    categorizers() {
        let url: string = `${environment.imageRecognition.endpoint}/categorizers`;
        return this.request("GET", url);
    }

    categories(data: FormData, options: IImageCategoryType) {
        let url: string = `${environment.imageRecognition.endpoint}/categories/${options.category}`;
        return this.request("POST", url, data);
    }

    croppings(data: FormData) {
        let url: string = `${environment.imageRecognition.endpoint}/croppings`;
        return this.request("POST", url, data);
    }

    colors(data: FormData) {
        let url: string = `${environment.imageRecognition.endpoint}/colors`;
        return this.request("POST", url, data);
    }

    text(data: FormData) {
        let url: string = `${environment.imageRecognition.endpoint}/text`;
        return this.request("POST", url, data);
    }

    removeBackground(data: FormData) {
        let url: string = `${environment.imageRecognition.endpoint}/remove-background`;
        return this.request("POST", url, data);
    }

    usage() {
        let url: string = `${environment.imageRecognition.endpoint}/usage`;
        return this.request("GET", url);
    }

    barcodes(data: FormData) {
        let url: string = `${environment.imageRecognition.endpoint}/barcodes`;
        return this.request("POST", url, data);
    }
}
