/**
 * About Routing.
 */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyrentalsComponent } from './myrentals.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MyrentalsComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MyrentalsRoutingModule {
}