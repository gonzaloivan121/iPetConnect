import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RoleEnum } from 'src/app/enums/enums';
import { DBTables, Marker, User } from 'src/classes';
import { DataService } from 'src/app/services';

@Component({
    selector: "app-info",
    templateUrl: "./info.component.html",
    styleUrls: ["./info.component.css"],
})
export class InfoComponent implements OnInit {
    @Input() user?: User;
    @Input() marker: Marker;

    public isMarkerFavourite: boolean = false;

    @Output() closeEvent = new EventEmitter<void>();
    @Output() editEvent = new EventEmitter<any>();
    @Output() deleteEvent = new EventEmitter<any>();
    @Output() favouriteEvent = new EventEmitter<any>();

    public get roleEnum(): typeof RoleEnum {
        return RoleEnum;
    }

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        setTimeout(() => {
            if (this.user) {
                this.dataService.getBothFrom(DBTables.FavouriteMarker, DBTables.User + "/" + DBTables.Marker, this.user.id, this.marker.id).then((response: any) => {
                    console.log(response)
                    if (response.success) {
                        if (response.result.length > 0) {
                            this.isMarkerFavourite = true;
                        } else {
                            this.isMarkerFavourite = false;
                        }
                    } else {
    
                    }
                }).catch((error) => {
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
