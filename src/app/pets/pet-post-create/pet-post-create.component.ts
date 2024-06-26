import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, catchError, from, map, of } from 'rxjs';
import { IImageCategory, IImageCategoryResponse, IInsertResponse, IPet, IPetPost, IUser } from 'src/app/interfaces';
import { AlertService, DataService, ImageService } from 'src/app/services';
import { DBTables } from 'src/classes';

@Component({
    selector: "app-pet-post-create",
    templateUrl: "./pet-post-create.component.html",
    styleUrls: ["./pet-post-create.component.css"],
})
export class PetPostCreateComponent implements OnInit {
    @Input() user: IUser;

    @Output() closeModalEvent = new EventEmitter<void>();
    @Output() postCreatedEvent = new EventEmitter<IPetPost>();

    public petsLoaded: Observable<boolean>;

    pets: IPet[] = [];

    createPostForm: UntypedFormGroup;

    focusTitle: boolean = false;
    focusDescription: boolean = false;
    focusPet: boolean = false;

    get title() {
        return this.createPostForm.get("title");
    }

    get description() {
        return this.createPostForm.get("description");
    }

    get pet_id() {
        return this.createPostForm.get("pet_id");
    }

    get image() {
        return this.createPostForm.get("image");
    }

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dataService: DataService,
        private imageService: ImageService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.createPostForm = this.formBuilder.group({
            title: ["", [Validators.required]],
            description: ["", [Validators.required]],
            pet_id: ["", [Validators.required]],
            image: ["", [Validators.required]],
        });

        this.petsLoaded = this.getPets();
    }

    getPets(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(DBTables.Pet, DBTables.User, this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.pets = response.result as IPet[];
                    } else {
                        this.alertService.openWarning(response.message);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.alertService.openDanger("There has been an error!");
                })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    onSubmit() {
        const data: IPetPost = this.createPostForm.value;

        const post: IPetPost = {
            title: data.title,
            description: data.description,
            image: data.image,
            enable_comments: true,
            pet_id: +data.pet_id,
            user_id: this.user.id,
        };

        this.dataService
            .insert(DBTables.PetPost, post)
            .then((response: IInsertResponse) => {
                if (response.success) {
                    post.id = response.result.insertId;
                    post.created_at = new Date(response.created_at);
                    post.updated_at = new Date(response.created_at);

                    this.postCreatedEvent.emit(post);

                    this.alertService.openSuccess("POST_CREATED_SUCCESSFULLY");
                    this.closeModal();
                } else {
                    this.alertService.openWarning(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                this.alertService.openDanger("There has been an error!");
            });
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
            try {
                this.image.setValue(e.target.result);
            } catch (error) {}
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
            } else if (
                category.confidence >= maxConfidenceThreshold &&
                category.confidence < minConfidenceThreshold
            ) {
                result = category.name.en;
            }
        });

        return result;
    }

    clearImage(): void {
        this.image.setValue("");
    }

    closeModal() {
        this.closeModalEvent.emit();
    }
}
