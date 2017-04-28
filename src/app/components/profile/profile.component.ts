/**
 * About Component.
 */
import { Component, OnInit } from '@angular/core';
import { User } from '../../components/models/user';
import { Profile } from '../../components/models/profile';

import { Router, ActivatedRoute } from '@angular/router';

import { CommonAppService, ProfileService } from '../../services/index';

import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'profile',
	providers: [
        ProfileService, 
        CommonAppService,
        CoolLocalStorage
    ],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit{
	currentUser: any;
	profile: Profile;
	public loading: boolean = false;
	public loadingBtnSpinner: string = "<span>Save</span>";
	localStorage: CoolLocalStorage;
	public returnUrl: string;
	public _success_msg: string = '';
	public _fail_msg: string = '';
	public visible = false;
	public visibleAnimate = false;

	constructor(public route: ActivatedRoute,
		public router: Router,
		public profileService: ProfileService,
		public commonAppService: CommonAppService,
		localStorage: CoolLocalStorage) {
	    this.localStorage = localStorage;  
  	}

	ngOnInit() {
		this.initProfile();
	    this.currentUser = this.localStorage.getObject('currentUser');
	    console.log(' currentUser ' + JSON.stringify(this.currentUser));
		if(this.commonAppService.isUndefined(this.currentUser)){
			window.location.href = '/';
			return;
		}

		if(typeof(this.currentUser) != "undefined" && this.currentUser.Id != null){
			this.loading = true;
			this.profileService.getProfileById(this.currentUser.Id)
	            .subscribe((data: any) => {
	            	console.log(' data ' + JSON.stringify(data));
	            	data.Password = "";
	            	this.profile = data;
	            	this.loading = false;
	            },
	            (error: any) => {
	            	console.log(' Error while getProfileById : ' + JSON.stringify(error));
	            	this.loading = false;
	            });

		} 
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	public initProfile(){
		this.profile = {
	    	"Id": 0,
			"FirstName": "",
			"Contact": "",
			"Email": "",
			"Password": "",
			"Company": "",
			"LandlordType": "",
			"Picture": "",
			"Salt": "",
			"EmailConfirmed": true,
			"SecurityStamp": "",
			"IsActive": true,
			"DateCreated": "",
			"CreatedBy": "",
			"DateModified": "",
			"ModifiedBy": "",
			"IsDeleted": false
	    }
	}

	public updateProfile(event: any, model: Profile, isValid: boolean) {
		event.preventDefault();
		
		model.Id = this.profile.Id;
		console.log('model ' + JSON.stringify(model) + ' isValid ' + isValid);
		console.log('this.profile ' + JSON.stringify(this.profile));

		if(isValid){
			this.loading= true;
			this.loadingBtnSpinner = "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> <span> Save</span>";
			if(!this.commonAppService.isUndefined(model.Password)){
				let passwordDetails = {
					"userId" : model.Id,
					"password" : model.Password
				}
				this.profileService.updatePassword(passwordDetails)
		            .subscribe((data: any) => {
		            	this.loading = false;
		            	console.log(' data ' + JSON.stringify(data));
		            	this.updateProfileFunction(model);
		            },
		            (error: any) => {
		            	this.loading = false;
		            	this._fail_msg = "Fail to update Password " + error;
		            	console.log(' Error while updatePassword : ' + JSON.stringify(error));
		            	this.loadingBtnSpinner = "<span>Save</span>";
						this.reloadPage();
		            });
			} else {
				this.updateProfileFunction(model);
			}			
	    }
	}

	public updateProfileFunction(modelData: any){
		let THIS = this;
		console.log('modelData ' + JSON.stringify(modelData));
		THIS.getProfileByEmail(modelData, function(canUpdateProfile){
			console.log('canUpdateProfile ' + canUpdateProfile);
			if(canUpdateProfile){
				THIS.profileService.updateProfile(modelData)
					.subscribe((data: any) => {
						THIS.loading = false;
						console.log(' data ' + JSON.stringify(data));
						THIS._success_msg = "Profile Updated Successfully";
						THIS._fail_msg = "";
						THIS.loadingBtnSpinner = "<span>Save</span>";
						if(THIS.profile.Email != modelData.Email){
							THIS.localStorage.removeItem('currentUser');
							THIS.currentUser.Email = modelData.Email;
							THIS.localStorage.setObject('currentUser', THIS.currentUser);
						}
						THIS.reloadPage();
						//THIS.router.navigate([THIS.returnUrl]);
					},
					(error: any) => {
						THIS.loading = false;
						THIS._fail_msg = "Fail to update Profile " + error;
						console.log(' Error while updateProfile : ' + JSON.stringify(error));
						THIS.loadingBtnSpinner = "<span>Save</span>";
						THIS.reloadPage();
					});
			} else {
				THIS._success_msg = "";
				THIS._fail_msg = "Email Already Exists. Please try with different.";
				THIS.loadingBtnSpinner = "<span>Save</span>";
				THIS.reloadPage();
			}
		});
		
	}

	public getProfileByEmail(modelData: any, callback: any){
		let THIS = this;
		if(THIS.profile.Email == modelData.Email){
			callback(true);
		} else {
			THIS.profileService.getProfileByEmail(modelData.Email)
				.subscribe((data: any) => {
					THIS.loading = false;
					console.log(' data ' + JSON.stringify(data));
					if(THIS.commonAppService.isUndefined(data)){
						callback(true);
					} else {
						callback(false);
					}
				},
				(error: any) => {
					THIS.loading = false;
					callback(false);
				});
		}
	}

	public reloadPage(){
		setTimeout(() => {
			window.location.href = '/profile';
		}, 2000);
	}

	public openModal(){
	    this.visible = true;
	  	setTimeout(() => this.visibleAnimate = true);
	}

	public hideModal(): void {
	  	this.visibleAnimate = false;
	  	setTimeout(() => this.visible = false, 300);
	}
}