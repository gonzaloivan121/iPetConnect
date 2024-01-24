import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { IPet } from 'src/app/interfaces';
import { from, Observable } from 'rxjs';
import { DBTables } from 'src/classes';

@Component({
    selector: "app-admin-pets",
    templateUrl: "./pets.component.html",
    styleUrls: ["./pets.component.css"],
})
export class AdminPetsComponent implements OnInit {
    public pets: IPet[];
    public allPets: IPet[];

    public hasLoaded: Observable<boolean>;

    public searchText = "";
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        const promise = this.dataService.get(DBTables.Pet).then((response: any) => {
            if (response.success) {
                this.pets = response.result as IPet[];
                this.allPets = response.result as IPet[];
                this.collectionSize = this.allPets.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        });

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.pets = this.allPets
            .map((pet, i) => ({ id: i + 1, ...pet }))
            .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize
            ) as IPet[];
    }
}
