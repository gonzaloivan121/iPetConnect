import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RoleEnum } from 'src/app/enums/enums';
import { Marker, User } from 'src/classes';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.css']
})
export class InfoComponent {
    @Input() user?: User;
    @Input() marker: Marker;
    @Output() closeEvent = new EventEmitter<void>();
    @Output() editEvent = new EventEmitter<any>();
    @Output() deleteEvent = new EventEmitter<any>();
    @Output() favouriteEvent = new EventEmitter<any>();

    public get roleEnum(): typeof RoleEnum {
        return RoleEnum;
    }

    constructor() { }

    closeInfo() {
        this.closeEvent.emit();
    }

    editMarker() {
        this.editEvent.emit(this.marker)
    }
    
    deleteMarker() {
        this.deleteEvent.emit(this.marker)
    }
    
    favouriteMarker() {
        this.favouriteEvent.emit(this.marker)
    }
}
