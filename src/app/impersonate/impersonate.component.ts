import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, from, of } from "rxjs";
import { catchError, debounceTime, map } from "rxjs/operators";
import { IUser } from 'src/app/interfaces';
import { AlertService, DataService } from "src/app/services";
import { DBTables } from 'src/classes';

@Component({
    selector: "app-impersonate",
    templateUrl: "./impersonate.component.html",
    styleUrls: ["./impersonate.component.css"],
})
export class ImpersonateComponent implements OnInit {
    public users: IUser[] = [];
    public usersLoaded: Observable<boolean>;

    public selectedUser: IUser;

    isSearchFocused: boolean = false;

    @Output() closeModalEvent = new EventEmitter<void>();
    @Output() userSelectedEvent = new EventEmitter<IUser>();

    @ViewChild("userInput", { static: true }) userInput: HTMLInputElement;

    constructor(
        private dataService: DataService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.usersLoaded = this.getUsers();
    }

    getUsers(): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.User)
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
        this.selectedUser = Object.assign({}, userEvent.item);
        this.emitUserSelectedEvent();
    }

    deleteSelectedUser(): void {
        this.selectedUser = null;
        this.emitUserSelectedEvent();
    }

    emitUserSelectedEvent(): void {
        this.userSelectedEvent.emit(this.selectedUser);
    }

    search: OperatorFunction<string, readonly IUser[]> = (
        text$: Observable<string>
    ) =>
        text$.pipe(
            debounceTime(200),
            map((usernameStr) =>
                usernameStr === ""
                    ? []
                    : this.users.filter((user) => JSON.stringify({ username: user.username, email: user.email, name: user.name }).toLowerCase().indexOf(usernameStr.toLowerCase()) > -1).slice(0, 10)
            )
        );

    formatter = (user: IUser) => user.username;

    closeModal() {
        this.closeModalEvent.emit();
    }
}
