import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'; 
import { IUser, IChat, IMessage } from 'src/app/interfaces';
import { DataService, SessionService } from 'src/app/services';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DBTables } from 'src/classes';

@Component({
    selector: "app-messages",
    templateUrl: "./messages.component.html",
    styleUrls: ["./messages.component.css"],
})
export class MessagesComponent implements OnInit {
    @Input() chat: IChat;
    @Input() user: IUser;

    otherUser: IUser;
    messages: IMessage[] = new Array<IMessage>();

    public messagesLoaded: Observable<boolean>;
    public otherUserLoaded: Observable<boolean>;

    @Output() openChatEvent = new EventEmitter<IChat>();

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.otherUserLoaded = this.getOtherUser();
        this.messagesLoaded = this.getMessages();
    }

    getOtherUser(): Observable<boolean> {
        return from(
            this.dataService
                .get(
                    DBTables.User,
                    this.chat.user1_id == this.user.id
                        ? this.chat.user2_id
                        : this.chat.user1_id
                )
                .then((response: any) => {
                    if (response.success) {
                        this.otherUser = response.result[0] as IUser;
                    }
                })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    getMessages() {
        return from(
            this.dataService
                .getFrom(DBTables.Message, DBTables.Chat, this.chat.id)
                .then((response: any) => {
                    if (response.success) {
                        response.result.forEach((message: IMessage) => {
                            this.messages.push(message);
                        });
                    }
                })
        ).pipe(
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
