import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { RoleEnum } from 'src/app/enums/enums';
import { DBTables } from 'src/classes';
import { DataService } from 'src/app/services';
import { IMarker, IUser } from "src/app/interfaces";

@Component({
    selector: "app-info",
    templateUrl: "./info.component.html",
    styleUrls: ["./info.component.css"],
})
export class InfoComponent implements OnChanges {
    @Input() user?: IUser;
    @Input() marker?: IMarker;

    public isMarkerFavourite: boolean = false;

    @Output() closeEvent = new EventEmitter<void>();
    @Output() editEvent = new EventEmitter<IMarker>();
    @Output() deleteEvent = new EventEmitter<IMarker>();
    @Output() favouriteEvent = new EventEmitter<IMarker>();
    @Output() unfavouriteEvent = new EventEmitter<IMarker>();

    public get roleEnum(): typeof RoleEnum {
        return RoleEnum;
    }

    constructor(private dataService: DataService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.marker.currentValue !== undefined) {
            this.checkIfMarkerIsFavourite();
        }
    }

    checkIfMarkerIsFavourite(): void {
        if (this.user && this.marker) {
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
    }

    closeInfo(): void {
        this.closeEvent.emit();
    }

    editMarker(): void {
        this.editEvent.emit(this.marker);
    }

    deleteMarker(): void {
        this.deleteEvent.emit(this.marker);
    }

    favouriteMarker(): void {
        this.isMarkerFavourite = true;
        this.favouriteEvent.emit(this.marker);
    }

    unfavouriteMarker(): void {
        this.isMarkerFavourite = false;
        this.unfavouriteEvent.emit(this.marker);
    }
}
