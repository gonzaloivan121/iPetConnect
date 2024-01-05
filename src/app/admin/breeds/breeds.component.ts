import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { Breed } from 'src/classes';
import { from, Observable } from 'rxjs';

@Component({
    selector: 'app-admin-breeds',
    templateUrl: './breeds.component.html',
    styleUrls: ['./breeds.component.css']
})
export class AdminBreedsComponent implements OnInit {
    public breeds: Breed[];
    public allBreeds: Breed[];

    public hasLoaded: Observable<boolean>;
    
    public searchText = '';
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    public isEditing: boolean = false;
    public isDeleting: boolean = false;

    constructor(
        private dataService: DataService
    ) { }
    
    ngOnInit() {
        const promise = this.dataService.get('breed').then((response: any) => {
            if (response.success) {
                this.breeds = response.result as Breed[];
                this.allBreeds = response.result as Breed[];
                this.collectionSize = this.allBreeds.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        })

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.breeds = this.allBreeds.map((breed, i) => ({ id: i + 1, ...breed })).slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
        ) as Breed[];
    }

    details(breed: Breed) {
        if (this.isEditing || this.isDeleting) return;

        console.log('details')
        console.log(breed)
    }

    edit(breed: Breed) {
        this.isEditing = true;

        console.log('edit')
        console.log(breed)
    }

    confirmDelete(breed: Breed) {
        this.isDeleting = true;
        
        console.log('delete')
        console.log(breed)
    }
}
