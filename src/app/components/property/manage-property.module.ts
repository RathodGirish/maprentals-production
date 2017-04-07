/**
 * ManageProperty Modules.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core'
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { DatepickerModule } from 'ng2-bootstrap/datepicker';
import { NgxMyDatePickerModule  } from 'ngx-mydatepicker';
import { Ng2ImgToolsModule } from 'ng2-img-tools';
import { PopoverModule } from 'ng2-bootstrap/popover';
import { ManagePropertyComponent } from './manage-property.component';
import { ManagePropertyRoutingModule } from "./manage-property-routing.module";

@NgModule({
    imports: [
        CommonModule,
        ManagePropertyRoutingModule,
        AgmCoreModule.forRoot({
	      apiKey: 'AIzaSyDDzDhPdfZqovfLofbrBlOQircVk9F975M',
	      libraries: ['places']
	    }),
        NgxMyDatePickerModule, 
        PopoverModule.forRoot(),
        Ng2ImgToolsModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    declarations: [
        ManagePropertyComponent
    ]
})
export class ManagePropertyModule {
}