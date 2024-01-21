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

        if (alert.duration) {
            setTimeout(() => {
                this.close(alert);
            }, alert.duration * 1000);
        }
    }

    openSuccess(
        message: string,
        dismissable: boolean = true,
        strong?: string,
        duration?: number
    ) {
        this.open({
            type: "success",
            icon: "ni ni-like-2",
            message,
            strong,
            dismissable,
            duration,
        });
    }

    openInfo(
        message: string,
        dismissable: boolean = true,
        strong?: string,
        duration?: number
    ) {
        this.open({
            type: "info",
            icon: "ni ni-bell-55",
            message,
            strong,
            dismissable,
            duration,
        });
    }

    openWarning(
        message: string,
        dismissable: boolean = true,
        strong?: string,
        duration?: number
    ) {
        this.open({
            type: "warning",
            icon: "ni ni-bell-55",
            message,
            strong,
            dismissable,
            duration,
        });
    }

    openDanger(
        message: string,
        dismissable: boolean = true,
        strong: string = "Error",
        duration?: number
    ) {
        this.open({
            type: "danger",
            icon: "ni ni-support-16",
            message,
            strong,
            dismissable,
            duration,
        });
    }
}
