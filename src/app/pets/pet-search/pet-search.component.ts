import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, from, of } from "rxjs";
import { catchError, debounceTime, map } from "rxjs/operators";
import { IUser } from 'src/app/interfaces';
import { AlertService, DataService } from "src/app/services";
import { DBTables } from 'src/classes';

@Component({
    selector: "app-pet-search",
    templateUrl: "./pet-search.component.html",
    styleUrls: ["./pet-search.component.css"],
})
export class PetSearchComponent implements OnInit {
    @Input() user: IUser;

    @Output() closeModalEvent = new EventEmitter<void>();
    @Output() userSelectedEvent = new EventEmitter<IUser>();

    public users: IUser[] = [];
    public usersLoaded: Observable<boolean>;

    isSearchFocused: boolean = false;

    @ViewChild("userInput", { static: true }) userInput: HTMLInputElement;

    constructor(
        private dataService: DataService,
        private alertService: AlertService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.usersLoaded = this.getUsers();
    }

    getUsers(): Observable<boolean> {
        return from(
            this.dataService
                .getExcluding(DBTables.User, this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.users = response.result as IUser[];
                    } else {
                        this.alertService.openWarning(response.message);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.alertService.openDanger("There has been an error!");
                })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    selectUser(userEvent: NgbTypeaheadSelectItemEvent<IUser>): void {
        var user: IUser = Object.assign({}, userEvent.item);
        this.router.navigate(["/pets", user.username]);
        this.closeModal();
        //this.location.go("/pets/" + user.username);
    }

    search: OperatorFunction<string, readonly IUser[]> = (
        text$: Observable<string>
    ) =>
        text$.pipe(
            debounceTime(200),
            map((usernameStr) =>
                usernameStr === ""
                    ? []
                    : this.users
                          .filter(
                              (user) =>
                                  JSON.stringify({
                                      username: user.username,
                                      email: user.email,
                                      name: user.name,
                                  })
                                      .toLowerCase()
                                      .indexOf(usernameStr.toLowerCase()) > -1
                          )
                          .slice(0, 10)
            )
        );

    formatter = (user: IUser) => user.username;

    closeModal() {
        this.closeModalEvent.emit();
    }
}
