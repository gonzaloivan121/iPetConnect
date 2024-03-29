import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { from, Observable } from 'rxjs';
import { ILike } from 'src/app/interfaces';
import { DBTables } from 'src/classes';

@Component({
    selector: "app-admin-likes",
    templateUrl: "./likes.component.html",
    styleUrls: ["./likes.component.css"],
})
export class AdminLikesComponent implements OnInit {
    public likes: ILike[];
    public allLikes: ILike[];

    public hasLoaded: Observable<boolean>;

    public searchText = "";
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        const promise = this.dataService.get(DBTables.Like).then((response: any) => {
            if (response.success) {
                this.likes = response.result as ILike[];
                this.allLikes = response.result as ILike[];
                this.collectionSize = this.allLikes.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        });

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.likes = this.allLikes
            .map((like, i) => ({ id: i + 1, ...like }))
            .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize
            ) as ILike[];
    }
}
