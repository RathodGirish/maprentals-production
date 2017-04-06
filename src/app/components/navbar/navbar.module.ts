import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NavbarComponent } from './navbar.component';
import { LoginModalComponent } from '../../components/popup-modals/loginModal.component';
import { RegistrationModalComponent } from '../../components/popup-modals/registrationModal.component';

@NgModule({
  	imports: [ 
  		RouterModule, 
  		CommonModule, 
  		FormsModule, 
  		ReactiveFormsModule ],
  	declarations: [ 
  		LoginModalComponent, 
  		RegistrationModalComponent, 
  		NavbarComponent ],
  	exports: [ 
  		NavbarComponent 
  		]
})
export class NavbarModule {}
