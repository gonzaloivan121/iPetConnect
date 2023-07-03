import { Entity } from './entity';

export class Species extends Entity {
    name: string;

    constructor(name: string) {
        super('species');

        this.name = name;
    }
}