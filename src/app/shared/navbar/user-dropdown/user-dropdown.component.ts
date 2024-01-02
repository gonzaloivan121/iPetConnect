import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/classes';
import { RoleEnum } from 'src/app/enums/enums';

@Component({
    selector: 'app-user-dropdown',
    templateUrl: './user-dropdown.component.html',
    styleUrls: ['./user-dropdown.component.css']
})
export class UserDropdownComponent implements OnInit {

    @Input() user?: User;

    @Output() logoutEvent = new EventEmitter<void>();

    public get roleEnum(): typeof RoleEnum {
        return RoleEnum;
    }

    constructor() { }

    ngOnInit(): void {

    }

    logout() {
        this.logoutEvent.emit();
    }

}
