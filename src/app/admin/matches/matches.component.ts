import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { from, Observable } from 'rxjs';
import { IMatch } from 'src/app/interfaces';
import { DBTables } from 'src/classes';

@Component({
    selector: "app-admin-matches",
    templateUrl: "./matches.component.html",
    styleUrls: ["./matches.component.css"],
})
export class AdminMatchesComponent implements OnInit {
    public matches: IMatch[];
    public allMatches: IMatch[];

    public hasLoaded: Observable<boolean>;

    public searchText = "";
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        const promise = this.dataService.get(DBTables.Match).then((response: any) => {
            if (response.success) {
                this.matches = response.result as IMatch[];
                this.allMatches = response.result as IMatch[];
                this.collectionSize = this.allMatches.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        });

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.matches = this.allMatches
            .map((match, i) => ({ id: i + 1, ...match }))
            .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize
            ) as IMatch[];
    }
}
