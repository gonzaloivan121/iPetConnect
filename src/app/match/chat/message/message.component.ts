import { Component, Input, OnInit } from '@angular/core';
import { Message, User } from 'src/classes';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

    @Input() message: Message;
    @Input() user: User;
    @Input() otherUser: User;

    constructor() { }

    ngOnInit(): void {
        
    }

}
