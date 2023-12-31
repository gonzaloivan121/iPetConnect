import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DataService, SessionService } from 'src/app/services';

@Component({
    selector: 'app-forgotpassword',
    templateUrl: './forgotpassword.component.html',
    styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

    passwordForm: UntypedFormGroup;

    focusEmail: boolean;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dataService: DataService,
        private sessionService: SessionService,
        private location: Location
    ) { }

    ngOnInit(): void {
        if (this.sessionService.get('user') !== null) {
            this.location.go('/home');
            window.location.reload();
        }

        this.passwordForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]]
        });
    }

    get email() {
        return this.passwordForm.get('email');
    }

    onSubmit() {
        const formData = this.passwordForm.value;

        this.dataService.password(formData).then((response: any) => {
            console.log(response)
            /*if (response.success) {
                if (response.login) {
                    const userData = response.user;
                } else {
                    this.isLoginError = true;
                }
            } else {
                this.isLoginError = true;
            }*/
        });
    }

}
