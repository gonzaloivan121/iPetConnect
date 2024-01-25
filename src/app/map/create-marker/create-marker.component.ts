import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { IBreed, IMarker, ISpecies } from "src/app/interfaces";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AlertService, DataService } from "src/app/services";
import { DBTables, MarkerType } from "src/classes";

@Component({
    selector: "app-create-marker",
    templateUrl: "./create-marker.component.html",
    styleUrls: ["./create-marker.component.css"],
})
export class CreateMarkerComponent implements OnInit, OnChanges {
    public speciesLoaded: Observable<boolean>;
    public breedsLoaded: Observable<boolean>;

    @Output() createMarkerEvent = new EventEmitter<IMarker>();
    @Output() closeModalEvent = new EventEmitter<void>();

    allSpecies: ISpecies[] = [];
    allBreeds: IBreed[] = [];
    breedsBySpecies: IBreed[] = [];

    createMarkerForm: UntypedFormGroup;

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
        this.createMarkerForm = this.formBuilder.group({
            title: ["", [Validators.required]],
            type: ["", [Validators.required]],
            species_id: [""],
            breed_id: [""],
            color: [""],
            image: ["", [Validators.required]],
            description: ["", [Validators.required]],
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

    get title() {
        return this.createMarkerForm.get("title");
    }

    get type() {
        return this.createMarkerForm.get("type");
    }

    get species_id() {
        return this.createMarkerForm.get("species_id");
    }

    get breed_id() {
        return this.createMarkerForm.get("breed_id");
    }

    get color() {
        return this.createMarkerForm.get("color");
    }

    get image() {
        return this.createMarkerForm.get("image");
    }

    get description() {
        return this.createMarkerForm.get("description");
    }

    onSubmit() {
        const marker: IMarker = this.createMarkerForm.value;

        for (const property in marker) {
            if (marker[property] === "") {
                marker[property] = null;
            }
        }

        this.createMarkerEvent.emit(marker);
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
        return (
            this.type.value === MarkerType.Veterinary
        );
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
