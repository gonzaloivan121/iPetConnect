import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DataService, SessionService, AppConfigService } from '../services';
import { User } from '../../classes/user';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    signupForm: FormGroup;
    maxBirthDate: {
        year: number,
        month: number,
        day: number
    } = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
    }

    focusUsername;
    focusName;
    focusEmail;
    focusBirthday;
    focusGender;
    focusPassword;
    focusConfirmPassword;

    isPasswordShown: boolean = false;
    isConfirmPasswordShown: boolean = false;

    passwordStrength: number = 0;

    constructor(
        private location: Location,
        private formBuilder: FormBuilder,
        private dataService: DataService,
        private sessionService: SessionService,
        private configService: AppConfigService
    ) { }

    ngOnInit() {
        if (this.sessionService.get('user') !== null) {
            this.location.go('/home');
            window.location.reload();
        }

        this.signupForm = this.formBuilder.group({
            username: ["", [Validators.required, Validators.minLength(8)]],
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(8), this.createPasswordStrengthValidator()]],
            confirmPassword: ["", [Validators.required]],
            name: ["", [Validators.required]],
            role_id: [2, [Validators.required]],
            birthday: ["", [Validators.required, this.ageGreaterThanMinRequired()]],
            gender: ["", [Validators.required]],
            agreePrivacyPolicy: [false, [Validators.requiredTrue]]
        }, { validators: this.confirmPasswordValidator() });
    }

    confirmPasswordValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            console.log(control.value.password === control.value.confirmPassword)
            return control.value.password === control.value.confirmPassword ? null : { passwordNoMatch: true };
        }
    }

    createPasswordStrengthValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) {
                return null;
            }

            const hasUpperCase = /[A-Z]+/.test(value);
            const hasLowerCase = /[a-z]+/.test(value);
            const hasNumeric = /[0-9]+/.test(value);
            const hasSpecial = /[!@#$%&*()_+=|<>?{}\[\]~-]+/.test(value);

            const isValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

            const validArray = [hasUpperCase, hasLowerCase, hasNumeric, hasSpecial];
            this.passwordStrength = validArray.filter(Boolean).length;

            return !isValid ? {
                passwordStrength: {
                    hasUpperCase: !hasUpperCase,
                    hasLowerCase: !hasLowerCase,
                    hasNumeric: !hasNumeric,
                    hasSpecial: !hasSpecial
                }
            } : null;

        }
    }

    get username() {
        return this.signupForm.get('username');
    }

    get email() {
        return this.signupForm.get('email');
    }

    get password() {
        return this.signupForm.get('password');
    }

    get confirmPassword() {
        return this.signupForm.get('confirmPassword');
    }

    get name() {
        return this.signupForm.get('name');
    }

    get role_id() {
        return this.signupForm.get('role_id');
    }

    get birthday() {
        return this.signupForm.get('birthday');
    }

    get gender() {
        return this.signupForm.get('gender');
    }

    onSubmit() {
        const formData = this.signupForm.value;
        formData.birthday = `${formData.birthday.year}/${formData.birthday.month}/${formData.birthday.day}`;
        
        this.dataService.insert('user', formData).then((response: any) => {
            if (response.status === 'success') {
                const user: User = new User(
                    formData.username,
                    formData.email,
                    formData.password,
                    formData.name,
                    formData.role_id,
                    formData.birthday,
                    formData.gender
                );

                user.id = response.results.insertId;
                this.sessionService.set('user', JSON.stringify(user));
                this.location.go('/home');
                window.location.reload();
            } else {

            }
        });
    }

    ageGreaterThanMinRequired(): ValidatorFn {
        return (control: AbstractControl) : ValidationErrors | null => {
            const value: {
                year: number,
                month: number,
                day: number
            } = control.value;

            if (!value) return null;
            const date = `${value.year}/${value.month}/${value.day}`;

            const today = new Date();
            const birthday = new Date(date);

            const diffMs = Math.abs(today.getTime() - birthday.getTime());
            const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));

            return diffYears < this.configService.data.minAgePossible ? {
                ageRequired: {
                    minAgePossible: this.configService.data.minAgePossible
                }
            } : null;
        }
    }

    toggleShowPassword() {
        this.isPasswordShown = !this.isPasswordShown;
    }

    toggleShowConfirmPassword() {
        this.isConfirmPasswordShown = !this.isConfirmPasswordShown;
    }
}
