import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DataService, SessionService, AppConfigService } from 'src/app/services';
import { DBTables } from 'src/classes';
import { IConfig, IUser } from 'src/app/interfaces';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    signupForm: UntypedFormGroup;
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
        private formBuilder: UntypedFormBuilder,
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
        formData.birthday = new Date(formData.birthday);
        
        this.dataService.insert(DBTables.User, formData).then((response: any) => {
            if (response.success) {
                const user: IUser = {
                    id: response.result.insertId,
                    username: formData.username,
                    email: formData.email,
                    password: response.hash,
                    name: formData.name,
                    role_id: formData.role_id,
                    birthday: formData.birthday,
                    gender: formData.gender,
                    image: "assets/img/ipetconnect_background.jpg",
                    created_at: response.created_at,
                    updated_at: response.created_at,
                };

                this.sessionService.set('user', JSON.stringify(user));

                this.generateConfigForUser(user);
            } else {
                console.warn(response.message);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    generateConfigForUser(user: IUser) {
        var serviceData = this.configService.data;

        var data: IConfig = {
            min_distance: serviceData.selectedMinDistancePossible,
            max_distance: serviceData.selectedMaxDistancePossible,
            selected_gender: serviceData.selectedGender,
            min_age: serviceData.selectedMinAgePossible,
            max_age: serviceData.selectedMaxAgePossible,
            search_verified_users: serviceData.onlySearchVerifiedUsers,
            search_in_distance: serviceData.onlySearchDistanceRange,
            search_in_age: serviceData.onlySearchAgeRange,
            search_has_bio: serviceData.onlySearchHasBioUsers,
            user_id: user.id
        };

        this.dataService.insert(DBTables.Config, data).then((response: any) => {
            if (response.success) {
                this.location.go("/home");
                window.location.reload();
            }
        }).catch((error) => {
            console.error(error);
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
