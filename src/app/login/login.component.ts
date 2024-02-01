import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DataService, SessionService, NavigationService, AlertService } from 'src/app/services';
import { Page } from 'src/app/enums/enums';

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
    loginForm: UntypedFormGroup;

    focusEmail: boolean;
    focusPassword: boolean;

    isLoginError: boolean = false;
    isPasswordShown: boolean = false;

    constructor(
        private location: Location,
        private formBuilder: UntypedFormBuilder,
        private dataService: DataService,
        private sessionService: SessionService,
        private navigationService: NavigationService,
        private alertService: AlertService
    ) {
        this.navigationService.set(Page.Login);
    }

    ngOnInit() {
        if (this.sessionService.exists("user")) {
            this.location.go("/home");
            window.location.reload();
        }

        this.loginForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required]],
            remember: [false, [Validators.required]],
        });
    }

    get email() {
        return this.loginForm.get("email");
    }

    get password() {
        return this.loginForm.get("password");
    }

    onSubmit() {
        const formData = this.loginForm.value;

        this.dataService
            .login(formData)
            .then((response: any) => {
                if (response.success) {
                    if (response.login) {
                        const userData = response.user;
                        this.sessionService.set(
                            "user",
                            JSON.stringify(userData)
                        );
                        this.sessionService.set("remember", formData.remember);
                        this.location.go("/home");
                        window.location.reload();
                    } else {
                        this.isLoginError = true;
                    }
                } else {
                    this.isLoginError = true;
                }
            })
            .catch((error) => {
                this.isLoginError = true;
            });
    }

    toggleShowPassword() {
        this.isPasswordShown = !this.isPasswordShown;
    }

    comingSoon() {
        this.alertService.openInfo("COMING_SOON");
    }
}
