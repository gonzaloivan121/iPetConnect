import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services';
import { RoleEnum } from 'src/app/enums/enums';
import { IUser } from 'src/app/interfaces';

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    constructor(
        private sessionService: SessionService
    ) {}

    isLoggedIn: boolean = false;
    isAdmin: boolean = false;
    isBlogger: boolean = false;
    isUser: boolean = false;

    ngOnInit() {
        if (this.sessionService.get("user") !== null) {
            this.isLoggedIn = true;
            var user: IUser = JSON.parse(this.sessionService.get("user"));
            this.isAdmin = user.role_id === RoleEnum.Admin;
            this.isBlogger = user.role_id === RoleEnum.Blogger;
            this.isUser = user.role_id === RoleEnum.User;
        }
    }
}
