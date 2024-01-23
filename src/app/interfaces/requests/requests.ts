import { IBlogPost } from "../classes/classes";

export interface IMessageRequest {
    chat_id: number;
    user_id: number;
    message: string;
    edited?: boolean;
    read?: boolean;
}

export interface IMessageResponse {
    success: boolean;
    message: string;
    result?: IResponseResult;
    created_at?: string;
}

export interface IMarkerResponse {
    success: boolean;
    message: string;
    result?: IResponseResult;
    created_at?: string;
}

export interface IBlogPostRequest {
    title: string;
    description: string;
    content: string;
    image: string;
    category_id: number;
    user_id: number;
}

export interface IBlogPostResponse {
    success: boolean;
    message?: string;
    result?: IBlogPost[];
    created_at?: string;
}

export interface IBlogPostInsertResponse {
    success: boolean;
    message: string;
    result?: IResponseResult;
    created_at?: string;
}

export interface IInsertResponse {
    success: boolean;
    message: string;
    result?: IResponseResult;
    created_at?: string;
}

export interface IResponseResult {
    affectedRows: number;
    changedRows: number;
    fieldCount: number;
    insertId: number;
    message: string;
    protocol41: boolean;
    serverStatus: number;
    warningCount: number;
}