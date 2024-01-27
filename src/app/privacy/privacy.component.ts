import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { EmailService, TranslateService, AlertService, NavigationService } from "src/app/services";
import { Page } from 'src/app/enums/enums';

@Component({
    selector: "app-privacy",
    templateUrl: "./privacy.component.html",
    styleUrls: ["./privacy.component.css"],
})
export class PrivacyComponent {
    contactUsForm: UntypedFormGroup;

    emailFocused: boolean = false;
    nameFocused: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private emailService: EmailService,
        private translateService: TranslateService,
        private alertService: AlertService,
        private navigationService: NavigationService,
    ) {
        this.navigationService.set(Page.Privacy);
    }

    ngOnInit() {
        this.contactUsForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            name: ["", [Validators.required]],
            message: ["", [Validators.required]],
        });
    }

    get name() {
        return this.contactUsForm.get("name");
    }

    get email() {
        return this.contactUsForm.get("email");
    }

    get message() {
        return this.contactUsForm.get("message");
    }

    onSubmit() {
        const formData = this.contactUsForm.value;

        this.emailService
            .Send(formData)
            .then((response: any) => {
                if (response.success) {
                    this.alertService.openSuccess(
                        this.translateService.get(response.message)
                    );
                } else {
                    this.alertService.openWarning(
                        this.translateService.get(response.message)
                    );
                }
            })
            .catch((error) => {
                console.error(error);
                this.alertService.openDanger("There ahs been an error!");
            });
    }

    scrollTo(element: HTMLElement) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
        });
    }
}
