/**
 * App Routing.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forRoot([
            // {
            //     path: '', 
            //     redirectTo: '/', 
            //     pathMatch: 'full'
            // },
            {
                path: '', 
                loadChildren: 'app/components/home/home.module#HomeModule'
            },
            {
                path: 'about', 
                loadChildren: 'app/components/about/about.module#AboutModule'
            },
            {
                path: 'contact', 
                loadChildren: 'app/components/contact/contact.module#ContactModule'
            },
            {
                path: 'profile', 
                loadChildren: 'app/components/profile/profile.module#ProfileModule'
            },
            {
                path: 'myrentals', 
                loadChildren: 'app/components/myrentals/myrentals.module#MyrentalsModule'
            },
            {
                path: 'myrentals/:reload', 
                loadChildren: 'app/components/myrentals/myrentals.module#MyrentalsModule'
            },
            {
                path: 'manageProperty/:id', 
                loadChildren: 'app/components/property/manage-property.module#ManagePropertyModule'
            },
            {
                path: 'manageProperty/:id/:reload', 
                loadChildren: 'app/components/property/manage-property.module#ManagePropertyModule'
            },
            {
                path: 'propertyDetail/:id', 
                loadChildren: 'app/components/property/property-detail.module#PropertyDetailModule',
                data: {
                    meta: {
                        title: 'PropertyDetailModule page',
                        description: 'Description of the PropertyDetailModule page'
                    }
                }
            },
            {
                path: ':city/:propertyType', 
                loadChildren: 'app/components/property/property-detail.module#PropertyDetailModule',
                data: {
                    meta: {
                        title: 'PropertyDetailModule page',
                        description: 'Description of the PropertyDetailModule page'
                    }
                }
            },
            {
                path: ':city/:propertyType/:title', 
                loadChildren: 'app/components/property/property-detail.module#PropertyDetailModule',
                data: {
                    meta: {
                        title: 'PropertyDetailModule page',
                        description: 'Description of the PropertyDetailModule page'
                    }
                }
            },
            {
                path: ':city',
                loadChildren: 'app/components/home/home.module#HomeModule',
                data: {
                  type: 'city'
                }
            },
            {   path: '**', 
                redirectTo: '' 
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}