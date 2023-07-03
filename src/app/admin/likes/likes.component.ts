import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { Like } from 'src/classes';
import { from, Observable } from 'rxjs';

@Component({
    selector: 'app-admin-likes',
    templateUrl: './likes.component.html',
    styleUrls: ['./likes.component.css']
})
export class AdminLikesComponent implements OnInit {
    public likes: Like[];
    public allLikes: Like[];

    public hasLoaded: Observable<boolean>;
    
    public searchText = '';
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(
        private dataService: DataService
    ) { }
    
    ngOnInit() {
        const promise = this.dataService.get('like').then((response: any) => {
            if (response.status === 'success') {
                this.likes = response.results as Like[];
                this.allLikes = response.results as Like[];
                this.collectionSize = this.allLikes.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        })

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.likes = this.allLikes.map((like, i) => ({ id: i + 1, ...like })).slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
        ) as Like[];
    }

}
