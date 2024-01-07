import { Pipe, PipeTransform } from '@angular/core';
import { IMapLegendIcon } from 'src/app/interfaces';

@Pipe({
    name: "markerIcon",
})
export class MarkerIconPipe implements PipeTransform {
  
    iconBase = "./assets/img/markers/";
    icons: IMapLegendIcon[] = [
        {
            url: this.iconBase + "marker_rescue.png",
            type: "RESCUE"
        },
        {
            url: this.iconBase + "marker_urgency.png",
            type: "URGENCY"
        },
        {
            url: this.iconBase + "marker_veterinary.png",
            type: "VETERINARY"
        },
        {
            url: this.iconBase + "marker_carer.png",
            type: "CARER"
        },
        {
            url: this.iconBase + "marker_adoption.png",
            type: "ADOPTION"
        },
        {
            url: this.iconBase + "marker_information.png",
            type: "INFORMATION"
        },
    ];

    transform(type: string): string {
        const icon = this.icons.filter((icon) => icon.type === type)[0];
        return icon.url;
    }
}
