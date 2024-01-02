import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { AppConfigService, SessionService, DataService, TranslateService } from 'src/app/services';
import { AppConfig, DBConfig } from 'src/app/interfaces';
import { noUiSlider } from "nouislider";
import { RoleEnum } from 'src/app/enums/enums';
import { User } from 'src/classes';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit {
    public data: AppConfig = {};
    public minDistance: number;
    public maxDistance: number;

    public user: User;

    constructor(
        public appConfig: AppConfigService,
        public sessionService: SessionService,
        public dataService: DataService,
        public translateService: TranslateService,
        public location: Location
    ) { }

    ngOnInit(): void {
        if (this.sessionService.get('user') !== null) {
            this.user = JSON.parse(this.sessionService.get('user'));
            if (this.user.role_id == RoleEnum.Admin) {
                this.location.back();
            }
        } else {
            this.location.back();
        }

        this.data = this.appConfig.data;
    }

    ngAfterViewInit() {
        this.generateDistanceSlider();
        this.generateAgeSlider();
    }

    generateDistanceSlider() {
        let distanceSlider: any = document.getElementById("input-slider-range-distance");

        noUiSlider.create(distanceSlider, {
            start: [
                this.data.selectedMinDistancePossible,
                this.data.selectedMaxDistancePossible
            ],
            connect: true,
            range: {
                min: this.data.minDistancePossible,
                max: this.data.maxDistancePossible
            }
        });

        distanceSlider.noUiSlider.on('update', (values, handle) => {
            if (handle) {
                // Max handle
                this.data.selectedMaxDistancePossible = parseInt(values[handle]);
            } else {
                // Min handle
                this.data.selectedMinDistancePossible = parseInt(values[handle]);
            }
        })
    }

    generateAgeSlider() {
        let ageSlider: any = document.getElementById("input-slider-range-age");

        noUiSlider.create(ageSlider, {
            start: [
                this.data.selectedMinAgePossible,
                this.data.selectedMaxAgePossible
            ],
            connect: true,
            range: {
                min: this.data.minAgePossible,
                max: this.data.maxAgePossible
            }
        });

        ageSlider.noUiSlider.on('update', (values, handle) => {
            if (handle) {
                // Max handle
                this.data.selectedMaxAgePossible = parseInt(values[handle]);
            } else {
                // Min handle
                this.data.selectedMinAgePossible = parseInt(values[handle]);
            }
        })
    }


    update() {
        for (const key in this.data) {
            this.appConfig.write(key, this.data[key]);
        }

        let dbData: DBConfig = this.convertDataToDB();

        console.log(dbData)

        this.translateService.use(dbData.language);

        this.dataService.updateForUser('config', dbData.user_id, dbData).then(response => {
            console.log(response)
        });
    }

    convertDataToDB(): DBConfig {
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
            language: this.data.selectedLanguage,
            user_id: this.user.id
        }
    }
}
