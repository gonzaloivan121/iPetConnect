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
    likes: number;
    post_id: number;
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