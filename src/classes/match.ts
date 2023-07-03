import { Entity } from './entity';

export class Match extends Entity {
    user1_id: number;
    user2_id: number;

    constructor(
        user1_id: number,
        user2_id: number
    ) {
        super('match');

        this.user1_id = user1_id;
        this.user2_id = user2_id;
    }
}