import { Component, Input, OnInit } from "@angular/core";
import { DataService, SessionService, TranslateService } from "src/app/services";
import { ILanguage, IUser } from "src/app/interfaces";
import { DBTables } from "src/classes";

@Component({
    selector: "app-language-select",
    templateUrl: "./language-select.component.html",
    styleUrls: ["./language-select.component.css"],
})
export class LanguageSelectComponent implements OnInit {
    @Input() user: IUser;

    selectedLanguageCode: string;
    languages: ILanguage[];

    constructor(
        private dataService: DataService,
        private translateService: TranslateService,
        private sessionService: SessionService
    ) {}

    ngOnInit(): void {
        this.dataService.get(DBTables.Language).then((response: any) => {
            if (response.success) {
                this.languages = response.result as ILanguage[];
            }
        });

        if (this.sessionService.get("language") !== null) {
            this.setLanguage(this.sessionService.get("language"));
        } else {
            this.setLanguage(this.translateService.getCurrentLanguage());
        }
    }

    selectLanguage(language: ILanguage) {
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
