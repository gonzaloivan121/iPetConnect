import { Entity } from './entity';

export class Breed extends Entity {
    name: string;
    species_id: number;

    constructor(name: string, species_id: number) {
        super('breeds');

        this.name = name;
        this.species_id = species_id;
    }
}