import { Entity } from './entity';

export class User extends Entity {
    username: string;
    email: string;
    password: string;
    name: string;
    role_id: number;
    birthday: string;
    gender: string;
    bio?: string;
    image?: string;

    constructor(
        username: string,
        email: string,
        password: string,
        name: string,
        role_id: number,
        birthday: string,
        gender: string,
        bio?: string,
        image?: string
    ) {
        super('user');

        this.username = username;
        this.email = email;
        this.password = password;
        this.name = name;
        this.role_id = role_id;
        this.birthday = birthday;
        this.gender = gender;
        this.bio = bio;
        this.image = image;
    }
}