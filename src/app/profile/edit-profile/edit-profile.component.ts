import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { DataService, SessionService, AlertService } from "src/app/services";
import { DBTables, User } from "src/classes";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-edit-profile",
    templateUrl: "./edit-profile.component.html",
    styleUrls: ["./edit-profile.component.css"],
})
export class EditProfileComponent implements OnInit {
    profileForm: UntypedFormGroup;
    user: User;

    focusName: boolean = false;
    focusEmail: boolean = false;
    focusGender: boolean = false;
    focusBio: boolean = false;

    selectedFile?: FileList;
    currentFile?: File;

    @ViewChild("profileImage") profileImage: ElementRef;

    constructor(
        private sessionService: SessionService,
        private location: Location,
        private formBuilder: UntypedFormBuilder,
        private dataService: DataService,
        private alertService: AlertService,
    ) {}

    ngOnInit(): void {
        if (this.sessionService.get("user") !== null) {
            this.user = JSON.parse(this.sessionService.get("user"));
        } else {
            this.location.back();
        }

        this.profileForm = this.formBuilder.group({
            username: [this.user.username, [Validators.required]],
            name: [this.user.name, [Validators.required]],
            email: [this.user.email, [Validators.required, Validators.email]],
            gender: [this.user.gender, [Validators.required]],
            bio: [this.user.bio, [Validators.required]],
        });

        this.username.disable();
    }

    get username() {
        return this.profileForm.get("username");
    }

    get name() {
        return this.profileForm.get("name");
    }

    get email() {
        return this.profileForm.get("email");
    }

    get gender() {
        return this.profileForm.get("gender");
    }

    get bio() {
        return this.profileForm.get("bio");
    }

    onSubmit() {
        const formData: User = this.profileForm.value;

        this.user.name = formData.name;
        this.user.email = formData.email;
        this.user.gender = formData.gender;
        this.user.bio = formData.bio;
        this.user.image = this.profileImage.nativeElement.src;

        this.dataService
            .update(DBTables.User, this.user)
            .then((response: any) => {
                if (response.success) {
                    this.sessionService.set("user", JSON.stringify(this.user));
                    this.alertService.openSuccess(
                        "User info updated successfully!"
                    );
                } else {
                    console.error(response.message);
                    this.alertService.openWarning(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                this.alertService.openDanger("There has been an error!");
            });
    }

    onCancel() {
        this.location.back();
    }

    uploadImage() {
        console.log("upload");
    }

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files;

        if (this.selectedFile) {
            const file: File | null = this.selectedFile.item(0);

            if (file) {
                var preview = "";
                this.currentFile = file;

                const reader = new FileReader();

                reader.onload = (e: any) => {
                    console.log(e.target.result);
                    preview = e.target.result;
                    this.profileImage.nativeElement.src = preview;
                };

                reader.readAsDataURL(this.currentFile);
            }
        }
    }
}
