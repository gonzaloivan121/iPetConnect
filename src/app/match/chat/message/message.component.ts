import { Component, Input, OnInit } from '@angular/core';
import { IMessage, IUser } from "src/app/interfaces";

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

    @Input() message: IMessage;
    @Input() user: IUser;
    @Input() otherUser: IUser;

    constructor() { }

    ngOnInit(): void {
        
    }

}
