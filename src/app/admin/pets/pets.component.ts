import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { Pet } from 'src/classes';
import { from, Observable } from 'rxjs';

@Component({
    selector: 'app-admin-pets',
    templateUrl: './pets.component.html',
    styleUrls: ['./pets.component.css']
})
export class AdminPetsComponent implements OnInit {
    public pets: Pet[];
    public allPets: Pet[];

    public hasLoaded: Observable<boolean>;

    public searchText = '';
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(
        private dataService: DataService
    ) { }

    ngOnInit() {
        const promise = this.dataService.get('pet').then((response: any) => {
            if (response.status === 'success') {
                this.pets = response.results as Pet[];
                this.allPets = response.results as Pet[];
                this.collectionSize = this.allPets.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        })

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.pets = this.allPets.map((pet, i) => ({ id: i + 1, ...pet })).slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
        ) as Pet[];
    }

}
