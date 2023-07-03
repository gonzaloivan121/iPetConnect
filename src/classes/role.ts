import { Entity } from './entity';

export class Role extends Entity {
    name: string;
    constructor(
        name: string
    ) {
        super('role');

        this.name = name;
    }
}