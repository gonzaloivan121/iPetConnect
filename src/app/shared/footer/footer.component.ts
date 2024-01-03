import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISocialMediaLink } from 'src/app/interfaces'

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    date: Date = new Date();

    public links: ISocialMediaLink[] = [
        {
            link: "https://www.facebook.com/iPetConnect",
            tooltip: "LIKE_FACEBOOK",
            icon: "fa fa-facebook-square",
            text: "facebook"
        },
        {
            link: "https://www.instagram.com/iPetConnect",
            tooltip: "FOLLOW_INSTAGRAM",
            icon: "fa fa-instagram",
            text: "instagram"
        },
        {
            link: "https://twitter.com/iPetConnect",
            tooltip: "FOLLOW_TWITTER",
            icon: "fa fa-twitter-square",
            text: "twitter"
        },
    ];

    constructor(private router: Router ) {}

    ngOnInit() {

    }

    getPath(){
        return this.router.url;
    }
}
