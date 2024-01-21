export interface IAlert {
    type: string;
    strong?: string;
    message: string;
    icon?: string;
    dismissable?: boolean;
}