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
    messages: Message[] = new Array<Message>();

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
            if (response.success) {
                const user = response.result[0] as User;
                const newUser = new User(user.username, user.email, user.password, user.name, user.role_id, user.birthday, user.gender, user.bio, user.image);
                newUser.created_at = user.created_at;
                newUser.updated_at = user.updated_at;
                newUser.id = user.id;
                this.otherUser = newUser;
            }
        })).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    getMessages() {
        return from(this.dataService.getFrom('message', 'chat', this.chat.id).then((response: any) => {
            if (response.success) {
                response.result.forEach((message) => {
                    const newMessage = new Message(message.chat_id, message.user_id, message.message, message.edited, message.read, message.created_at, message.updated_at);
                    newMessage.id = message.id;
                    this.messages.push(newMessage)
                });
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
