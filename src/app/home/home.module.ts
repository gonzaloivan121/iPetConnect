import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

import { SectionsModule } from '../sections/sections.module';
import { TranslatePipe } from '../pipes/translate.pipe';
import { AgePipe } from '../pipes/age.pipe';
import { RoleNamePipe } from '../pipes/role.pipe';
import { SearchPipe } from '../pipes/search.pipe';
import { LanguageNamePipe } from '../pipes/language.pipe';
import { BreedNamePipe } from '../pipes/breed.pipe';
import { SpeciesNamePipe } from '../pipes/species.pipe';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { CountUnreadMessagesPipe } from '../pipes/count-unread-messages.pipe';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        RouterModule,
        SectionsModule,
        NgbModule
    ],
    declarations: [
        HomeComponent,
        TranslatePipe,
        AgePipe,
        RoleNamePipe,
        SearchPipe,
        LanguageNamePipe,
        BreedNamePipe,
        SpeciesNamePipe,
        TruncatePipe,
        CountUnreadMessagesPipe,
    ],
    exports: [
        HomeComponent,
        TranslatePipe,
        AgePipe,
        RoleNamePipe,
        SearchPipe,
        LanguageNamePipe,
        BreedNamePipe,
        SpeciesNamePipe,
        TruncatePipe,
        CountUnreadMessagesPipe,
    ],
    providers: []
})
export class HomeModule { }
