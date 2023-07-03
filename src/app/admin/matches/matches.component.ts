import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { Match } from 'src/classes';
import { from, Observable } from 'rxjs';

@Component({
    selector: 'app-admin-matches',
    templateUrl: './matches.component.html',
    styleUrls: ['./matches.component.css']
})
export class AdminMatchesComponent implements OnInit {
    public matches: Match[];
    public allMatches: Match[];

    public hasLoaded: Observable<boolean>;
    
    public searchText = '';
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(
        private dataService: DataService
    ) { }
    
    ngOnInit() {
        const promise = this.dataService.get('match').then((response: any) => {
            if (response.status === 'success') {
                this.matches = response.results as Match[];
                this.allMatches = response.results as Match[];
                this.collectionSize = this.allMatches.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        })

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.matches = this.allMatches.map((match, i) => ({ id: i + 1, ...match })).slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
        ) as Match[];
    }

}
