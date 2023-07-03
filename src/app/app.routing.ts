import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { MatchComponent } from './match/match.component';
import { MapComponent } from './map/map.component';
import { SettingsComponent } from './settings/settings.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { BlogComponent } from './blog/blog.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
    { path: 'home',             component: HomeComponent },
    { path: 'profile',          component: ProfileComponent },
    { path: 'register',         component: SignupComponent },
    { path: 'landing',          component: LandingComponent },
    { path: 'login',            component: LoginComponent },
    { path: 'logout',           component: LogoutComponent },
    { path: 'match',            component: MatchComponent },
    { path: 'map',              component: MapComponent },
    { path: 'admin',            component: AdminComponent },
    { path: 'settings',         component: SettingsComponent },
    { path: 'blog',             component: BlogComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**',               component: PageNotFoundComponent },
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            useHash: true
        })
  ],
  exports: [ ],
})
export class AppRoutingModule { }
