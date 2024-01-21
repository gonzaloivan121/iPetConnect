import { Injectable } from "@angular/core";
import { IAlert } from "src/app/interfaces";

@Injectable({
    providedIn: "root",
})
export class AlertService {
    public alerts: Array<IAlert> = [];

    constructor() {}

    close(alert: IAlert) {
        this.alerts.splice(this.alerts.indexOf(alert), 1);
    }

    open(alert: IAlert) {
        this.alerts.push(alert);
    }
}
