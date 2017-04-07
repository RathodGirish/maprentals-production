/**
 * Property Details Routing.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {PropertyDetailComponent}  from './property-detail.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PropertyDetailComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class PropertyDetailRoutingModule {
}