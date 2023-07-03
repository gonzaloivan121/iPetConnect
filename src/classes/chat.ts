import { Entity } from './entity';
import { Message } from './';

export class Chat extends Entity {
    user1_id: number;
    user2_id: number;
    messages?: Message[];

    constructor(
        user1_id: number,
        user2_id: number,
        messages?: Message[]
    ) {
        super('chat');

        this.user1_id = user1_id;
        this.user2_id = user2_id;
        this.messages = messages;
    }
}