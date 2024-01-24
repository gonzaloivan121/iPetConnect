import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISocialMediaLink } from 'src/app/interfaces'

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

    constructor(private router: Router) {}

    ngOnInit(): void {}

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
}
