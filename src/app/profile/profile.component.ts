import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SessionService, DataService } from '../services';
import { User } from '../../classes';
import { RoleEnum } from '../enums/enums';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
    public user: User;

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
