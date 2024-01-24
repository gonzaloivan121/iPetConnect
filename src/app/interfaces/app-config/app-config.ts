export interface AppConfig {
    onlySearchVerifiedUsers?: boolean;
    minDistancePossible?: number;
    maxDistancePossible?: number;
    selectedMinDistancePossible?: number;
    selectedMaxDistancePossible?: number;
    onlySearchDistanceRange?: boolean;
    availableGenders?: ["MALES", "FEMALES", "OTHERS", "ALL"];
    selectedGender?: string;
    minAgePossible?: number;
    maxAgePossible?: number;
    selectedMinAgePossible?: number;
    selectedMaxAgePossible?: number;
    onlySearchAgeRange?: boolean;
    onlySearchHasBioUsers?: boolean;
}