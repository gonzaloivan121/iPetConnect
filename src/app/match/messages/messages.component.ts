import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'; 
import { User, Chat, Message } from 'src/classes';
import { DataService, SessionService } from 'src/app/services';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

    @Input() chat: Chat;
    @Input() user: User;

    otherUser: User;
    messages: Message[];

    public messagesLoaded: Observable<boolean>;
    public otherUserLoaded: Observable<boolean>;

    @Output() openChatEvent = new EventEmitter<Chat>();

    constructor(
        private dataService: DataService
    ) { }

    ngOnInit() {
        this.otherUserLoaded = this.getOtherUser();
        this.messagesLoaded = this.getMessages();
    }

    getOtherUser(): Observable<boolean> {
        return from(this.dataService.get('user', this.chat.user1_id == this.user.id ? this.chat.user2_id : this.chat.user1_id).then((response: any) => {
            if (response.status === 'success') {
                this.otherUser = response.results[0] as User;
            }
        })).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    getMessages() {
        return from(this.dataService.getFrom('message', 'chat', this.chat.id).then((response: any) => {
            if (response.status === 'success') {
                this.messages = response.results as Message[];
            }
        })).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    openChat() {
        this.chat.messages = this.messages;
        this.openChatEvent.emit(this.chat);
    }

    deleteChat(event: PointerEvent) {
        event.stopPropagation();
    }
}
