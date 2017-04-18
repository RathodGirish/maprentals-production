/**
 * About Component.
 */
import { Component, OnInit } from '@angular/core';
import { User } from '../../components/models/user';
import { Profile } from '../../components/models/profile';

import { Router, ActivatedRoute } from '@angular/router';

import { CommonAppService, PropertyService } from '../../services/index';

import { CoolLocalStorage } from 'angular2-cool-storage';


@Component({
	selector: 'profile',
	providers: [
        PropertyService, 
        CommonAppService,
        CoolLocalStorage
    ],
    templateUrl: './myrentals.component.html'
})
export class MyrentalsComponent implements OnInit{
	currentUser: any;
	public Search = '';
	public userFilter: any = { Title: '', Address: '', MonthlyRent: ''};
	public filter: any;
	public myrentals: any[] = [];
	public loading: boolean = false;
	public _success_msg: string = '';
	public _fail_msg: string = '';
	public visible = false;
	public visibleAnimate = false;
	public activeDeactiveMsg: string= "";
	public deleteModalTitle: string= "";
	public isDeactiveBtn: boolean = false;
	public prop: any;

	localStorage: CoolLocalStorage;
	public returnUrl: string;
	public isReload: any = "false";

	constructor(public route: ActivatedRoute,
		public router: Router,
		public propertyService: PropertyService,
		public commonAppService: CommonAppService,
		localStorage: CoolLocalStorage) {
	    this.localStorage = localStorage; 

  	}
  	

	ngOnInit() {
		let THIS = this;
	    this.currentUser = this.localStorage.getObject('currentUser');
	    console.log(' currentUser ' + JSON.stringify(this.currentUser));
	    this.route.params.subscribe(params => {
	       	THIS.isReload = params['Reload'];
	    });	

		if(!THIS.commonAppService.isUndefined(THIS.currentUser)){
			this.loading = true;
			this.propertyService.getAllPropertiesByUserId(this.currentUser.Id)
	            .subscribe((data: any) => {

	            	data.sort(function(a,b){
	            		let parsed_date = new Date(b.DateCreated);
	    				let relative_to = new Date(a.DateCreated);
	            		let diff = parsed_date.getTime()-relative_to.getTime();
	            		let flag = new Number(Math.floor(diff));
						return flag;
					});
	            	this.myrentals = data;
	            	this.loading = false;
	            },
	            (error: any) => {
	            	console.log(' Error while getProfileById : ' + JSON.stringify(error));
	            	this.loading = false;
	            });

		} else {
			window.location.href = "/";
		}
		
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}


    ngAfterViewInit() {
        if(this.isReload == "true"){
	   		console.log(' this.isReload ' + this.isReload);
	   		window.location.href = "/myrentals";
	   		//window.location.reload();
	   	}
    }

	editProperty(event: any, prop: any){
        event.stopPropagation();
        if(!this.commonAppService.isUndefined(prop.Id)){
        	window.location.href = "manageProperty/" + prop.Id;
        	// this.router.navigate( [
	        //     'manageProperty', { Id: prop.Id}
	        // ]);
        }
    }

    propertyDetails(event: any, prop: any){
        event.stopPropagation();
        window.location.href = this.commonAppService.getPropertyDetailsUrl(prop.Address, prop.PropertyType, prop.Title, prop.Id); 
        // if(!this.commonAppService.isUndefined(prop.Id)){
        // 	this.router.navigate( [
	       //      'propertyDetails', { Id: prop.Id}
	       //  ]);
        // }
    }

    deleteProperty(event: any, prop: any){
        event.stopPropagation();
        console.log(' deleteProperty ' + JSON.stringify(prop));
        this.openModal('deleteAlertModalBtn');
        this.activeDeactiveMsg = (prop.IsActive == true)? "Deactivate instead! When unit is vacant again, log-in and re-activate it with 1-click." : "Your listing is already hidden from tenants.  Keep it saved for next time.";

        this.isDeactiveBtn = (prop.IsActive == false)? false : true;
        this.prop = prop;
        this.deleteModalTitle = prop.Title;
    }

    openModal(ButtonId: string){
    	console.log(' ButtonId ' + ButtonId);
	    this.visible = true;
	  	setTimeout(() => this.visibleAnimate = true);
	}

	public hideModal(): void {
	  	this.visibleAnimate = false;
	  	setTimeout(() => this.visible = false, 300);
	}

	activeDeactiveProperty(prop: any){
		this.loading = true;
	    prop.IsActive = !prop.IsActive;
	    this.propertyService.activeDeactivePropertyById(prop.Id, prop.IsActive)
            .subscribe((data:any) => {
            	console.log(' data ' + JSON.stringify(data));
            	this._success_msg = data;
            	this.loading = false;
            },
            (error: any) => {
            	console.log(' Error while activeDeactiveProperty : ' + JSON.stringify(error));
            	this._fail_msg = error;
            	this.loading = false;
            });
	}

	activeDeActivateProperty(){
		console.log(' this.prop ' + JSON.stringify(this.prop));
		if(!this.commonAppService.isUndefined(this.prop)){
			this.activeDeactiveProperty(this.prop);	
		}
		this.hideModal();
	}

	setIsDeletedTrueProperty(){
		console.log(' this.prop ' + JSON.stringify(this.prop));
		this.loading = true;
	    if(!this.commonAppService.isUndefined(this.prop)){
			this.propertyService.deletePropertyById(this.prop.Id)
	            .subscribe((data:any) => {
	            	console.log(' data ' + JSON.stringify(data));
	            	this._success_msg = data;
	            	this.loading = false;
	            	this.myrentals.splice(this.myrentals.indexOf(this.prop), 1);
	            },
	            (error: any) => {
	            	console.log(' Error while deleteProperty : ' + JSON.stringify(error));
	            	this._fail_msg = error;
	            	this.loading = false;
	            });
		}
		this.hideModal();
	}

	updateData(value: any) {
		console.log('event value'+ value);
		// this.userFilter.Title = value;
		// this.userFilter.Address = value;
		// this.userFilter.MonthlyRent = value;
    }
}