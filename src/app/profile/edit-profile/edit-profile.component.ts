import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { DataService, SessionService, AlertService, ImageService } from "src/app/services";
import { DBTables } from "src/classes";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { IImageCategory, IImageCategoryResponse, IUser } from "src/app/interfaces";

@Component({
    selector: "app-edit-profile",
    templateUrl: "./edit-profile.component.html",
    styleUrls: ["./edit-profile.component.css"],
})
export class EditProfileComponent implements OnInit {
    profileForm: UntypedFormGroup;
    user: IUser;

    focusName: boolean = false;
    focusGender: boolean = false;
    focusBio: boolean = false;

    constructor(
        private sessionService: SessionService,
        private location: Location,
        private formBuilder: UntypedFormBuilder,
        private dataService: DataService,
        private alertService: AlertService,
        private imageService: ImageService
    ) {}

    ngOnInit(): void {
        if (this.sessionService.exists("user")) {
            this.user = JSON.parse(this.sessionService.get("user"));
        } else {
            this.location.back();
        }

        this.profileForm = this.formBuilder.group({
            username: [this.user.username, [Validators.required]],
            email: [this.user.email, [Validators.required, Validators.email]],
            name: [this.user.name, [Validators.required]],
            gender: [this.user.gender, [Validators.required]],
            bio: [this.user.bio, [Validators.required]],
        });

        this.username.disable();
        this.email.disable();
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
        const formData: IUser = this.profileForm.value;

        this.user.name = formData.name;
        this.user.gender = formData.gender;
        this.user.bio = formData.bio;

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

    onFileSelected(files: FileList): void {
        if (files.length <= 0) return;

        const file: File | null = files.item(0);

        if (!file) return;

        const data = new FormData();
        data.append("image", file);

        this.imageService
            .categories(data, { category: "nsfw_beta" })
            .then((response: IImageCategoryResponse) => {
                if (response.status.type === "success") {
                    const categories = response.result.categories;
                    const result = this.checkNSFWImageConfidence(categories);

                    if (result === "safe") {
                        this.updateImage(file);
                    } else {
                        this.alertService.openWarning("NO_NSFW_ALLOWED");
                    }
                } else {
                    this.alertService.openWarning(response.status.text);
                }
            });
    }

    updateImage(file: File) {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            this.user.image = e.target.result.toString();
        };

        reader.readAsDataURL(file);
    }

    checkNSFWImageConfidence(categories: IImageCategory[]): string {
        const minConfidenceThreshold = 75;
        const maxConfidenceThreshold = 50;
        var result: string = "nsfw";

        categories.forEach((category: IImageCategory) => {
            if (category.confidence > minConfidenceThreshold) {
                result = category.name.en;
            } else if (category.confidence >= maxConfidenceThreshold && category.confidence < minConfidenceThreshold) {
                result = category.name.en;
            }
        });

        return result;
    }
}
