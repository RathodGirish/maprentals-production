/**
 * Profile Modules.
 */
import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent }    from './profile.component';
import { ProfileRoutingModule } from "./profile-routing.module";

@NgModule({
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    declarations: [
        ProfileComponent
    ]
})
export class ProfileModule {
}