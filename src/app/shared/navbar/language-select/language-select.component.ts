import { Component, Input, OnInit } from "@angular/core";
import { Language, User } from "src/classes";
import { DataService, SessionService, TranslateService } from "src/app/services";

@Component({
    selector: "app-language-select",
    templateUrl: "./language-select.component.html",
    styleUrls: ["./language-select.component.css"],
})
export class LanguageSelectComponent implements OnInit {
    @Input() user: User;

    selectedLanguageCode: string;
    languages: Language[];

    constructor(
        private dataService: DataService,
        private translateService: TranslateService,
        private sessionService: SessionService
    ) {}

    ngOnInit(): void {
        this.dataService.get("language").then((response: any) => {
            console.log(response);
            if (response.success) {
                this.languages = response.result as Language[];
            }
        });

        if (this.sessionService.get('language') !== null) {
            this.setLanguage(this.sessionService.get("language"));
        } else {
            this.setLanguage(this.translateService.getCurrentLanguage());
        }
    }

    selectLanguage(language: Language) {
        this.translateService.use(language.code);
        this.selectedLanguageCode = language.code;
        this.sessionService.set("language", this.selectedLanguageCode);
    }

    private setLanguage(languageCode: string) {
        this.translateService.use(languageCode);
        this.selectedLanguageCode = languageCode;
        this.sessionService.set("language", this.selectedLanguageCode);
    }
}
