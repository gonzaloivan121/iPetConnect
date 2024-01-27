import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { AppConfigService, SessionService, DataService, TranslateService, AlertService, NavigationService } from 'src/app/services';
import { AppConfig, IConfig, IUser } from 'src/app/interfaces';
import noUiSlider from "nouislider";
import { Page, RoleEnum } from 'src/app/enums/enums';
import { DBTables } from 'src/classes';

@Component({
    selector: "app-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit, AfterViewInit {
    public data: AppConfig = {};

    public user: IUser;

    constructor(
        private appConfig: AppConfigService,
        private sessionService: SessionService,
        private dataService: DataService,
        private translateService: TranslateService,
        private location: Location,
        private alertService: AlertService,
        private navigationService: NavigationService
    ) {
        this.navigationService.set(Page.Settings);
    }

    ngOnInit(): void {
        if (this.sessionService.get("user") !== null) {
            this.user = JSON.parse(this.sessionService.get("user"));

            if (this.user.role_id != RoleEnum.User) {
                this.location.back();
            }

            this.getData();
        } else {
            this.location.back();
        }
    }

    getData() {
        this.appConfig.load();
        this.data = this.appConfig.data;
    }

    ngAfterViewInit() {
        this.dataService
            .getFrom(DBTables.Config, DBTables.User, this.user.id)
            .then((response: any) => {
                if (response.success && response.result.length > 0) {
                    let dataFromService: IConfig = response
                        .result[0] as IConfig;
                    this.data.onlySearchAgeRange =
                        dataFromService.search_in_age;
                    this.data.onlySearchDistanceRange =
                        dataFromService.search_in_distance;
                    this.data.onlySearchHasBioUsers =
                        dataFromService.search_has_bio;
                    this.data.onlySearchVerifiedUsers =
                        dataFromService.search_verified_users;
                    this.data.selectedGender = dataFromService.selected_gender;
                    this.data.selectedMaxAgePossible = dataFromService.max_age;
                    this.data.selectedMaxDistancePossible =
                        dataFromService.max_distance;
                    this.data.selectedMinAgePossible = dataFromService.min_age;
                    this.data.selectedMinDistancePossible =
                        dataFromService.min_distance;
                }

                this.generateDistanceSlider();
                this.generateAgeSlider();
            });
    }

    generateDistanceSlider() {
        let distanceSlider: any = document.getElementById(
            "input-slider-range-distance"
        );

        noUiSlider.create(distanceSlider, {
            start: [
                this.data.selectedMinDistancePossible,
                this.data.selectedMaxDistancePossible,
            ],
            connect: true,
            range: {
                min: this.data.minDistancePossible,
                max: this.data.maxDistancePossible,
            },
        });

        distanceSlider.noUiSlider.on("update", (values, handle) => {
            if (handle) {
                // Max handle
                this.data.selectedMaxDistancePossible = parseInt(
                    values[handle]
                );
            } else {
                // Min handle
                this.data.selectedMinDistancePossible = parseInt(
                    values[handle]
                );
            }
        });
    }

    generateAgeSlider() {
        let ageSlider: any = document.getElementById("input-slider-range-age");

        noUiSlider.create(ageSlider, {
            start: [
                this.data.selectedMinAgePossible,
                this.data.selectedMaxAgePossible,
            ],
            connect: true,
            range: {
                min: this.data.minAgePossible,
                max: this.data.maxAgePossible,
            },
        });

        ageSlider.noUiSlider.on("update", (values, handle) => {
            if (handle) {
                // Max handle
                this.data.selectedMaxAgePossible = parseInt(values[handle]);
            } else {
                // Min handle
                this.data.selectedMinAgePossible = parseInt(values[handle]);
            }
        });
    }

    update() {
        for (const key in this.data) {
            this.appConfig.write(key, this.data[key]);
        }

        let dbData: IConfig = this.convertDataToDB();

        this.dataService
            .updateForUser(DBTables.Config, dbData.user_id, dbData)
            .then((response: any) => {
                if (response.success) {
                    this.alertService.openSuccess(response.message);
                } else {
                    this.alertService.openWarning(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                this.alertService.openDanger("There has been an error!");
            });
    }

    convertDataToDB(): IConfig {
        return {
            min_distance: this.data.selectedMinDistancePossible,
            max_distance: this.data.selectedMaxDistancePossible,
            selected_gender: this.data.selectedGender,
            min_age: this.data.selectedMinAgePossible,
            max_age: this.data.selectedMaxAgePossible,
            search_verified_users: this.data.onlySearchVerifiedUsers,
            search_in_distance: this.data.onlySearchDistanceRange,
            search_in_age: this.data.onlySearchAgeRange,
            search_has_bio: this.data.onlySearchHasBioUsers,
            user_id: this.user.id,
        };
    }
}
