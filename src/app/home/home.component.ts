import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services';
import { RoleEnum } from 'src/app/enums/enums';
import { User } from 'src/classes';

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

    ngOnInit() {
        if (this.sessionService.get("user") !== null) {
            this.isLoggedIn = true;
            var user: User = JSON.parse(this.sessionService.get("user"));
            this.isAdmin = user.role_id === RoleEnum.Admin;
        }
    }
}
