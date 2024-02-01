import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { NavigationService, SessionService } from 'src/app/services';
import { Page, RoleEnum } from 'src/app/enums/enums';
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
        private sessionService: SessionService,
        private navigationService: NavigationService
    ) {}

    ngOnInit() {
        if (this.sessionService.exists("user")) {
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

    public isHome(): boolean {
        return this.navigationService.is(Page.Home);
    }

    public isAdmin(): boolean {
        return this.navigationService.is(Page.Admin);
    }

    public isBlog(): boolean {
        return this.navigationService.is(Page.Blog);
    }

    public isProfile(): boolean {
        return this.navigationService.is(Page.Profile);
    }

    public isRegister(): boolean {
        return this.navigationService.is(Page.Register);
    }

    public isLogin(): boolean {
        return this.navigationService.is(Page.Login);
    }

    public isMatch(): boolean {
        return this.navigationService.is(Page.Match);
    }

    public isMap(): boolean {
        return this.navigationService.is(Page.Map);
    }

    public isEditor(): boolean {
        return this.navigationService.is(Page.BlogEditor);
    }

    public isPets(): boolean {
        return this.navigationService.is(Page.Pets);
    }

    logout() {
        if (this.sessionService.exists("user")) {
            this.sessionService.clear("user");
            this.isLoggedIn = false;
            this.location.go("/home");
            window.location.reload();
        }
    }
}
