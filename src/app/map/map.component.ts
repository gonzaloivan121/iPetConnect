import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { DataService, SessionService, AlertService, NavigationService, LoadingService } from 'src/app/services';
import { DBTables } from 'src/classes';
import { IMarkerResponse, IMarker, IUser, IFavouriteMarker, ICoordinates } from 'src/app/interfaces';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Page } from 'src/app/enums/enums';

@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.css"],
})
export class MapComponent implements OnInit {
    public apiLoaded: Observable<boolean>;
    public markersLoaded: Observable<boolean>;
    public favouriteMarkersLoaded: Observable<boolean>;
    public myMarkersLoaded: Observable<boolean>;

    public user: IUser;
    public isLoggedIn: boolean = false;
    public firstLoad: boolean = true;
    public showGoToLocationButton: boolean = false;

    public favouriteMarkers: IMarker[] = [];
    public myMarkers: IMarker[] = [];

    @ViewChild("myGoogleMap", { static: false }) map!: GoogleMap;
    @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;
    @ViewChild("search", { static: false }) searchBoxElement: ElementRef;
    @ViewChild("createMarkerContent", { static: false })
    createMarkerContent: ElementRef;
    @ViewChild("editMarkerContent", { static: false })
    editMarkerContent: ElementRef;
    @ViewChild("deleteMarkerContent", { static: false })
    deleteMarkerContent: ElementRef;

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
        mapId: environment.googleMapsMapId,
        gestureHandling: "greedy",
        zoom: this.zoom,
        //disableDefaultUI: true,
    };
    markers: google.maps.Marker[] = [];
    selectedMarker: IMarker;
    searchBox: google.maps.places.SearchBox;

    filterCategories: string[] = [];

    isSidebarOpen: boolean = false;
    isSearchbarFocused: boolean = false;

    createMarkerCoordinates: ICoordinates;

    constructor(
        private httpClient: HttpClient,
        private dataService: DataService,
        private sessionService: SessionService,
        private alertService: AlertService,
        private modalService: NgbModal,
        private navigationService: NavigationService,
        private loadingService: LoadingService
    ) {
        this.navigationService.set(Page.Map);
    }

    ngOnInit(): void {
        if (this.sessionService.exists("user")) {
            this.isLoggedIn = true;
            this.user = JSON.parse(this.sessionService.get("user"));
        }

        this.apiLoaded = this.httpClient
            .jsonp(
                `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`,
                "callback"
            )
            .pipe(
                map(() => true),
                catchError(() => of(false))
            );

        if (this.user) {
            this.favouriteMarkersLoaded = this.loadFavouriteMarkers();
            this.myMarkersLoaded = this.loadMyMarkers();
        }
    }

    setCurrentPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.center = new google.maps.LatLng({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });

                this.setZoom(15);
            });
        }
    }

    generateIcons() {
        const iconBase = "./assets/img/markers/";
        const size = new google.maps.Size(32, 32);
        const origin = new google.maps.Point(0, 0);
        const anchor = new google.maps.Point(16, 32);

        const icons = {
            RESCUE: {
                url: iconBase + "marker_rescue.png",
                size,
                origin,
                anchor,
            },
            URGENCY: {
                url: iconBase + "marker_urgency.png",
                size,
                origin,
                anchor,
            },
            VETERINARY: {
                url: iconBase + "marker_veterinary.png",
                size,
                origin,
                anchor,
            },
            CARER: { url: iconBase + "marker_carer.png", size, origin, anchor },
            ADOPTION: {
                url: iconBase + "marker_adoption.png",
                size,
                origin,
                anchor,
            },
            INFORMATION: {
                url: iconBase + "marker_information.png",
                size,
                origin,
                anchor,
            },
        };

        return icons;
    }

    loadMarkersFromDataService(): Observable<boolean> {
        return from(
            this.dataService.get(DBTables.Marker).then((response: any) => {
                if (response.success) {
                    let markers = response.result as IMarker[];
                    let bounds = new google.maps.LatLngBounds();
                    let icons = this.generateIcons();

                    markers.forEach((markerObj) => {
                        let marker = this.generateMarker(markerObj, icons);
                        this.markers.push(marker);
                        bounds.extend(markerObj.coordinates);
                    });

                    this.center = bounds.getCenter();
                    this.map.fitBounds(bounds);
                }
            })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    generateMarker(marker, icons) {
        marker.coordinates = new google.maps.LatLng(
            JSON.parse(marker.coordinates)
        );

        var googleMarker = new google.maps.Marker();
        googleMarker.setPosition(marker.coordinates);
        googleMarker.setTitle(marker.title);
        googleMarker.setIcon(icons[marker.type]);
        googleMarker.setAnimation(google.maps.Animation.DROP);
        googleMarker.set("data", marker);

        return googleMarker;
    }

    eventHandler(event: any, name: string) {
        switch (name) {
            case "mapDblclick":
                if (!this.user) return;

                this.createMarkerCoordinates = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                };

                this.openMarkerModal(this.createMarkerContent);
                break;
            case "idle":
                if (this.firstLoad) {
                    this.initMap();
                    this.firstLoad = false;
                }
                break;
            case "zoomChanged":
                break;
        }
    }

    initMap() {
        this.loadingService.open();

        this.markersLoaded = this.loadMarkersFromDataService();
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
            document.getElementById("go-to-location")
        );
        this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(
            document.getElementById("toggle-sidebar")
        );
        this.searchBox = new google.maps.places.SearchBox(
            this.searchBoxElement.nativeElement
        );
        this.map.googleMap.addListener("bounds_changed", () => {
            this.searchBox.setBounds(this.map.getBounds());
        });
        this.searchBox.addListener("places_changed", () => {
            this.search();
        });

        this.loadingService.close();
    }

    search() {
        const places: google.maps.places.PlaceResult[] =
            this.searchBox.getPlaces();

        if (places.length == 0) return;

        const bounds = new google.maps.LatLngBounds();

        places.forEach((place: google.maps.places.PlaceResult) => {
            if (!place.geometry || !place.geometry.location) {
                console.warn("Returned place contains no geometry");
                return;
            }

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

            this.map.fitBounds(bounds);
        });
    }

    openInfo(marker: MapMarker, markerData: IMarker) {
        this.infoWindow.close();
        this.selectedMarker = markerData;
        this.infoWindow.open(marker);
        this.setZoom(15);
        this.center = marker.getPosition();
    }

    setZoom(zoom: number) {
        this.zoom = zoom;
        this.map.googleMap.setZoom(this.zoom);
    }

    closeInfo() {
        this.infoWindow.close();
    }

    editMarker(marker: IMarker) {
        this.selectedMarker = marker;
        this.openMarkerModal(this.editMarkerContent);
    }

    deleteMarker(marker: IMarker) {
        this.selectedMarker = marker;
        this.openMarkerModal(this.deleteMarkerContent);
    }

    favouriteMarker(marker: IMarker) {
        const data = {
            user_id: this.user.id,
            marker_id: marker.id,
        };

        this.dataService
            .insert(DBTables.FavouriteMarker, data)
            .then((response: any) => {
                if (response.success) {
                    this.alertService.openSuccess(response.message);
                    this.favouriteMarkers.push(marker);
                } else {
                    this.alertService.openWarning(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                this.alertService.openDanger("There has been an error.");
            });
    }

    unfavouriteMarker(marker: IMarker) {
        console.log("unfavourite from map", marker);

        this.dataService
            .getBothFrom(
                DBTables.FavouriteMarker,
                DBTables.User + "/" + DBTables.Marker,
                this.user.id,
                marker.id
            )
            .then((response: any) => {
                if (response.success) {
                    const favouriteMarker = response
                        .result[0] as IFavouriteMarker;
                    this.deleteFavouriteMarker(favouriteMarker, marker);
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    deleteFavouriteMarker(favouriteMarker: IFavouriteMarker, marker: IMarker) {
        this.dataService
            .delete(DBTables.FavouriteMarker, favouriteMarker)
            .then((response: any) => {
                if (response.success) {
                    this.alertService.openSuccess(response.message);
                    this.favouriteMarkers.splice(
                        this.favouriteMarkers.indexOf(marker),
                        1
                    );
                } else {
                    this.alertService.openWarning(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                this.alertService.openDanger("There has been an error.");
            });
    }

    filterMarkers(type: string) {
        if (this.filterCategories.includes(type)) {
            this.filterCategories.splice(
                this.filterCategories.indexOf(type),
                1
            );
        } else {
            this.filterCategories.push(type);
        }

        var bounds = new google.maps.LatLngBounds();

        this.markers.forEach((marker) => {
            if (
                this.filterCategories.includes(marker.get("data").type) ||
                this.filterCategories.length == 0
            ) {
                marker.setVisible(true);
                bounds.extend(marker.getPosition());
            } else {
                marker.setVisible(false);
            }
        });

        if (!bounds.isEmpty()) {
            this.center = bounds.getCenter();
            this.map.fitBounds(bounds);
        }
    }

    goToMarker(marker: IMarker) {
        const gMarker = this.markers.filter(
            (gm) => gm.get("data").id === marker.id
        )[0];
        this.setZoom(17);
        this.center = gMarker.getPosition();
        this.isSidebarOpen = false;
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    loadFavouriteMarkers(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(DBTables.FavouriteMarker, DBTables.User, this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.favouriteMarkers = response.result as IMarker[];
                    } else {
                        console.error(response.message);
                    }
                })
                .catch((error) => console.error(error))
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    loadMyMarkers(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(DBTables.Marker, DBTables.User, this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.myMarkers = response.result as IMarker[];
                    } else {
                        console.error(response.message);
                    }
                })
                .catch((error) => console.error(error))
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    openMarkerModal(content) {
        this.modalService.open(content, { centered: true });
    }

    createMarker(marker: IMarker, closeEvent: any) {
        marker.user_id = this.user.id;
        marker.coordinates = this.createMarkerCoordinates;

        const request: any = marker;
        request.coordinates = JSON.stringify(this.createMarkerCoordinates);

        this.dataService
            .insert(DBTables.Marker, request)
            .then((response: IMarkerResponse) => {
                if (response.success) {
                    marker.id = response.result.insertId;
                    marker.created_at = new Date(response.created_at);
                    marker.updated_at = new Date(response.created_at);

                    let icons = this.generateIcons();
                    let mapMarker = this.generateMarker(marker, icons);
                    this.markers.push(mapMarker);
                    this.myMarkers.push(marker);

                    closeEvent("Marker created");
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    handleEditMarker(marker, closeEvent: any) {
        const request: any = Object.assign({}, marker);
        request.coordinates = JSON.stringify({
            lat: marker.coordinates.lat(),
            lng: marker.coordinates.lng(),
        });

        console.log(request);

        this.dataService
            .update(DBTables.Marker, request)
            .then((response: IMarkerResponse) => {
                if (response.success) {
                    let icons = this.generateIcons();
                    const markerToEdit = this.markers.filter(
                        (m) => (m.get("data") as IMarker).id === marker.id
                    )[0];
                    markerToEdit.setTitle(marker.title);
                    markerToEdit.setIcon(icons[marker.type]);
                    markerToEdit.set("data", marker);
                    this.selectedMarker = marker;

                    closeEvent("Marker edited");
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    handleDeleteMarker(closeEvent: any) {
        this.dataService
            .delete(DBTables.Marker, this.selectedMarker)
            .then((response: any) => {
                if (response.success) {
                    const markerToDelete = this.markers.filter(
                        (m) =>
                            (m.get("data") as IMarker).id ===
                            this.selectedMarker.id
                    )[0];
                    const myMarkerToDelete = this.myMarkers.filter(
                        (m) =>
                            m.id ===
                            this.selectedMarker.id
                    )[0];
                    this.infoWindow.close();
                    this.markers.splice(
                        this.markers.indexOf(markerToDelete),
                        1
                    );
                    this.myMarkers.splice(
                        this.myMarkers.indexOf(myMarkerToDelete),
                        1
                    );
                    this.selectedMarker = null;

                    closeEvent("Marker deleted");
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => console.error(error));
    }
}
