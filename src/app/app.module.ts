/**
 * App Modules.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, EventEmitter, Renderer } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarModule }  from './components/navbar/navbar.module';
import { HeaderModule }  from './components/header/header.module';
// import { UniversalModule } from 'angular2-universal/node';
import { MetadataModule } from 'ng2-metadata';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        NavbarModule,
        // UniversalModule,
        HeaderModule,
        MetadataModule.forRoot()
    ],
    bootstrap: [AppComponent],
    providers: []
})
export class AppModule{
}