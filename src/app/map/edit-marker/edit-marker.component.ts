import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { IBreed, IMarker, ISpecies } from "src/app/interfaces";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AlertService, DataService } from "src/app/services";
import { DBTables, MarkerType } from "src/classes";

@Component({
    selector: "app-edit-marker",
    templateUrl: "./edit-marker.component.html",
    styleUrls: ["./edit-marker.component.css"],
})
export class EditMarkerComponent implements OnInit, OnChanges {
    public speciesLoaded: Observable<boolean>;
    public breedsLoaded: Observable<boolean>;

    @Input() marker: IMarker;

    @Output() editMarkerEvent = new EventEmitter<IMarker>();
    @Output() closeModalEvent = new EventEmitter<void>();

    allSpecies: ISpecies[] = [];
    allBreeds: IBreed[] = [];
    breedsBySpecies: IBreed[] = [];

    editMarkerForm: UntypedFormGroup;

    focusTitle: boolean = false;
    focusType: boolean = false;
    focusSpecies: boolean = false;
    focusBreed: boolean = false;
    focusDescription: boolean = false;

    typeValues: string[] = [
        "RESCUE",
        "URGENCY",
        "VETERINARY",
        "CARER",
        "ADOPTION",
        "INFORMATION",
    ];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dataService: DataService,
        private alertService: AlertService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
    }

    ngOnInit(): void {
        this.editMarkerForm = this.formBuilder.group({
            id: [this.marker.id],
            species_id: [this.marker.species_id ?? ""],
            breed_id: [this.marker.breed_id ?? ""],
            user_id: [this.marker.user_id, [Validators.required]],
            title: [this.marker.title, [Validators.required]],
            description: [this.marker.description, [Validators.required]],
            type: [this.marker.type, [Validators.required]],
            color: [this.marker.color],
            coordinates: [this.marker.coordinates, [Validators.required]],
            image: [this.marker.image, [Validators.required]],
            created_at: [this.marker.created_at, [Validators.required]],
            updated_at: [this.marker.updated_at, [Validators.required]],
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
                        this.onSpeciesSelected();
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

    get species_id() {
        return this.editMarkerForm.get("species_id");
    }

    get breed_id() {
        return this.editMarkerForm.get("breed_id");
    }

    get user_id() {
        return this.editMarkerForm.get("user_id");
    }

    get title() {
        return this.editMarkerForm.get("title");
    }

    get description() {
        return this.editMarkerForm.get("description");
    }

    get type() {
        return this.editMarkerForm.get("type");
    }

    get color() {
        return this.editMarkerForm.get("color");
    }

    get coordinates() {
        return this.editMarkerForm.get("coordinates");
    }

    get image() {
        return this.editMarkerForm.get("image");
    }

    get created_at() {
        return this.editMarkerForm.get("created_at");
    }

    get updated_at() {
        return this.editMarkerForm.get("updated_at");
    }

    onSubmit() {
        const marker: IMarker = this.editMarkerForm.value;

        for (const property in marker) {
            if (marker[property] === "") {
                marker[property] = null;
            }
        }

        this.editMarkerEvent.emit(marker);
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

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                this.image.setValue(e.target.result);
            } catch (error) {}
        };

        reader.readAsDataURL(file);
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

    willHideSpecies() {
        return this.type.value === MarkerType.Veterinary;
    }

    willHideBreeds() {
        return (
            this.type.value === MarkerType.Veterinary ||
            this.type.value === MarkerType.Carer
        );
    }

    onTypeChange() {
        if (this.willHideSpecies()) {
            this.clearSpeciesField();
        }

        if (this.willHideBreeds()) {
            this.clearBreedField();
        }
    }
}
