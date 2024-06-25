export interface IImageCategoryType {
    category: "nsfw_beta" | "nsfw" | "personal_photos";
}

export interface IImageCategoryResponse {
    result: {
        categories: IImageCategory[];
    };
    status: {
        text: string;
        type: string;
    };
}

export interface IImageCategory {
    confidence: number;
    name: IImageCategoryName;
}

export interface IImageCategoryName {
    en: "nsfw" | "safe" | "underware" ;
}