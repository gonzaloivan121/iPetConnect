export interface AppConfig {
    selectedLanguage?: string;
    onlySearchVerifiedUsers?: boolean;
    minDistancePossible?: number;
    maxDistancePossible?: number;
    selectedMinDistancePossible?: number;
    selectedMaxDistancePossible?: number;
    onlySearchDistanceRange?: boolean;
    availableGenders?: ["MALES", "FEMALES", "OTHERS", "ALL"];
    availableLanguages?: ["es-ES", 'en-EN'];
    selectedGender?: string;
    minAgePossible?: number;
    maxAgePossible?: number;
    selectedMinAgePossible?: number;
    selectedMaxAgePossible?: number;
    onlySearchAgeRange?: boolean;
    onlySearchHasBioUsers?: boolean;
}

export interface DBConfig {
    min_distance: number;
    max_distance: number;
    selected_gender: string;
    min_age: number;
    max_age: number;
    search_verified_users: boolean;
    search_in_distance: boolean;
    search_in_age: boolean;
    search_has_bio: boolean;
    language: string;
    user_id: number;
}
