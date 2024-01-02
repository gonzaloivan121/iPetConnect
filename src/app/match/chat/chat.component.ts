import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User, Chat, Message, DBTables } from 'src/classes';
import { DataService } from 'src/app/services';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMessageRequest, IMessageResponse } from 'src/app/interfaces';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
    messageForm: FormGroup;

    @Input() chat: Chat;
    @Input() user: User;
    @Input() match: User;

    public otherUser: User;
    public otherUserLoaded: Observable<boolean>;

    @Output() closeChatEvent = new EventEmitter<void>();

    focusMessage: boolean;

    constructor(
        private dataService: DataService,
        private formBuilder: FormBuilder
    ) { }
    
    ngOnInit(): void {
        this.otherUserLoaded = this.getOtherUser();

        this.messageForm = this.formBuilder.group({
            message: ["", [Validators.required]]
        });
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
            }
        });
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

    closeChat() {
        this.closeChatEvent.emit();
    }

    viewProfile(user: User) {

    }

    onCtrlEnter() {
        if (!this.message.valid) return;

        this.onSubmit();
    }

}
