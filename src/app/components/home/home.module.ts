/**
 * Home page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core'
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { Multiselect, FilterPipe } from '../custom/multiselect/multiselect.component';
import { NgxMyDatePickerModule  } from 'ngx-mydatepicker';
import { Ng2ImgToolsModule } from 'ng2-img-tools';

import { HomeComponent } from './home.component';
import { MapComponent }  from '../map/map.component';
// import {CustomMapDirective} '../../components/map/markerclusterer';
// import { MarkerComponent } from '../../components/map/marker.component';
import { HomeRoutingModule } from "./home-routing.module";


@NgModule({
    imports: [
        CommonModule,
        HomeRoutingModule,
        AgmCoreModule.forRoot({
	      apiKey: 'AIzaSyDDzDhPdfZqovfLofbrBlOQircVk9F975M',
	      libraries: ['places']
	    }),
        NgxMyDatePickerModule,
        Ng2ImgToolsModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    declarations: [
        HomeComponent,
        MapComponent,
        Multiselect,
        // MarkerComponent,
        // CustomMapDirective,
        FilterPipe
    ]
})
export class HomeModule {
}