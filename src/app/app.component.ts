import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ChildrenOutletContexts } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { AppConfigService, TranslateService, SessionService, NavigationService } from 'src/app/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IUser } from 'src/app/interfaces';
import { Page } from './enums/enums';

var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = 0;

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
    private _router: Subscription;
    isAuthenticated: boolean;
    isImpersonating: boolean;

    selectedUserToImpersonate: IUser = null;

    @ViewChild("impersonateContent", { static: false })
    impersonateContent: ElementRef;

    constructor(
        private renderer: Renderer2,
        private router: Router,
        @Inject(DOCUMENT) private document: any,
        private element: ElementRef,
        private contexts: ChildrenOutletContexts,
        public location: Location,
        public appConfig: AppConfigService,
        public translateService: TranslateService,
        private sessionService: SessionService,
        private modalService: NgbModal,
        private navigationService: NavigationService
    ) {}

    @HostListener("window:scroll", ["$event"])
    hasScrolled() {
        if (this.isHeaderFixed()) {
            return;
        }

        var st = window.pageYOffset;
        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - st) <= delta) return;

        var navbar = document.getElementsByTagName("nav")[0];

        // If they scrolled down and are past the navbar, add class .headroom--unpinned.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight) {
            // Scroll Down
            if (navbar.classList.contains("headroom--pinned")) {
                navbar.classList.remove("headroom--pinned");
                navbar.classList.add("headroom--unpinned");
            }
            // $('.navbar.headroom--pinned').removeClass('headroom--pinned').addClass('headroom--unpinned');
        } else {
            // Scroll Up
            //  $(window).height()
            if (st + window.innerHeight < document.body.scrollHeight) {
                // $('.navbar.headroom--unpinned').removeClass('headroom--unpinned').addClass('headroom--pinned');
                if (navbar.classList.contains("headroom--unpinned")) {
                    navbar.classList.remove("headroom--unpinned");
                    navbar.classList.add("headroom--pinned");
                }
            }
        }

        lastScrollTop = st;
    }

    isHeaderFixed(): boolean {
        return (
            this.navigationService.is(Page.Pets) ||
            this.navigationService.is(Page.PetsProfile) ||
            this.navigationService.is(Page.Match) ||
            this.navigationService.is(Page.Map)
        );
    }

    ngOnInit() {
        var navbar: HTMLElement =
            this.element.nativeElement.children[0].children[0];
        this._router = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if (window.outerWidth > 991) {
                    window.document.children[0].scrollTop = 0;
                } else {
                    window.document.activeElement.scrollTop = 0;
                }

                this.renderer.listen("window", "scroll", (event) => {
                    const number = window.scrollY;
                    if (number > 150 || window.pageYOffset > 150) {
                        // add logic
                        navbar.classList.add("headroom--not-top");
                    } else {
                        // remove logic
                        navbar.classList.remove("headroom--not-top");
                    }
                });
            });
        this.hasScrolled();
    }

    ngOnDestroy(): void {
        if (this.sessionService.exists("remember")) {
            if (!JSON.parse(this.sessionService.get("remember"))) {
                this.sessionService.clear("user");
            }
        }
    }

    getRouteAnimationData() {
        return this.contexts.getContext("primary")?.route?.snapshot?.data?.[
            "animation"
        ];
    }

    openImpersonateModal(): void {
        this.modalService.open(this.impersonateContent, { centered: true });
    }

    impersonate(dismiss: Function): void {
        dismiss("Impersonate button click");

        this.sessionService.set("user", JSON.stringify(this.selectedUserToImpersonate));
        this.selectedUserToImpersonate = null;
        this.isImpersonating = true;
        window.location.reload();
    }

    selectUser(user: IUser) {
        this.selectedUserToImpersonate = user;
    }
}
