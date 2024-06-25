export enum RoleEnum {
    Admin = 1,
    User = 2,
    Blogger = 3
};

export enum AdminViewEnum {
    Dashboard = 1,
    Users = 2,
    Roles = 3,
    Pets = 4,
    Species = 5,
    Breeds = 6,
    Likes = 7,
    Matches = 8,
    Chats = 9,
    Messages = 10,
    Markers = 11,
};

export enum MarkerTypeEnum {
    Rescue = 1,
    Urgency = 2,
    Veterinary = 3,
    Carer = 4,
    Adoption = 5,
    Information = 6,
}

export enum MatchTabEnum {
    Messages = 1,
    Matches = 2,
    Likes = 3,
}

export enum LikesTabEnum {
    Received = 1,
    Given = 2,
}

export enum Page {
    Home,
    Admin,
    Map,
    Login,
    Register,
    Blog,
    BlogEditor,
    BlogPost,
    Privacy,
    Pets,
    PetsProfile,
    Match,
    Settings,
    ForgotPassword,
    NotFound,
    Profile,
};

export enum PetProfileTabEnum {
    Posts = 1,
    Pets = 2,
};
