/**
 * Created by namita on 7/10/16.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {PropertyComponent}    from './property.component';
import {PropertyDetailComponent}  from './property-detail.component';
import {PropertyListComponent} from './property-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PropertyComponent,
                children: [
                    {
                        path: '',
                        component: PropertyListComponent
                    },
                    {
                        path: ':Id',
                        component: PropertyDetailComponent,
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class PropertyRoutingModule {
}