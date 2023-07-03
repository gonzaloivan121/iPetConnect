import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SessionService } from '../services';

@Component({
    selector: '',
    template: '',
    styleUrls: []
})
export class LogoutComponent implements OnInit {
    constructor(
        private sessionService: SessionService,
        public location: Location
    ) { }

    ngOnInit() {
        if (this.sessionService.get('user') !== null) {
            this.sessionService.clear();
            this.location.go('/home');
            window.location.reload();
        }
    }
}
