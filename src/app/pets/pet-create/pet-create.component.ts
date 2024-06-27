import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Observable, catchError, from, map, of } from "rxjs";
import { IBreed, IImageCategory, IImageCategoryResponse, IInsertResponse, IPet, ISpecies, IUser } from "src/app/interfaces";
import { AlertService, DataService, ImageService } from "src/app/services";
import { DBTables } from "src/classes";

@Component({
    selector: "app-pet-create",
    templateUrl: "./pet-create.component.html",
    styleUrls: ["./pet-create.component.css"],
})
export class PetCreateComponent implements OnInit {
    @Input() user: IUser;

    @Output() closeModalEvent = new EventEmitter<void>();
    @Output() petCreatedEvent = new EventEmitter<IPet>();

    public speciesLoaded: Observable<boolean>;
    public breedsLoaded: Observable<boolean>;

    allSpecies: ISpecies[] = [];
    allBreeds: IBreed[] = [];
    breedsBySpecies: IBreed[] = [];

    createPetForm: UntypedFormGroup;

    focusName: boolean = false;
    focusSpecies: boolean = false;
    focusBreed: boolean = false;
    focusGender: boolean = false;
    focusColor: boolean = false;

    get name() {
        return this.createPetForm.get("name");
    }

    get species_id() {
        return this.createPetForm.get("species_id");
    }

    get breed_id() {
        return this.createPetForm.get("breed_id");
    }

    get gender() {
        return this.createPetForm.get("gender");
    }

    get color() {
        return this.createPetForm.get("color");
    }

    get image() {
        return this.createPetForm.get("image");
    }

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dataService: DataService,
        private imageService: ImageService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.createPetForm = this.formBuilder.group({
            name: ["", [Validators.required]],
            species_id: ["", [Validators.required]],
            breed_id: ["", [Validators.required]],
            gender: [""],
            color: [""],
            image: ["", [Validators.required]],
            user_id: [this.user.id, [Validators.required]],
        });

        this.getData();
    }

    getData(): void {
        this.speciesLoaded = this.getSpecies();
        this.breedsLoaded = this.getBreeds();
    }

    getSpecies(): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.Species)
                .then((response: any) => {
                    if (response.success) {
                        this.allSpecies = response.result as ISpecies[];
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

    getBreeds(): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.Breed)
                .then((response: any) => {
                    if (response.success) {
                        this.allBreeds = response.result as IBreed[];
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
        const pet: IPet = this.createPetForm.value;

        for (const property in pet) {
            if (pet[property] === "") {
                pet[property] = null;
            }
        }

        this.dataService
            .insert(DBTables.Pet, pet)
            .then((response: IInsertResponse) => {
                if (response.success) {
                    pet.id = response.result.insertId;
                    pet.created_at = new Date(response.created_at);
                    pet.updated_at = new Date(response.created_at);

                    this.petCreatedEvent.emit(pet);

                    this.alertService.openSuccess("PET_CREATED_SUCCESSFULLY");
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

    onSpeciesSelected() {
        const species_id = Number(this.species_id.value);

        this.breedsBySpecies = this.allBreeds.filter(
            (b) => b.species_id === species_id
        );
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

    clearBreedField() {
        this.breed_id.setValue("");
    }

    clearSpeciesField() {
        this.species_id.setValue("");
        this.clearBreedField();
        this.onSpeciesSelected();
    }
}
