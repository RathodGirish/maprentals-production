/**
 * Property Modules.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core'
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ShareButtonsModule, ShareButton, ShareProvider } from "ng2-sharebuttons";

import { PropertyDetailComponent } from './property-detail.component';
import { PropertyDetailRoutingModule } from "./property-detail-routing.module";
import { MapComponent }  from '../map/map.component';
import { SliderModule }  from '../custom/slider/slider.module';
import { CarouselModule }  from '../custom/slider/carousel.module';
import { SliderComponent }  from '../custom/slider/slider.component';
import { CarouselComponent }  from '../custom/slider/carousel.component';

@NgModule({
    imports: [
        CommonModule,
        PropertyDetailRoutingModule,
        AgmCoreModule.forRoot({
	      apiKey: 'AIzaSyDDzDhPdfZqovfLofbrBlOQircVk9F975M',
	      libraries: ['places']
	    }),
	    ShareButtonsModule.forRoot(),
        FormsModule, 
        ReactiveFormsModule
    ],
    declarations: [
        PropertyDetailComponent,
        SliderComponent,
        CarouselComponent
    ]
})
export class PropertyDetailModule {
}