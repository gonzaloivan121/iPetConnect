export interface IBlogCategory {
    id: number;
    name: string;
    description: string;
    popularity: number;
    image: string;
    created_at: Date;
    updated_at: Date;
}

export interface IBlogPost {
    id: number;
    title: string;
    description: string;
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
    post_id: number;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IBlogCommentUserLike {
    id?: number;
    comment_id: number;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IBlogTag {
    id?: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface ITeamMember {
    id: number;
    name: string;
    position: string;
    aptitudes: {
        business: string;
        leisure: string;
        personal: string;
    };
    image: string;
    socialMedia?: {
        instagram?: string;
        twitter?: string;
        facebook?: string;
        threads?: string;
    }
}

export interface IPet {
    id?: number;
    name: string;
    species_id: number;
    breed_id: number;
    gender: string;
    color?: string;
    image?: string;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IPetPost {
    id?: number;
    title: string;
    description: string;
    image?: string;
    pet_id: number;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}