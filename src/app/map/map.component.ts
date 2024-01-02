import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { DataService, SessionService } from 'src/app/services';
import { User } from 'src/classes';
import { MarkerTypeEnum } from '../enums/enums';
import { IMarkerResponse } from 'src/app/interfaces'

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    public apiLoaded: Observable<boolean>;
    public user: User;
    public isLoggedIn: boolean = false;
    public firstLoad: boolean = true;

    @ViewChild('myGoogleMap', { static: false })
    map!: GoogleMap;
    @ViewChild(MapInfoWindow, { static: false })
    infoWindow!: MapInfoWindow;

    maxZoom = 20;
    minZoom = 5;
    zoom = 14;
    center!: google.maps.LatLng;
    options: google.maps.MapOptions = {
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: true,
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        mapId: '2507019de16e1d9f',
        gestureHandling: 'greedy',
        //disableDefaultUI: true,
    }
    markers: any[] = [];
    selectedMarker: MapMarker;

    constructor(
        private httpClient: HttpClient,
        private dataService: DataService,
        private sessionService: SessionService
    ) { }

    ngOnInit(): void {
        if (this.sessionService.get('user') !== null) {
            this.isLoggedIn = true;
            this.user = JSON.parse(this.sessionService.get('user'));
        }

        this.apiLoaded = this.httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`, 'callback')
        .pipe(
            map(() => true),
            catchError(() => of(false)),
        );
    }

    setCurrentPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.center = new google.maps.LatLng({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    this.handleLocationError(true, this.map.googleMap.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            this.handleLocationError(false, this.map.googleMap.getCenter());
        }
    }

    handleLocationError(browserHasGeolocation: boolean, position) {
        this.infoWindow.infoWindow.setPosition(position)
        this.infoWindow.infoWindow.setContent(
            browserHasGeolocation ?
                "Error: El servicio de Geolocalización ha fallado." :
                "Error: Tu navegador no soporta el servicio de Geolocalización."
        );
        this.infoWindow.open();
    }

    generateIcons() {
        const iconBase = "./assets/img/markers/";
        const size = new google.maps.Size(32, 32);
        const origin = new google.maps.Point(0, 0);
        const anchor = new google.maps.Point(16, 32);

        const icons = {
            RESCUE: { url: iconBase + "marker_rescue.png", size, origin, anchor },
            URGENCY: { url: iconBase + "marker_urgency.png", size, origin, anchor },
            VETERINARY: { url: iconBase + "marker_veterinary.png", size, origin, anchor },
            CARER: { url: iconBase + "marker_carer.png", size, origin, anchor },
            ADOPTION: { url: iconBase + "marker_adoption.png", size, origin, anchor },
            INFORMATION: { url: iconBase + "marker_information.png", size, origin, anchor }
        };

        return icons;
    }

    loadMarkersFromDataService() {
        this.dataService.get('marker').then((response: any) => {
            if (response.status === 'success') {
                let markers = response.results;
                let bounds = new google.maps.LatLngBounds();
                let icons = this.generateIcons();

                markers.forEach(markerObj => {
                    let marker = this.generateMarker(markerObj, icons);
                    this.markers.push(marker);
                    bounds.extend(markerObj.coordinates);
                });

                this.center = bounds.getCenter();
                this.map.fitBounds(bounds);
            }
        })
    }

    generateMarker(marker, icons) {
        marker.coordinates = new google.maps.LatLng(JSON.parse(marker.coordinates));

        return {
            position: marker.coordinates,
            title: marker.title,
            icon: icons[marker.type],
            animation: google.maps.Animation.DROP,
            data: marker
        }
    }

    eventHandler(event: any, name: string) {
        console.log(event, name);

        switch(name) {
            case 'mapDblclick':
                if (!this.user) return;

                const coordinates = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                }

                this.createTestMarker(coordinates);
                break;
            case 'idle':
                if (this.firstLoad) {
                    this.setCurrentPosition();
                    this.loadMarkersFromDataService();
                    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('go-to-location'));
                    this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(document.getElementById('add-marker'));
                    this.firstLoad = false;
                }
                break;
        }
    }

    openInfo(marker: MapMarker, markerData) {
        this.infoWindow.close();
        this.selectedMarker = markerData;
        this.infoWindow.open(marker);
        this.map.zoom = 15;
        this.center = marker.getPosition();
    }

    closeInfo() {
        this.infoWindow.close();
    }

    editMarker(marker) {
        console.log('edit from map', marker)
    }

    deleteMarker(marker) {
        console.log('delete from map', marker)
    }

    favouriteMarker(marker) {
        console.log('favourite from map', marker)
    }

    createTestMarker(latLng) {
        const types = ['RESCUE', 'URGENCY', 'VETERINARY', 'CARER', 'ADOPTION', 'INFORMATION'];
        const species = [1, 2, 3, 4];
        const breeds = {
            "1": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 38],
            "2": [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 39, 40],
            "3": [31, 32, 33, 34, 35, 36, 37],
            "4": [25, 26, 27, 28, 29, 30]
        };

        const species_id = this.random(species);

        const request = {
            id: null,
            species_id: species_id,
            breed_id: this.random(breeds[species_id]),
            user_id: this.user.id,
            title: "Random ",
            description: "Random... ",
            type: this.random(types),
            color: "Test color",
            coordinates: JSON.stringify(latLng),
            image: null
        }

        this.dataService.insert('marker', request).then((response: IMarkerResponse) => {
            if (response.success) {
                request.id = response.result.insertId;
                let icons = this.generateIcons();
                let marker = this.generateMarker(request, icons);
                this.markers.push(marker);
            } else {
                
            }
        });
    }

    random(arr: Array<number | string>): number | string {
        return arr[Math.floor((Math.random() * arr.length))];
    }

    filterMarkers(arr) {
        
    }
}
