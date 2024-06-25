export interface ISidebarLink {
    text: string;
    hasRouterLink: boolean;
    hasChildren: boolean;
    hasIcon: boolean;
    hasCallback: boolean;
    isActive: boolean;
    routerUrl?: string;
    icon?: string;
    children?: ISidebarLink[];
    callback?: Function;
}

export interface ISidebarSpecification {
    links: ISidebarLink[];
}
