import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../../classes';
import { RoleEnum } from '../../../enums/enums';

@Component({
    selector: 'app-user-dropdown',
    templateUrl: './user-dropdown.component.html',
    styleUrls: ['./user-dropdown.component.css']
})
export class UserDropdownComponent implements OnInit {

    @Input() user?: User;

    public get roleEnum(): typeof RoleEnum {
        return RoleEnum;
    }

    constructor() { }

    ngOnInit(): void {

    }

}
