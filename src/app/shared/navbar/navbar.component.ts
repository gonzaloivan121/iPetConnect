import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { SessionService } from '../../services';
import { User } from '../../../classes';
import { RoleEnum } from '../../enums/enums';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public isCollapsed: boolean = true;
    public isLoggedIn: boolean = false;

    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    public user: User;

    public get roleEnum(): typeof RoleEnum {
        return RoleEnum;
    }

    constructor(
        public location: Location,
        private router: Router,
        private sessionService: SessionService
    ) { }

    ngOnInit() {
        if (this.sessionService.get('user') !== null) {
            this.isLoggedIn = true;
            this.user = JSON.parse(this.sessionService.get('user'));
        }
        this.router.events.subscribe((event) => {
            this.isCollapsed = true;
            if (event instanceof NavigationStart) {
                if (event.url != this.lastPoppedUrl) {
                    this.yScrollStack.push(window.scrollY);
                }
            } else if (event instanceof NavigationEnd) {
                if (event.url == this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else {
                    window.scrollTo(0, 0);
                }
            }
        });
        this.location.subscribe((ev:PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
    }

    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee === '#/home' ) {
            return true;
        } else {
            return false;
        }
    }

    isAdmin() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee === '#/admin') {
            return true;
        } else {
            return false;
        }
    }

    isMap() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee === '#/map') {
            return true;
        } else {
            return false;
        }
    }

    isMatch() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee === '#/match') {
            return true;
        } else {
            return false;
        }
    }

    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee === '#/documentation' ) {
            return true;
        } else {
            return false;
        }
    }

    logout() {
        this.sessionService.clear();
        this.isLoggedIn = false;
        this.location.go('/home');
        window.location.reload();
    }
}
