import { Entity } from './entity';

export class Message extends Entity {
    chat_id: number;
    user_id: number;
    message: string;
    edited: boolean;
    read: boolean;

    constructor(
        chat_id: number,
        user_id: number,
        message: string,
        edited: boolean,
        read: boolean,
        created_at?: string,
        updated_at?: string
    ) {
        super('message');

        this.chat_id = chat_id;
        this.user_id = user_id;
        this.message = message;
        this.edited = edited;
        this.read = read;
        this.created_at = new Date(created_at);
        this.updated_at = new Date(updated_at);
    }
}