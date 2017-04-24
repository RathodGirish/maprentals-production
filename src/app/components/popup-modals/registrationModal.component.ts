import { Component, ViewChild, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
// import { FormBuilder, Control, ControlGroup, Validators} from 'angular2/angular2';
import { UserService, AccountService, emailValidator, matchingPasswords } from '../../services/index';
import { User } from '../models/user';

export class MyAppModule {}

@Component({
	moduleId: "rmodalModule",
  	selector: 'rmodal',
  	templateUrl: './registrationModal.component.html',
  	providers: [UserService]
})
export class RegistrationModalComponent implements OnInit { 

	public visible = false;
	public visibleAnimate = false;
	public user: any;
	public returnUrl: string;
	public registrationForm;

	public registration_success_msg: string = '';
	public registration_fail_msg: string = '';

	constructor(
        public route: ActivatedRoute,
        public router: Router,
		public formBuilder: FormBuilder,
        public accountService: AccountService) { 
			this.registrationForm = formBuilder.group({
				email: ['', Validators.compose([Validators.required,  emailValidator])],
				password: ['', Validators.required],
				confirmPassword: ['', Validators.required]
			}, {validator: matchingPasswords('password', 'confirmPassword')})
	}

	ngOnInit() {
	    this.user = {
	    	Id: 0,
	      	email: '',
	      	password: '',
	      	confirmpassword: ''
	    }

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	public show(): void {
	  	this.visible = true;
	  	setTimeout(() => this.visibleAnimate = true);
	}

	public hide(): void {
	  	this.visibleAnimate = false;
	  	setTimeout(() => this.visible = false, 300);
	}

	public openModal(id: string){
		this.hide();
	    document.getElementById(id).click();
	}

	public submitRegistration(event: any, model: User, isValid: boolean) {
		event.preventDefault();
		console.log('model, isValid ' + JSON.stringify(model), isValid);
		
		if(isValid){
	        this.accountService.registration(model.email, model.password)
	            .subscribe(data => {
	            	console.log(' data ' + JSON.stringify(data));
	            	if(data.Success == true){
	            		this.registration_success_msg = data.Response;	
	            		this.registration_fail_msg = '';
						setTimeout(() => {
							this.openModal('loginModalBtn');
						}, 1500);
	            	} else {
	            		this.registration_fail_msg = data.Response;	
	            		this.registration_success_msg = '';
	            	}
	            },
	            error => {
	            	console.log(' Error while registration : ' + JSON.stringify(error));
	            	this.registration_fail_msg = error.Response;
	            	this.registration_success_msg = '';
	            });
		}
	}
}

