import { Component, Input } from '@angular/core';
import { IUser } from 'src/app/interfaces';

@Component({
    selector: 'app-pet-post-create',
    templateUrl: './pet-post-create.component.html',
    styleUrls: ['./pet-post-create.component.css']
})
export class PetPostCreateComponent {
    @Input() user: IUser;
}
