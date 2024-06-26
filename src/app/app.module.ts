import { NgModule, APP_INITIALIZER, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule, NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { AppRoutingModule } from "./app.routing";
import { GoogleMapsModule } from "@angular/google-maps";
import { NgxEditorModule } from "ngx-editor";
import { EllipsisModule } from "ngx-ellipsis";

import { AppComponent } from "./app.component";
import { SignupComponent } from "./signup/signup.component";
import { LandingComponent } from "./landing/landing.component";
import { ProfileComponent } from "./profile/profile.component";
import { HomeComponent } from "./home/home.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";

import { HomeModule } from "./home/home.module";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { MatchComponent } from "./match/match.component";
import { MapComponent } from "./map/map.component";
import { PageNotFoundComponent } from "./pagenotfound/pagenotfound.component";
import { InfoComponent } from "./map/info/info.component";
import { LegendComponent } from "./map/legend/legend.component";
import { SettingsComponent } from "./settings/settings.component";
import { AppConfigService, TranslateService, BadWordsService } from "./services";
import { BlogComponent } from "./blog/blog.component";
import { CardComponent } from "./match/card/card.component";
import { CategoriesComponent } from "./blog/categories/categories.component";
import { NewsletterComponent } from "./blog/newsletter/newsletter.component";

import { AdminComponent } from "./admin/admin.component";
import { AdminSidebarComponent } from "./admin/sidebar/sidebar.component";
import { AdminDashboardComponent } from "./admin/dashboard/dashboard.component";
import { AdminUsersComponent } from "./admin/users/users.component";
import { AdminRolesComponent } from "./admin/roles/roles.component";
import { AdminPetsComponent } from "./admin/pets/pets.component";
import { AdminSpeciesComponent } from "./admin/species/species.component";
import { AdminBreedsComponent } from "./admin/breeds/breeds.component";
import { AdminLikesComponent } from "./admin/likes/likes.component";
import { AdminMatchesComponent } from "./admin/matches/matches.component";
import { AdminChatsComponent } from "./admin/chats/chats.component";
import { AdminMessagesComponent } from "./admin/messages/messages.component";
import { AdminMarkersComponent } from "./admin/markers/markers.component";
import { AdminEditComponent } from "./admin/edit/edit.component";
import { MessagesComponent } from "./match/messages/messages.component";
import { MatchesComponent } from "./match/matches/matches.component";
import { LikesComponent } from "./match/likes/likes.component";
import { UserDropdownComponent } from "./shared/navbar/user-dropdown/user-dropdown.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { TextareaAutosizeDirective } from "./directives/textarea-autosize.directive";
import { ChatComponent } from "./match/chat/chat.component";
import { MessageComponent } from "./match/chat/message/message.component";
import { ForgotpasswordComponent } from "./forgotpassword/forgotpassword.component";
import { RelatedStoriesComponent } from "./blog/related-stories/related-stories.component";
import { LatestBlogpostsComponent } from "./blog/latest-blogposts/latest-blogposts.component";
import { TheTeamComponent } from "./blog/the-team/the-team.component";
import { LanguageSelectComponent } from "./shared/navbar/language-select/language-select.component";
import { BlogPostComponent } from "./blog/blog-post/blog-post.component";
import { EditProfileComponent } from "./profile/edit-profile/edit-profile.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { BlogCommentComponent } from "./blog/blog-post/blog-comment/blog-comment.component";
import { MarkerIconPipe } from "./pipes/marker-icon.pipe";
import { NewVersionCheckerComponent } from "./new-version-checker/new-version-checker.component";
import { RelatedStoryComponent } from "./blog/related-stories/related-story/related-story.component";
import { AlertComponent } from "./alert/alert.component";
import { EditorComponent } from "./blog/editor/editor.component";
import { EditorSidebarComponent } from './blog/editor/editor-sidebar/editor-sidebar.component';
import { EditorCategoriesComponent } from './blog/editor/editor-sidebar/editor-categories/editor-categories.component';
import { EditorTagsComponent } from './blog/editor/editor-sidebar/editor-tags/editor-tags.component';
import { PetsComponent } from './pets/pets.component';
import { PetPostComponent } from './pets/pet-post/pet-post.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { CreateMarkerComponent } from './map/create-marker/create-marker.component';
import { EditMarkerComponent } from './map/edit-marker/edit-marker.component';
import { OrderByMessagesPipe } from './pipes/order-by-messages.pipe';
import { ImpersonateComponent } from './impersonate/impersonate.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PetProfileComponent } from './pets/pet-profile/pet-profile.component';
import { PetFollowComponent } from './pets/pet-follow/pet-follow.component';
import { MentionPipe } from './pipes/mention.pipe';
import { PetPostProfileComponent } from './pets/pet-post-profile/pet-post-profile.component';
import { PetPostCommentComponent } from './pets/pet-post-comment/pet-post-comment.component';
import { PetProfileThumbnailComponent } from './pets/pet-profile-thumbnail/pet-profile-thumbnail.component';
import { PetPostCreateComponent } from './pets/pet-post-create/pet-post-create.component';
import { LoadingComponent } from './loading/loading.component';

export function setupAppConfigServiceFactory(
    service: AppConfigService
): Function {
    return () => service.load();
}

export function setupTranslateServiceFactory(
    service: TranslateService
): Function {
    return () => service.use(navigator.language == "es-ES" ? "es" : "gb");
}

export function setupBadWordsServiceFactory(
    service: BadWordsService
): Function {
    return () => service.setup();
}

@NgModule({
    declarations: [
        AppComponent,
        SignupComponent,
        LandingComponent,
        ProfileComponent,
        NavbarComponent,
        FooterComponent,
        LoginComponent,
        LogoutComponent,
        MatchComponent,
        MapComponent,
        PageNotFoundComponent,
        InfoComponent,
        LegendComponent,
        SettingsComponent,
        BlogComponent,
        CardComponent,
        CategoriesComponent,
        NewsletterComponent,
        AdminComponent,
        AdminSidebarComponent,
        AdminDashboardComponent,
        AdminUsersComponent,
        AdminRolesComponent,
        AdminPetsComponent,
        AdminSpeciesComponent,
        AdminBreedsComponent,
        AdminLikesComponent,
        AdminMatchesComponent,
        AdminChatsComponent,
        AdminMessagesComponent,
        AdminMarkersComponent,
        AdminEditComponent,
        MessagesComponent,
        MatchesComponent,
        LikesComponent,
        UserDropdownComponent,
        PrivacyComponent,
        TextareaAutosizeDirective,
        ChatComponent,
        MessageComponent,
        ForgotpasswordComponent,
        RelatedStoriesComponent,
        LatestBlogpostsComponent,
        TheTeamComponent,
        LanguageSelectComponent,
        BlogPostComponent,
        EditProfileComponent,
        BlogCommentComponent,
        MarkerIconPipe,
        NewVersionCheckerComponent,
        RelatedStoryComponent,
        AlertComponent,
        EditorComponent,
        EditorSidebarComponent,
        EditorCategoriesComponent,
        EditorTagsComponent,
        PetsComponent,
        PetPostComponent,
        DateAgoPipe,
        CreateMarkerComponent,
        EditMarkerComponent,
        OrderByMessagesPipe,
        ImpersonateComponent,
        SidebarComponent,
        PetProfileComponent,
        PetFollowComponent,
        MentionPipe,
        PetPostProfileComponent,
        PetPostCommentComponent,
        PetProfileThumbnailComponent,
        PetPostCreateComponent,
        LoadingComponent,
    ],
    imports: [
        NgbModule,
        NgbAccordionModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AppRoutingModule,
        HomeModule,
        HttpClientModule,
        HttpClientJsonpModule,
        GoogleMapsModule,
        NgxEditorModule,
        EllipsisModule,
        ServiceWorkerModule.register("ngsw-worker.js", {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: "registerWhenStable:30000",
        }),
    ],
    providers: [
        TranslateService,
        {
            provide: APP_INITIALIZER,
            useFactory: setupAppConfigServiceFactory,
            deps: [AppConfigService],
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: setupTranslateServiceFactory,
            deps: [TranslateService],
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: setupBadWordsServiceFactory,
            deps: [BadWordsService],
            multi: true
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
