/**
 * App Modules.
 */
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent }  from './components/navbar/navbar.component';
import { NavbarModule }  from './components/navbar/navbar.module';
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
        MetadataModule.forRoot()
    ],
    bootstrap: [AppComponent],
    providers: []
})
export class AppModule {
}