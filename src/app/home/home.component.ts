import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    constructor(
        private sessionService: SessionService
    ) { }

    isLoggedIn: boolean = false;

    ngOnInit() {
        if (this.sessionService.get('user') !== null) {
            this.isLoggedIn = true;
        }
    }
}
