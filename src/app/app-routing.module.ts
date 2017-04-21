/**
 * App Routing.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import { MetaGuard, MetaModule, MetaLoader, MetaStaticLoader, PageTitlePositioning } from '@nglibs/meta';

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
                canActivateChild: [MetaGuard],
                loadChildren: 'app/components/home/home.module#HomeModule'
            },
            {
                path: 'about', 
                canActivateChild: [MetaGuard],
                loadChildren: 'app/components/about/about.module#AboutModule'
            },
            {
                path: 'contact', 
                canActivateChild: [MetaGuard],
                loadChildren: 'app/components/contact/contact.module#ContactModule'
            },
            {
                path: 'profile', 
                canActivateChild: [MetaGuard],
                loadChildren: 'app/components/profile/profile.module#ProfileModule'
            },
            {
                path: 'myrentals', 
                canActivateChild: [MetaGuard],
                loadChildren: 'app/components/myrentals/myrentals.module#MyrentalsModule'
            },
            {
                path: 'myrentals/:reload', 
                canActivateChild: [MetaGuard],
                loadChildren: 'app/components/myrentals/myrentals.module#MyrentalsModule'
            },
            {
                path: 'manageProperty/:id', 
                canActivateChild: [MetaGuard],
                loadChildren: 'app/components/property/manage-property.module#ManagePropertyModule'
            },
            {
                path: 'manageProperty/:id/:reload', 
                canActivateChild: [MetaGuard],
                loadChildren: 'app/components/property/manage-property.module#ManagePropertyModule'
            },
            {
                path: 'propertyDetail/:id', 
                canActivateChild: [MetaGuard],
                loadChildren: 'app/components/property/property-detail.module#PropertyDetailModule',
                data: {
                    meta: {
                        title: 'PropertyDetailModule page',
                        override: true,
                        description: 'Description of the PropertyDetailModule page'
                    }
                }
            },
            {
                path: ':city/:propertyType', 
                canActivateChild: [MetaGuard],
                loadChildren: 'app/components/property/property-detail.module#PropertyDetailModule',
                data: {
                    meta: {
                        title: 'PropertyDetailModule page',
                        override: true,
                        description: 'Description of the PropertyDetailModule page'
                    }
                }
            },
            {
                path: ':city/:propertyType/:title', 
                canActivateChild: [MetaGuard],
                loadChildren: 'app/components/property/property-detail.module#PropertyDetailModule',
                data: {
                    meta: {
                        title: 'PropertyDetailModule page',
                        override: true,
                        description: 'Description of the PropertyDetailModule page'
                    }
                }
            },
            {
                path: ':city',
                canActivateChild: [MetaGuard],
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