export interface IBlogCategory {
    id: number;
    name: string;
    description: string;
    popularity: number;
    image: string;
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

export interface IBlogPost {
    id?: number;
    title: string;
    description: string;
    content: string;
    image: string;
    popularity: number;
    published: boolean;
    category_id: number;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IBlogPostTag {
    id?: number;
    post_id: number;
    tag_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IBlogTag {
    id?: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface IBreed {
    id?: number;
    name: string;
    species_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IChat {
    id?: number;
    user1_id: number;
    user2_id: number;
    messages?: IMessage[];
    created_at?: Date;
    updated_at?: Date;
}

export interface IConfig {
    id?: number;
    min_distance: number;
    max_distance: number;
    selected_gender: string;
    min_age: number;
    max_age: number;
    search_verified_users: boolean;
    search_in_distance: boolean;
    search_in_age: boolean;
    search_has_bio: boolean;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IFavouriteMarker {
    id?: number;
    user_id: number;
    marker_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface ILanguage {
    id?: number;
    code: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface ILike {
    id?: number;
    user1_id: number;
    user2_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IMarker {
    id?: number;
    species_id?: number;
    breed_id?: number;
    user_id: number;
    title: string;
    description: string;
    type: string;
    color?: string;
    coordinates: ICoordinates;
    image: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface IMatch {
    id?: number;
    user1_id: number;
    user2_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IMessage {
    id?: number;
    chat_id: number;
    user_id: number;
    message: string;
    edited: boolean;
    read: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface IPasswordResets {
    email: string;
    token: string;
    created_at: Date;
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

export interface IPetPostComment {
    id?: number;
    content: string;
    is_answer: boolean;
    answer_comment_id?: number;
    answers?: IPetPostComment[];
    post_id: number;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IPetPostCommentUserLike {
    id?: number;
    comment_id: number;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}
export interface IPetPostUserLike {
    id?: number;
    post_id: number;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IRole {
    id?: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface ISpecies {
    id?: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface IUser {
    id?: number;
    username: string;
    email: string;
    password: string;
    name: string;
    role_id: number;
    birthday: Date;
    gender: string;
    bio?: string;
    image?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface IUserFollowing {
    id?: number;
    follower_user_id: number;
    following_user_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IUserReport {
    id?: number;
    reason: string;
    user_id: number;
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

export interface ICoordinates {
    lat: number,
    lng: number
}