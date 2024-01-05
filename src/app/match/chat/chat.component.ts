import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { User, Chat, Message, DBTables } from 'src/classes';
import { DataService } from 'src/app/services';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IMessageRequest, IMessageResponse } from 'src/app/interfaces';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges {
    messageForm: UntypedFormGroup;

    @Input() chat: Chat;
    @Input() user: User;
    @Input() match: User;
    @Input() isOpen: boolean;

    public otherUser: User;
    public otherUserLoaded: Observable<boolean>;

    @Output() closeChatEvent = new EventEmitter<void>();
    @Output() viewProfileEvent = new EventEmitter<User>();
    @Output() deleteChatEvent = new EventEmitter<Chat>();
    @Output() reportUserEvent = new EventEmitter<User>();

    focusMessage: boolean;

    constructor(
        private dataService: DataService,
        private formBuilder: UntypedFormBuilder
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes)
        if (changes.chat) {
            this.chat = changes.chat.currentValue;
        }

        if (changes.isOpen && changes.isOpen.currentValue === true) {
            this.scrollToBottom();
            this.readMessages();
        }

        if (this.chat !== undefined) {
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

    readMessage(message: Message) {
        message.read = true;
        this.dataService.update(message.table, message).then(response => {
            console.log(response)
        });
    }
    
    ngOnInit(): void {
        this.messageForm = this.formBuilder.group({
            message: ["", [Validators.required]]
        });
    }

    scrollToBottom(): void {
        setTimeout(() => {
            const el: HTMLElement = document.getElementById('chatElement');
            el.scrollTo({
                top: Math.max(0, el.scrollHeight - el.offsetHeight),
                behavior: 'smooth'
            });
            
        }, 200);
    }

    get message() {
        return this.messageForm.get('message');
    }

    onSubmit() {
        const formData = this.messageForm.value;

        const data: IMessageRequest = {
            chat_id: this.chat.id,
            user_id: this.user.id,
            message: formData.message
        };

        this.dataService.insert(DBTables.Message, data).then((response: IMessageResponse) => {
            if (response.success) {
                const message = new Message(
                    data.chat_id,
                    data.user_id,
                    data.message,
                    false,
                    false
                );

                message.id = response.result?.insertId;
                message.created_at = new Date(response.created_at);
                message.updated_at = new Date(response.created_at);

                this.chat.messages.push(message);
                this.scrollToBottom();
            }
        });
    }

    getOtherUser(): Observable<boolean> {
        return from(this.dataService.get('user', this.chat.user1_id == this.user.id ? this.chat.user2_id : this.chat.user1_id).then((response: any) => {
            if (response.success) {
                this.otherUser = response.result[0] as User;
            }
        })).pipe(
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
