import { Component } from "@angular/core";
import { NavigationService } from "src/app/services";
import { Page } from "src/app/enums/enums";

@Component({
    selector: "app-blog",
    templateUrl: "./blog.component.html",
    styleUrls: ["./blog.component.css"],
})
export class BlogComponent {
    constructor(private navigationService: NavigationService) {
        this.navigationService.set(Page.Blog);
    }
}
