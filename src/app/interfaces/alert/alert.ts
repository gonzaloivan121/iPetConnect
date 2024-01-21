/**
 * 
 */
export interface IAlert {
    /** Alert type, available types: 'success', 'info', 'warning', 'danger', 'primary', 'secondary', 'light', 'dark'.  */
    type: string;
    /** Bold text inside the alert. */
    strong?: string;
    /** Body of the alert. */
    message: string;
    /** The icon the alert will have. */
    icon?: string;
    /** Weather or not the alert is dismissable. */
    dismissable?: boolean;
    /** The duration of the alert in SECONDS. If no duration is specified, the alert will remain open until the user closes it. */
    duration?: number;
}