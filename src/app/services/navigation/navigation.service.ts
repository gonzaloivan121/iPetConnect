import { Injectable } from "@angular/core";
import { Page } from "src/app/enums/enums";

@Injectable({
    providedIn: "root",
})
export class NavigationService {
    private currentPage: Page;

    public get(): Page {
        return this.currentPage;
    }

    public set(page: Page): void {
        this.currentPage = page;
    }

    public is(page: Page): boolean {
        return this.currentPage === page;
    }
}
