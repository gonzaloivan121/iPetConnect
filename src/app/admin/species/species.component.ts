import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { Species } from 'src/classes';
import { from, Observable } from 'rxjs';

@Component({
    selector: 'app-admin-species',
    templateUrl: './species.component.html',
    styleUrls: ['./species.component.css']
})
export class AdminSpeciesComponent implements OnInit {
    public species: Species[];
    public allSpecies: Species[];

    public hasLoaded: Observable<boolean>;
    
    public searchText = '';
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(
        private dataService: DataService
    ) { }
    
    ngOnInit() {
        const promise = this.dataService.get('species').then((response: any) => {
            if (response.status === 'success') {
                this.species = response.results as Species[];
                this.allSpecies = response.results as Species[];
                this.collectionSize = this.allSpecies.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        })

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.species = this.allSpecies.map((species, i) => ({ id: i + 1, ...species })).slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
        ) as Species[];
    }

}
