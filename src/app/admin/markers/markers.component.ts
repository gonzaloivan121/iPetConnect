import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { Marker } from 'src/classes';
import { from, Observable } from 'rxjs';

@Component({
    selector: 'app-admin-markers',
    templateUrl: './markers.component.html',
    styleUrls: ['./markers.component.css']
})
export class AdminMarkersComponent implements OnInit {
    public markers: Marker[];
    public allMarkers: Marker[];

    public hasLoaded: Observable<boolean>;

    public searchText = '';
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(
        private dataService: DataService
    ) { }

    ngOnInit() {
        const promise = this.dataService.get('marker').then((response: any) => {
            if (response.status === 'success') {
                response.results.forEach(marker => {
                    marker.coordinates = JSON.parse(marker.coordinates);
                });
                this.markers = response.results as Marker[];
                this.allMarkers = response.results as Marker[];
                this.collectionSize = this.allMarkers.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        })

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.markers = this.allMarkers.map((marker, i) => ({ id: i + 1, ...marker })).slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
        ) as Marker[];
    }

}
