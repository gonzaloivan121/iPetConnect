import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { IMapLegendIcon } from 'src/app/interfaces';
import { DataService, SessionService } from 'src/app/services';
import { DBTables, Marker, User } from 'src/classes';

@Component({
    selector: "app-map-legend",
    templateUrl: "./legend.component.html",
    styleUrls: ["./legend.component.css"],
})
export class LegendComponent implements OnInit {
    public markersLoaded: Observable<boolean>;

    @Output() filterMarkersEvent = new EventEmitter<string>();
    @Output() goToMarkerEvent = new EventEmitter<Marker>();

    markers: Marker[] = [];
    user: User;

    iconBase = "./assets/img/markers/";
    icons: IMapLegendIcon[] = [
        {
            url: this.iconBase + "marker_rescue.png",
            type: "RESCUE",
            active: false,
        },
        {
            url: this.iconBase + "marker_urgency.png",
            type: "URGENCY",
            active: false,
        },
        {
            url: this.iconBase + "marker_veterinary.png",
            type: "VETERINARY",
            active: false,
        },
        {
            url: this.iconBase + "marker_carer.png",
            type: "CARER",
            active: false,
        },
        {
            url: this.iconBase + "marker_adoption.png",
            type: "ADOPTION",
            active: false,
        },
        {
            url: this.iconBase + "marker_information.png",
            type: "INFORMATION",
            active: false,
        },
    ];

    constructor(
        private dataService: DataService,
        private sessionService: SessionService
    ) {}

    ngOnInit(): void {
        if (this.sessionService.get("user") !== null) {
            this.user = JSON.parse(this.sessionService.get("user"));
        }

        if (this.user) {
            this.markersLoaded = this.loadFavouriteMarkers();
        }
    }

    loadFavouriteMarkers(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(DBTables.FavouriteMarker, DBTables.User, this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.markers = response.result as Marker[];
                    } else {
                        console.error(response.message)
                    }
                })
                .catch((error) => console.error(error))
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    filterMarkers(icon: IMapLegendIcon) {
        icon.active = !icon.active;
        this.filterMarkersEvent.emit(icon.type);
    }

    goToMarker(marker: Marker) {
        this.goToMarkerEvent.emit(marker);
    }
}
