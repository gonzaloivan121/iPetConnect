import { Component, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { EmailService, TranslateService } from '../services';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

export interface IAlert {
    type: string;
    strong?: string;
    message: string;
    icon?: string;
    dismissible: boolean;
    dismissAfter: number;
}

@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent {

    alert: IAlert = {
        type: 'success',
        message: '',
        dismissible: true,
        icon: '',
        dismissAfter: 5
    }

    contactUsForm: UntypedFormGroup;

    emailFocused: boolean = false;
    nameFocused: boolean = false;
    isContactAlertOpen: boolean = false;

    @ViewChild('contactAlert', { static: false }) contactAlert: NgbAlert;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private emailService: EmailService,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        this.contactUsForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            name: ["", [Validators.required]],
            message: ["", [Validators.required]],
        });
    }

    get name() {
        return this.contactUsForm.get('name');
    }

    get email() {
        return this.contactUsForm.get('email');
    }

    get message() {
        return this.contactUsForm.get('message');
    }

    onSubmit() {
        const formData = this.contactUsForm.value;

        this.emailService.Send(formData).then((response: any) => {
            this.showAlert(response.success, true, this.translateService.get(response.message), response.icon);
        });
    }

    scrollTo(element: HTMLElement) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        });
    }

    showAlert(success: boolean, dismissible: boolean, message: string, icon: string, dismissAfter: number = 5) {
        this.alert = {
            type: success ? 'success' : 'danger',
            message,
            dismissible,
            icon,
            dismissAfter
        }

        this.isContactAlertOpen = true;

        setTimeout(() => {
            if (this.isContactAlertOpen) {
                this.contactAlert.close();
            }
        }, this.alert.dismissAfter * 1000);
    }

}
