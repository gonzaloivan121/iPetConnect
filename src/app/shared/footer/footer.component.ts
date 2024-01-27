import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'src/app/enums/enums';
import { ISocialMediaLink } from 'src/app/interfaces';
import { NavigationService } from 'src/app/services';

@Component({
    selector: "app-footer",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
    date: Date = new Date();

    public links: ISocialMediaLink[] = [
        {
            link: "https://www.facebook.com/iPetConnect",
            tooltip: "LIKE_FACEBOOK",
            icon: "fa fa-facebook-square",
            text: "facebook",
        },
        {
            link: "https://www.instagram.com/iPetConnect",
            tooltip: "FOLLOW_INSTAGRAM",
            icon: "fa fa-instagram",
            text: "instagram",
        },
        {
            link: "https://twitter.com/iPetConnect",
            tooltip: "FOLLOW_TWITTER",
            icon: "fa fa-twitter-square",
            text: "twitter",
        },
    ];

    constructor(
        private router: Router,
        private navigationService: NavigationService
    ) {}

    ngOnInit(): void {}

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
}
