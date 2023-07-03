import { Entity } from './entity';

export class Pet extends Entity {
    name: string;
    species_id: number;
    breed_id: number;
    gender: string;
    color: string;
    user_id: number;
    image?: string;

    constructor(
        name: string,
        species_id: number,
        breed_id: number,
        gender: string,
        color: string,
        user_id: number,
        image?: string
    ) {
        super('pets');

        this.name = name;
        this.species_id = species_id;
        this.breed_id = breed_id;
        this.gender = gender;
        this.color = color;
        this.user_id = user_id;
        this.image = image;
    }
}