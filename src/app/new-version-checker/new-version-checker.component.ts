import { Component } from "@angular/core";
import { NewVersionCheckerService } from "src/app/services/new-version-checker.service";

@Component({
    selector: "app-new-version-checker",
    templateUrl: "./new-version-checker.component.html",
    styleUrls: ["./new-version-checker.component.css"],
})
export class NewVersionCheckerComponent {
    constructor(
        public newVersionCheckerService: NewVersionCheckerService
    ) {}

    applyUpdate(): void {
        this.newVersionCheckerService.applyUpdate();
    }
}
