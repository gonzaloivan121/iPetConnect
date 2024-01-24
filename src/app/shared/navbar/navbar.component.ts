import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { SessionService } from 'src/app/services';
import { RoleEnum } from 'src/app/enums/enums';
import { ISocialMediaLink, IUser } from 'src/app/interfaces'

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
    public isCollapsed: boolean = true;
    public isLoggedIn: boolean = false;

    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    public user: IUser;

    public get roleEnum(): typeof RoleEnum {
        return RoleEnum;
    }

    public links: ISocialMediaLink[] = [
        {
            link: "https://www.facebook.com/iPetConnect",
            tooltip: "LIKE_FACEBOOK",
            icon: "fa fa-facebook-square",
            text: "Facebook",
        },
        {
            link: "https://www.instagram.com/iPetConnect",
            tooltip: "FOLLOW_INSTAGRAM",
            icon: "fa fa-instagram",
            text: "Instagram",
        },
        {
            link: "https://twitter.com/iPetConnect",
            tooltip: "FOLLOW_TWITTER",
            icon: "fa fa-twitter-square",
            text: "Twitter",
        },
    ];

    constructor(
        public location: Location,
        private router: Router,
        private sessionService: SessionService
    ) {}

    ngOnInit() {
        if (this.sessionService.get("user") !== null) {
            this.isLoggedIn = true;
            this.user = JSON.parse(this.sessionService.get("user"));
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

        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
    }

    private getPath(): string {
        return this.router.url;
    }

    public isHome(): boolean {
        return this.getPath() === "/home" || this.getPath() === "/";
    }

    public isAdmin(): boolean {
        return this.getPath() === "/admin";
    }

    public isBlog(): boolean {
        return this.getPath() === "/blog";
    }

    public isProfile(): boolean {
        return this.getPath() === "/profile";
    }

    public isRegister(): boolean {
        return this.getPath() === "/register";
    }

    public isLogin(): boolean {
        return this.getPath() === "/login";
    }

    public isMatch(): boolean {
        return this.getPath() === "/match";
    }

    public isMap(): boolean {
        return this.getPath() === "/map";
    }

    public isEditor(): boolean {
        return this.getPath() === "/blog/editor";
    }

    public isPets(): boolean {
        return this.getPath() === "/pets";
    }

    logout() {
        if (this.sessionService.get("user") !== null) {
            this.sessionService.clear("user");
            this.isLoggedIn = false;
            this.location.go("/home");
            window.location.reload();
        }
    }
}
