export interface ISidebarLink {
    text: string;
    routeUrl: string;
    hasChildren: boolean;
    hasIcon: boolean;
    icon?: string;
    children?: ISidebarLink[];
}

export interface ISidebarSpecification {
    links: ISidebarLink[];
}
