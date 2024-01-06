import { Component, Output, EventEmitter } from '@angular/core';
import { IMapLegendIcon } from 'src/app/interfaces';

@Component({
    selector: "app-map-legend",
    templateUrl: "./legend.component.html",
    styleUrls: ["./legend.component.css"],
})
export class LegendComponent {
    @Output() filterMarkersEvent = new EventEmitter<string>();

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

    constructor() {}

    filterMarkers(icon: IMapLegendIcon) {
        icon.active = !icon.active;
        this.filterMarkersEvent.emit(icon.type);
    }
}
