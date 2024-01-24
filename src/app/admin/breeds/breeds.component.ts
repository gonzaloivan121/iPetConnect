import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { from, Observable } from 'rxjs';
import { IBreed } from 'src/app/interfaces';
import { DBTables } from 'src/classes';

@Component({
    selector: "app-admin-breeds",
    templateUrl: "./breeds.component.html",
    styleUrls: ["./breeds.component.css"],
})
export class AdminBreedsComponent implements OnInit {
    public breeds: IBreed[];
    public allBreeds: IBreed[];

    public hasLoaded: Observable<boolean>;

    public searchText = "";
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    public isEditing: boolean = false;
    public isDeleting: boolean = false;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        const promise = this.dataService.get(DBTables.Breed).then((response: any) => {
            if (response.success) {
                this.breeds = response.result as IBreed[];
                this.allBreeds = response.result as IBreed[];
                this.collectionSize = this.allBreeds.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        });

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.breeds = this.allBreeds
            .map((breed, i) => ({ id: i + 1, ...breed }))
            .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize
            ) as IBreed[];
    }

    details(breed: IBreed) {
        if (this.isEditing || this.isDeleting) return;

        console.log("details", breed);
    }

    edit(breed: IBreed) {
        this.isEditing = true;

        console.log("edit", breed);
    }

    confirmDelete(breed: IBreed) {
        this.isDeleting = true;

        console.log("delete", breed);
    }
}
