import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SessionService } from 'src/app/services';
import { RoleEnum } from 'src/app/enums/enums';
import { IUser } from 'src/app/interfaces';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
    public user: IUser;

    constructor(
        public location: Location,
        private sessionService: SessionService
    ) { }

    ngOnInit() {
        if (this.sessionService.get('user') !== null) {
            this.user = JSON.parse(this.sessionService.get('user'));
            
            if (this.user.role_id == RoleEnum.Admin) {
                this.location.back();
            }
        } else {
            this.location.back();
        }
    }

}
