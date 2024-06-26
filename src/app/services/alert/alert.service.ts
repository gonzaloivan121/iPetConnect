import { Injectable } from "@angular/core";
import { IAlert } from "src/app/interfaces";

interface IAlertConfig {
    title?: string;
    dismissable?: boolean;
    duration?: number;
    type?:
        | "default"
        | "primary"
        | "secondary"
        | "info"
        | "success"
        | "danger"
        | "warning";
}

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

    openDefault(
        message: string,
        config?: IAlertConfig
    ) {
        this.open({
            type: "success",
            icon: "ni ni-like-2",
            message,
            title: config.title,
            dismissable: config.dismissable,
            duration: config.duration,
        });
    }

    openSuccess(
        message: string,
        dismissable: boolean = true,
        title?: string,
        duration?: number
    ) {
        this.open({
            type: "success",
            icon: "ni ni-like-2",
            message,
            title,
            dismissable,
            duration,
        });
    }

    openInfo(
        message: string,
        dismissable: boolean = true,
        title?: string,
        duration?: number
    ) {
        this.open({
            type: "info",
            icon: "ni ni-bell-55",
            message,
            title,
            dismissable,
            duration,
        });
    }

    openWarning(
        message: string,
        dismissable: boolean = true,
        title?: string,
        duration?: number
    ) {
        this.open({
            type: "warning",
            icon: "ni ni-bell-55",
            message,
            title,
            dismissable,
            duration,
        });
    }

    openDanger(
        message: string,
        dismissable: boolean = true,
        title: string = "ERROR",
        duration?: number
    ) {
        this.open({
            type: "danger",
            icon: "ni ni-support-16",
            message,
            title,
            dismissable,
            duration,
        });
    }
}
