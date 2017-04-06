var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
export let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [
            RouterModule.forRoot([
                { path: '', redirectTo: '/home', pathMatch: 'full' },
                { path: 'home', loadChildren: 'app/home/home.module#HomeModule' },
                { path: 'propertydetail', loadChildren: 'app/property/property.module#PropertyModule' },
                { path: 'about', loadChildren: 'app/about/about.module#AboutModule' },
                { path: 'contact', loadChildren: 'app/contact/contact.module#ContactModule' }
            ])
        ],
        exports: [
            RouterModule
        ]
    }), 
    __metadata('design:paramtypes', [])
], AppRoutingModule);
//# sourceMappingURL=app-routing.module.js.map