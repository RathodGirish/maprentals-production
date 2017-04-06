/**
 * App Routing.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';


@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', redirectTo: '/home', pathMatch: 'full'},
            {path: 'home', loadChildren: 'app/components/home/home.module#HomeModule'},
            {path: 'propertydetail', loadChildren: 'app/components/property/property.module#PropertyModule'},
            {path: 'myrentals', loadChildren: 'app/components/myrentals/myrentals.module#MyrentalsModule'},
            {path: 'profile', loadChildren: 'app/components/profile/profile.module#ProfileModule'},
            {path: 'about', loadChildren: 'app/components/about/about.module#AboutModule'},
            {path: 'contact', loadChildren: 'app/components/contact/contact.module#ContactModule'}
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}