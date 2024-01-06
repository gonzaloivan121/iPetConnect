export interface IBlogCategory {
    id: number;
    name: string;
    description: string;
    image: string;
    created_at: Date;
    updated_at: Date;
}

export interface IBlogPost {
    id: number;
    title: string;
    content: string;
    image: string;
    popularity: number;
    category_id: number;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface IBlogComment {
    id?: number;
    content: string;
    likes: number;
    post_id: number;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}