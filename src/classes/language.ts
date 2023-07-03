import { Entity } from './entity';

export class Language extends Entity {
    code: string;
    name: string;

    constructor(
        code: string,
        name: string
    ) {
        super('language');

        this.code = code;
        this.name = name;
    }
}