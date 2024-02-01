import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DataService, SessionService, AlertService, NavigationService } from 'src/app/services';
import { Page } from 'src/app/enums/enums';

@Component({
    selector: "app-forgotpassword",
    templateUrl: "./forgotpassword.component.html",
    styleUrls: ["./forgotpassword.component.css"],
})
export class ForgotpasswordComponent implements OnInit {
    passwordForm: UntypedFormGroup;

    focusEmail: boolean;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dataService: DataService,
        private sessionService: SessionService,
        private location: Location,
        private alertService: AlertService,
        private navigationService: NavigationService,
    ) {
        this.navigationService.set(Page.ForgotPassword);
    }

    ngOnInit(): void {
        if (this.sessionService.exists("user")) {
            this.location.go("/home");
            window.location.reload();
        }

        this.passwordForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
        });
    }

    get email() {
        return this.passwordForm.get("email");
    }

    onSubmit() {
        const formData = this.passwordForm.value;

        this.dataService
            .password(formData)
            .then((response: any) => {
                if (response.success) {
                    this.alertService.openSuccess(response.message);
                } else {
                    this.alertService.openWarning(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                this.alertService.openDanger("There has been an error.");
            });
    }
}
