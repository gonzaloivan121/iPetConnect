import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Language, User } from "src/classes";
import { DataService, TranslateService } from "src/app/services";

@Component({
    selector: "app-language-select",
    templateUrl: "./language-select.component.html",
    styleUrls: ["./language-select.component.css"],
})
export class LanguageSelectComponent implements OnInit {
    @Input() user: User;
    @Output() languageSelectEvent = new EventEmitter<Language>();

    selectedLanguageCode: string;
    languages: Language[];

    constructor(
        private dataService: DataService,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.dataService.get('language').then((response: any) => {
            console.log(response)
            if (response.status === 'success') {
                this.languages = response.results as Language[];
            }
        });

        this.selectedLanguageCode = this.translateService.getCurrentLanguage();
    }

    selectLanguage(language: Language) {
        this.translateService.use(language.code);
        this.selectedLanguageCode = language.code;
    }
}
