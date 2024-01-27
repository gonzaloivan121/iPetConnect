import { Component } from "@angular/core";
import { NavigationService } from "src/app/services";
import { Page } from "src/app/enums/enums";

@Component({
    selector: "app-pagenotfound",
    templateUrl: "./pagenotfound.component.html",
    styleUrls: ["./pagenotfound.component.css"],
})
export class PageNotFoundComponent {
    constructor(private navigationService: NavigationService) {
        this.navigationService.set(Page.NotFound);
    }
}
