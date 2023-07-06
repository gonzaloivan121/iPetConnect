import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User, Chat, Message } from 'src/classes';
import { DataService, SessionService } from 'src/app/services';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
    @Input() chat: Chat;
    @Input() currentUser: User;
    otherUser: User;
    messages: Message[];

    //@Output() likeEvent = new EventEmitter<User>();
    //@Output() dislikeEvent = new EventEmitter<User>();

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.dataService.get('user', this.chat.user1_id == this.currentUser.id ? this.chat.user2_id : this.chat.user1_id).then((response: any) => {
            if (response.status === 'success') {
                this.otherUser = response.results[0] as User;
            }
        });

        this.dataService.getFrom('message', 'chat', this.chat.id).then((response: any) => {
            if (response.status === 'success') {
                this.chat.messages = response.results as Message[];
            }
        });
    }

    openChat() {
        console.log(this.chat)
    }

    deleteChat(event: PointerEvent) {
        event.stopPropagation();
    }
}
