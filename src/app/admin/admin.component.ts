import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SessionService } from 'src/app/services';
import { RoleEnum, AdminViewEnum, Page } from 'src/app/enums/enums';
import { NavigationService } from 'src/app/services';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    user: any;

    activePage: AdminViewEnum = AdminViewEnum.Dashboard;

    public get adminViewEnum(): typeof AdminViewEnum {
        return AdminViewEnum;
    }

    constructor(
        private sessionService: SessionService,
        private navigationService: NavigationService,
    ) {
        this.navigationService.set(Page.Admin);
    }

    ngOnInit() {
        if (this.sessionService.exists("user")) {
            this.user = JSON.parse(this.sessionService.get("user"));
            if (this.user.role_id != RoleEnum.Admin) {
                this.location.back();
            }
        } else {
            this.location.back();
        }
    }

    changeView(view: AdminViewEnum) {
        this.activePage = view;
    }

}
