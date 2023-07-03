import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-map-legend',
    templateUrl: './legend.component.html',
    styleUrls: ['./legend.component.css']
})
export class LegendComponent {
    @Output() filterEvent = new EventEmitter<any>();

    iconBase = "./assets/img/markers/";
    icons: any = {
        RESCUE: { url: this.iconBase + "marker_rescue.png" },
        URGENCY: { url: this.iconBase + "marker_urgency.png" },
        VETERINARY: { url: this.iconBase + "marker_veterinary.png" },
        CARER: { url: this.iconBase + "marker_carer.png" },
        ADOPTION: { url: this.iconBase + "marker_adoption.png" },
        INFORMATION: { url: this.iconBase + "marker_information.png" }
    };

    constructor() {
        console.log(this.icons, 'started legend')
    }

    filterMarkers() {
        this.filterEvent.emit()
    }
}
