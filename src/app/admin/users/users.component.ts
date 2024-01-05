import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { User } from 'src/classes';
import { from, Observable } from 'rxjs';

@Component({
    selector: 'app-admin-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class AdminUsersComponent implements OnInit {
    public users: User[];
    public allUsers: User[];

    public hasLoaded: Observable<boolean>;

    public searchText = '';
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(
        private dataService: DataService
    ) { }

    ngOnInit() {
        const promise = this.dataService.get('user').then((response: any) => {
            if (response.success) {
                this.users = response.result as User[];
                this.allUsers = response.result as User[];
                this.collectionSize = this.allUsers.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        })

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.users = this.allUsers.map((user, i) => ({ id: i + 1, ...user })).slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
        ) as User[];
    }

}
