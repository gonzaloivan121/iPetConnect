import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RoleEnum } from 'src/app/enums/enums';
import { DBTables } from 'src/classes';
import { DataService } from 'src/app/services';
import { IMarker, IUser } from "src/app/interfaces";

@Component({
    selector: "app-info",
    templateUrl: "./info.component.html",
    styleUrls: ["./info.component.css"],
})
export class InfoComponent implements OnInit {
    @Input() user?: IUser;
    @Input() marker: IMarker;

    public isMarkerFavourite: boolean = false;

    @Output() closeEvent = new EventEmitter<void>();
    @Output() editEvent = new EventEmitter<IMarker>();
    @Output() deleteEvent = new EventEmitter<IMarker>();
    @Output() favouriteEvent = new EventEmitter<IMarker>();

    public get roleEnum(): typeof RoleEnum {
        return RoleEnum;
    }

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        setTimeout(() => {
            if (this.user) {
                this.dataService
                    .getBothFrom(
                        DBTables.FavouriteMarker,
                        DBTables.User + "/" + DBTables.Marker,
                        this.user.id,
                        this.marker.id
                    )
                    .then((response: any) => {
                        if (response.success) {
                            if (response.result.length > 0) {
                                this.isMarkerFavourite = true;
                            } else {
                                this.isMarkerFavourite = false;
                            }
                        } else {
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }, 500);
    }

    closeInfo() {
        this.closeEvent.emit();
    }

    editMarker() {
        this.editEvent.emit(this.marker);
    }

    deleteMarker() {
        this.deleteEvent.emit(this.marker);
    }

    favouriteMarker() {
        this.favouriteEvent.emit(this.marker);
    }
}
