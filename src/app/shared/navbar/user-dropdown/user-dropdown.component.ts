import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RoleEnum } from 'src/app/enums/enums';
import { IUser } from 'src/app/interfaces';

@Component({
    selector: "app-user-dropdown",
    templateUrl: "./user-dropdown.component.html",
    styleUrls: ["./user-dropdown.component.css"],
})
export class UserDropdownComponent implements OnInit {
    @Input() user?: IUser;

    @Output() logoutEvent = new EventEmitter<void>();
    @Output() impersonateEvent = new EventEmitter<void>();

    public get roleEnum(): typeof RoleEnum {
        return RoleEnum;
    }

    constructor() {}

    ngOnInit(): void {}

    logout(): void {
        this.logoutEvent.emit();
    }

    impersonate(): void {
        this.impersonateEvent.emit();
    }
}
