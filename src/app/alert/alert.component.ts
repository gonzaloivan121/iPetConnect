import { Component } from "@angular/core";
import { AlertService } from "src/app/services";
import { IAlert } from "src/app/interfaces";

@Component({
    selector: "app-alert",
    templateUrl: "./alert.component.html",
    styleUrls: ["./alert.component.css"],
})
export class AlertComponent {

    constructor(public alertService: AlertService) {}

    close(alert: IAlert) {
        this.alertService.close(alert);
    }
}
