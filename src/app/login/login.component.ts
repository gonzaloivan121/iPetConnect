import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DataService, SessionService } from '../services';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    focusEmail: boolean;
    focusPassword: boolean;

    isLoginError: boolean = false;
    isPasswordShown: boolean = false;

    constructor(
        private location: Location,
        private formBuilder: FormBuilder,
        private dataService: DataService,
        private sessionService: SessionService
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ["", [Validators.required]],
            password: ["", [Validators.required]],
            remember: [false, [Validators.required]],
        });
    }

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    onSubmit() {
        const formData = this.loginForm.value;

        this.dataService.login(formData).then((response: any) => {
            if (response.status === 'success') {
                if (response.login) {
                    const userData = response.user;
                    this.sessionService.set('user', JSON.stringify(userData));
                    this.location.go('/home');
                    window.location.reload();
                } else {
                    this.isLoginError = true;
                }
            } else {
                this.isLoginError = true;
            }
        }).catch(error => {
            this.isLoginError = true;
        });
    }

    toggleShowPassword() {
        this.isPasswordShown = !this.isPasswordShown;
    }
}
