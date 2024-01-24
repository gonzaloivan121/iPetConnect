import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { from, Observable } from 'rxjs';
import { IMarker } from 'src/app/interfaces';
import { DBTables } from 'src/classes';

@Component({
    selector: "app-admin-markers",
    templateUrl: "./markers.component.html",
    styleUrls: ["./markers.component.css"],
})
export class AdminMarkersComponent implements OnInit {
    public markers: IMarker[];
    public allMarkers: IMarker[];

    public hasLoaded: Observable<boolean>;

    public searchText = "";
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        const promise = this.dataService.get(DBTables.Marker).then((response: any) => {
            if (response.success) {
                response.result.forEach((marker) => {
                    marker.coordinates = JSON.parse(marker.coordinates);
                });
                this.markers = response.result as IMarker[];
                this.allMarkers = response.result as IMarker[];
                this.collectionSize = this.allMarkers.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        });

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.markers = this.allMarkers
            .map((marker, i) => ({ id: i + 1, ...marker }))
            .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize
            ) as IMarker[];
    }

    goToMarkerInMap(marker: IMarker) {
        window.open(
            "https://www.google.com/maps/search/?api=1&query=" +
                marker.coordinates.lat +
                " " +
                marker.coordinates.lng,
            "_blank"
        );
    }
}
