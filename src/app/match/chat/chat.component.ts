import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DBTables } from 'src/classes';
import { DataService } from 'src/app/services';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IMessageRequest, IMessageResponse, IUser, IChat, IMessage } from 'src/app/interfaces';

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit, OnChanges {
    messageForm: UntypedFormGroup;

    @Input() chat: IChat;
    @Input() user: IUser;
    @Input() match: IUser;
    @Input() isOpen: boolean;

    public otherUser: IUser;
    public otherUserLoaded: Observable<boolean>;

    @Output() closeChatEvent = new EventEmitter<void>();
    @Output() viewProfileEvent = new EventEmitter<IUser>();
    @Output() deleteChatEvent = new EventEmitter<IChat>();
    @Output() reportUserEvent = new EventEmitter<IUser>();

    focusMessage: boolean;

    constructor(
        private dataService: DataService,
        private formBuilder: UntypedFormBuilder
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.isOpen && this.chat.messages && this.chat.messages.length > 0) {
            setTimeout(() => {
                this.scrollToBottom();
            }, 200);
            this.readMessages();
        }

        if (this.chat) {
            this.otherUserLoaded = this.getOtherUser();
        }
    }

    readMessages() {
        if (this.chat.messages !== undefined) {
            this.chat.messages.forEach((message) => {
                if (message.user_id !== this.user.id && !message.read) {
                    this.readMessage(message);
                }
            });
        }
    }

    readMessage(message: IMessage) {
        message.read = true;
        this.dataService.update(DBTables.Message, message).then((response) => {
            console.log("readMessage", response);
        });
    }

    ngOnInit(): void {
        this.messageForm = this.formBuilder.group({
            message: ["", [Validators.required]],
        });
    }

    scrollToBottom(): void {
        const el: HTMLElement = document.getElementById("chatElement");
        el.scrollTo({
            top: Math.max(0, el.scrollHeight - el.offsetHeight),
            behavior: "smooth",
        });
    }

    get message() {
        return this.messageForm.get("message");
    }

    onSubmit() {
        const formData = this.messageForm.value;

        const data: IMessageRequest = {
            chat_id: this.chat.id,
            user_id: this.user.id,
            message: formData.message,
        };

        this.dataService
            .insert(DBTables.Message, data)
            .then((response: IMessageResponse) => {
                if (response.success) {
                    const message: IMessage = {
                        id: response.result?.insertId,
                        chat_id: data.chat_id,
                        user_id: data.user_id,
                        message: data.message,
                        edited: false,
                        read: false,
                        created_at: new Date(response.created_at),
                        updated_at: new Date(response.created_at),
                    };

                    if (!this.chat.messages) {
                        this.chat.messages = [];
                    }

                    this.chat.messages.push(message);

                    this.updateChat();

                    setTimeout(() => {
                        this.scrollToBottom();
                    }, 200);
                    this.message.reset();
                }
            });
    }

    updateChat() {
        this.dataService.update(DBTables.Chat, this.chat).catch((error) => console.error(error));
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

    onCtrlEnter() {
        if (!this.message.valid) return;

        this.onSubmit();
    }

    closeChat() {
        this.closeChatEvent.emit();
    }

    viewProfile() {
        this.viewProfileEvent.emit(this.otherUser);
    }

    deleteChat() {
        this.deleteChatEvent.emit(this.chat);
    }

    reportUser() {
        this.reportUserEvent.emit(this.otherUser);
    }
}
