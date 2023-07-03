import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { Role } from 'src/classes';
import { from, Observable } from 'rxjs';

@Component({
    selector: 'app-admin-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.css']
})
export class AdminRolesComponent implements OnInit {
    public roles: Role[];
    public allRoles: Role[];

    public hasLoaded: Observable<boolean>;
    
    public searchText = '';
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(
        private dataService: DataService
    ) { }
    
    ngOnInit() {
        const promise = this.dataService.get('role').then((response: any) => {
            if (response.status === 'success') {
                this.roles = response.results as Role[];
                this.allRoles = response.results as Role[];
                this.collectionSize = this.allRoles.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        })

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.roles = this.allRoles.map((role, i) => ({ id: i + 1, ...role })).slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
        ) as Role[];
    }

}
