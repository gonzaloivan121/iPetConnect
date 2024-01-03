import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { AdminViewEnum } from '../../enums/enums';

@Component({
    selector: 'app-admin-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
    @Input() user?: any;
    @Input() activePage: AdminViewEnum;

    @Output() viewEvent = new EventEmitter<AdminViewEnum>();

    // http://www.bootstrapdash.com/demo/purple-admin-free/pages/tables/basic-table.html
    availablePages = [
        {
            name: 'DASHBOARD',
            view: AdminViewEnum.Dashboard
        },
        {
            name: 'USERS',
            view: AdminViewEnum.Users
        },
        {
            name: 'ROLES',
            view: AdminViewEnum.Roles
        },
        {
            name: 'PETS',
            view: AdminViewEnum.Pets
        },
        {
            name: 'SPECIES',
            view: AdminViewEnum.Species
        },
        {
            name: 'BREEDS',
            view: AdminViewEnum.Breeds
        },
        {
            name: 'LIKES',
            view: AdminViewEnum.Likes
        },
        {
            name: 'MATCHES',
            view: AdminViewEnum.Matches
        },
        {
            name: 'CHATS',
            view: AdminViewEnum.Chats
        },
        {
            name: 'MESSAGES',
            view: AdminViewEnum.Messages
        },
        {
            name: 'MARKERS',
            view: AdminViewEnum.Markers
        },
    ]

    public get adminViewEnum(): typeof AdminViewEnum {
        return AdminViewEnum;
    }

    constructor() { }

    ngOnInit() {
        
    }

    changeView(view: AdminViewEnum) {
        this.viewEvent.emit(view);
    }

}
