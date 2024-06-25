import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPet, IPetPost } from 'src/app/interfaces';

@Component({
    selector: "app-pet-profile-thumbnail",
    templateUrl: "./pet-profile-thumbnail.component.html",
    styleUrls: ["./pet-profile-thumbnail.component.css"],
})
export class PetProfileThumbnailComponent {
    @Input() post: IPetPost;
    @Input() pet: IPet;

    @Output() openPostEvent: EventEmitter<void> = new EventEmitter<void>();
    @Output() openPetEvent: EventEmitter<void> = new EventEmitter<void>();

    constructor() {}

    openPost() {
        this.openPostEvent.emit();
    }

    openPet() {
        this.openPetEvent.emit();
    }
}
