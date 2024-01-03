import { Entity } from './entity';

export class BlogPost extends Entity {
    title: string;
    content: string;
    image: string;
    user_id: number;

    constructor(title: string, content: string, image: string, user_id: number) {
        super("blog_post");

        this.title = title;
        this.content = content;
        this.image = image;
        this.user_id = user_id;
    }
}