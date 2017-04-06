/**
 * Property Modules.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PropertyComponent} from './property.component';
import {PropertyDetailComponent} from './property-detail.component';
import {PropertyListComponent} from './property-list.component';
import {PropertyRoutingModule} from "./property-routing.module";

@NgModule({
    imports: [
        CommonModule,
        PropertyRoutingModule
    ],
    declarations: [
        PropertyComponent,
        PropertyDetailComponent,
        PropertyListComponent
    ]
})
export class PropertyModule {
}