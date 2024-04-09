import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ISidebarSpecification } from "src/app/interfaces";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
    @Input() isExpanded: boolean = false;
    @Input() specification: ISidebarSpecification;

    @Output() toggleSidebar: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);
}
