/**
 * Profile Modules.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MyrentalsComponent } from './myrentals.component';
import { MyrentalsRoutingModule } from "./myrentals-routing.module";

import { CustomFilter } from '../../components/custom/pipes/CustomFilter';

@NgModule({
    imports: [
        CommonModule,
        MyrentalsRoutingModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    declarations: [
        CustomFilter,
        MyrentalsComponent
    ]
})
export class MyrentalsModule {
}