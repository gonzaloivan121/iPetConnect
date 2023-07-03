import { Entity } from './entity';

export class Marker extends Entity {
    user_id: number;
    title: string;
    description: string;
    type: string;
    color: string;
    coordinates: { lat: number, lng: number };
    image?: string;
    species_id?: number;
    breed_id?: number;

    constructor(
        user_id: number,
        title: string,
        description: string,
        type: string,
        color: string,
        coordinates: { lat: number, lng: number },
        image?: string,
        species_id?: number,
        breed_id?: number
    ) {
        super('markers');

        this.user_id = user_id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.color = color;
        this.coordinates = coordinates;
        this.image = image;
        this.species_id = species_id;
        this.breed_id = breed_id;
    }
}