/**
 * Property Details Component.
 */
import { Component, ViewChild, NgModule, OnInit, Input, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Directive, Renderer, HostListener, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl  } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AgmCoreModule, MapsAPILoader, NoOpMapsAPILoader, MouseEvent } from "angular2-google-maps/core";
import { Property } from '../models/property';
import { CommonAppService, PropertyService, ProfileService } from '../../services/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ShareButtonsModule, ShareButton, ShareProvider } from "ng2-sharebuttons";
import { Ng2PageScrollModule } from 'ng2-page-scroll/ng2-page-scroll';
// import { MetadataService } from 'ng2-metadata';
// import { MetaService } from 'ng2-meta';

export enum Direction {UNKNOWN, NEXT, PREV}

@Component({
	providers: [
        PropertyService, 
        ProfileService,
        CommonAppService,
        CoolLocalStorage,
        Ng2PageScrollModule
    ],
    styleUrls: [ './property-detail.component.css' ],
    templateUrl: './property-detail.component.html'
})

export class PropertyDetailComponent implements OnInit, AfterViewInit{
	currentUser: any;
	localStorage: CoolLocalStorage;
	public loading: boolean = false;
	public _success_msg: string = '';
	public _fail_msg: string = '';

	public tabActive: string = 'tabPic';

	public email_success_msg: string = '';
	public email_fail_msg: string = '';

	public property: Property;
	public propertyId: string;
	public returnUrl: string;

	public emailUser: EmailUser;
	public RecipientEmail : any = "";

	public latitude: string;
  	public longitude: string;
  	public address: string;
  	public searchControl: FormControl;
  	public zoom: number;
  	public _interval:number;
  	public agreementTermLength: any = "";
  	public availableDateText: any = "";
  	public dateCreatedText: any = "";
  	public isAbleToEdit: boolean= false;
  	public isActiveToggle: boolean= false;
  	public isPropertyFound: boolean= true;
  	public currentPropertyCompany: string = "";

  	fbButton;
  	fbShareTitle = '';
  	fbShareDescription = "";
  	fbShareImage = '';

    @ViewChild('fbBtnRef') fbBtnRef:ElementRef;

    constructor(
		public route: ActivatedRoute,
		public title: Title,
		// public metaDataService: MetadataService,
		// public metaService: MetaService,
		public router: Router,
		public renderer: Renderer,
		public elementRef: ElementRef,
        public commonAppService: CommonAppService,
        public propertyService: PropertyService,
        public profileService: ProfileService,
        public mapsAPILoader: MapsAPILoader,
    	public ngZone: NgZone,
    	localStorage: CoolLocalStorage) { 
    	this.localStorage = localStorage; 
		this.propertyId = route.snapshot.params['Id'];

		console.log(' route.snapshot.params ' + JSON.stringify(route.snapshot.params));

		if(this.commonAppService.isUndefined(this.propertyId)){
			this.propertyId = this.commonAppService.getPropertyIdFromTitle(route.snapshot.params['title']);
		}
		console.log(' this.propertyId ' + JSON.stringify(this.propertyId));
		
	}

	ngAfterViewInit() {
		
		// $(".carousel").swipe({

		// 	swipe: function(event, direction, distance, duration, fingerCount, fingerData) {

		// 	    if (direction == 'left') $(this).carousel('next');
		// 	    if (direction == 'right') $(this).carousel('prev');

		// 	},
		// 	allowPageScroll:"vertical"

		// });
    }

	ngOnInit() {
		let THIS = this;
		this.fbShareDescription = 'This is a first sharing description';
		this.fbButton = "<img src='../assets/public/img/fb-share.svg'>";
		this.fbShareTitle = '$512/mth | TItle | Winipeg | MapRentals.ca';

		this.initProperty();
		this.currentUser = this.localStorage.getObject('currentUser');


		// $("head").append("<meta property='fb:app_id' content='966242223397117' />");

		// $("head").append("<meta property='og:url' content='http://maprentalstest.azurewebsites.net' />");

		// $("head").append("<meta property='og:description' content='test descriptions' />");

		// $("head").append("<meta property='og:title' content='test title' />");

		// $("head").append("<meta property='og:image' content='https://maprental.azureedge.net/property-pictures/201704070557077907.jpg?t=45345345' />");

		// $("head").append("<meta property='og:image:width' content='100' />");

		// $("head").append("<meta property='og:image:height' content='110' />");

		

		if(typeof(this.propertyId) != "undefined" && this.propertyId != "new"){
			this.loading = true;
			this.propertyService.getProperyById(this.propertyId)
	            .subscribe((data: any) => {
	            	this.loading = false;
	            	if(data){
	            		THIS.isPropertyFound = true;
		            	console.log(' data ' + JSON.stringify(data));
		            	this.property = Object.assign({}, data);
		            	this.setShareParameters(this.property);
						// $("meta[property='og\\:url']").attr('content', 'https://maprental.azureedge.net');
						// $("meta[property='og\\:title']").attr('content', this.property.Title);
						// $("meta[name='og\\:description']").attr('content', this.property.Description);
						// $("meta[property='og\\:image']").attr('content', this.property.Pictures[0].Url);
		            	this.setMetaData(this.property);

		            	Observable.of(true)
					      .delay(2000)
					      .subscribe(success => {
					        
					        if(success){
					          this.fbShareTitle = '$' + this.property.MonthlyRent + '/mth | '+ this.property.Title + ' | ' + this.commonAppService.getCityFromAddress(this.property.Address) + ' | MapRentals.ca';
					          this.fbShareDescription = this.property.Description;
					          this.fbShareImage = this.property.Pictures[0].Url;
					        }
					        
					      });

		            	this.setMapPosition({'latitude': this.property.Latitude, 'longitude': this.property.Longitude, 'address': this.property.Address});

		            	if (!this.commonAppService.isUndefined(this.currentUser) && this.currentUser.Id == this.property.UserId) {
		            		this.isAbleToEdit = true;
			            }

		            	if(!this.commonAppService.isUndefined(this.property.AgreementType)){
		            		if(this.property.AgreementType == 'Month-to-Month'){
		            			this.agreementTermLength = 'Month-to-Month';
		            		} else {
		            			if(!this.commonAppService.isUndefined(this.property.AgreementTermLength)){
		            				if(parseInt(this.property.AgreementTermLength) >= 12){
		            					let convertYear = this.commonAppService.calculateYears(this.property.AgreementTermLength);
		            					// (parseInt(this.property.AgreementTermLength)/12);
		            					this.agreementTermLength = this.commonAppService.calculateYears(this.property.AgreementTermLength) + ' ' + this.property.AgreementType;
		            				} else {
		            					this.agreementTermLength = this.property.AgreementTermLength + 'mth' + ' ' + this.property.AgreementType;
		            				}
		            				
		            			} else {
		            				this.agreementTermLength = this.property.AgreementType;
		            			}
		            			
		            		}
		            	}

		            	if(this.property.IsImmediateAvailable == true || (!this.commonAppService.isUndefined(this.property.DateAvailable) && this.commonAppService.getDayDiffFromTwoDate(new Date(), new Date(this.property.DateAvailable)) <= 0) ){
		            		this.availableDateText = "Available Now!";
		            	} else if(!this.commonAppService.isUndefined(this.property.DateAvailable)){
		            		
		            		this.availableDateText = 'Available ' + this.commonAppService.getFormattedDateMD(this.commonAppService.getDateByTimestamp(this.property.DateAvailable));
		            		//this.availableDateText = 'Available ' + this.commonAppService.getFormattedDateMD(this.property.DateAvailable);
		            	}

		            	//this.dateCreatedText = this.commonAppService.getFormattedDate(this.property.DateCreated);
		            	this.dateCreatedText = this.commonAppService.getFormattedDateMDY(this.commonAppService.getCurrentTimeZoneDate(this.property.DateListed));

		            	if(this.commonAppService.isUndefined(this.property.RentInclude)){
							this.property.RentInclude = [];
						} 

						if(this.commonAppService.isUndefined(this.property.Amenities)){
							this.property.Amenities = [];
						}

						this.property.Address = this.commonAppService.formateAddress(this.property.Address);

						this.profileService.getProfileById(this.property.UserId)
				            .subscribe((userDetails: any) => {
				            	console.log(' userDetails : ' + JSON.stringify(userDetails));
				            	if(userDetails && userDetails.Company != ''){
				            		this.currentPropertyCompany = userDetails.Company;
				            	}
				            },
				            (error: any) => {
				            	console.log(' Error while getProfileById : ' + JSON.stringify(error));
				            });

						this.RecipientEmail = (this.commonAppService.isUndefined(this.property.Email))? "" : this.property.Email;	 
					} else {
						THIS.isPropertyFound = false;
					}         
	            },
	            (error: any) => {
	            	console.log(' Error while getProperyById :  ' + JSON.stringify(error));
	            	this.loading = false;
	            });

		} 
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

		this.emailUser = {
			"Name": "",
			"From": "",
			"Recipient": "",
			"Contact": "",
			"Subject": "",
			"Body": ""
		};

		this.mapsAPILoader.load().then(() => {
	    	this.latitude = this.property.Latitude;
			this.longitude = this.property.Longitude;
			this.zoom = 12;
	    });

		
	}

	public setShareParameters(property: any){
		//this.fbShareTitle = "";
	}

	public setMetaData(prop: any){
        // this.title.setTitle(this.commonAppService.getTitleForFullListing(prop));
        // this.metaService.setTitle(this.commonAppService.getTitleForFullListing(prop));
        // this.metaService.setTag('og:description', this.commonAppService.getDescriptionForFullListing(prop));

        // let tm = "" + new Date().getTime();
        // console.log('tm ' + tm);
        // this.metaDataService.setTag('fb:app_id', "966242223397117");
        // this.metaDataService.setTag('og:url', "http://maprentalsstaging.azurewebsites.net?fbrefresh=" + (tm + 5));
        // this.metaDataService.setTag('og:image', prop.Pictures[1].Url + "?t=" + (tm + 4));
        // this.metaDataService.setTag('og:image:type', "image/jpeg");
        // this.metaDataService.setTag('og:image:width', "3523");
        // this.metaDataService.setTag('og:image:height', "2372");
        // this.metaDataService.setTag('image', prop.Pictures[1].Url);

        // this.metaDataService.setTag('og:description', this.commonAppService.getDescriptionByUrl(THIS.currentRouteUrl));
	}

	public setMapPosition(position: any) {
        this.latitude = position.latitude;
        this.longitude = position.longitude;
        this.zoom = 9;
        $('#tabMap').next('a').click();
	}

	public changeTab(event: any, tabVal: string){
		event.preventDefault();
		this.tabActive = tabVal;
	}

	@Input() public get interval():number {
        return this._interval;
    }

    public set interval(value:number) {
        this._interval = value;
        //this.restartTimer();
    }

    isActive(url: string) {
        return url === this.property.Pictures[0].Url;
    }

    public initProperty(){
		this.property = {
	    	"Id": 0,
			"UserId": 0,
			"PropertyType": "",
			"Bed": "",
			"Bath": "",
			"Pet": [],
			"Smoking": "false",
			"RentInclude": [],
			"Parking": "",
			"Amenities": [],
			"LandlordType": "",
			"AgreementType": "",
			"IsImmediateAvailable": false,
			"DateAvailable": "",
			"DateListed": "",
			"AgreementTermLength": "",
			"OwnerName": "",
			"Phone": "",
			"IsPhoneOnly": false,
			"Email": "",
			"IsEmailOnly": false,
			"MonthlyRent": '',
			"Address": "",
			"Title": "",
			"Description": "",
			"Latitude": '',
			"Longitude": '',
			"IsActive": true,
			"DateCreated": "",
			"CreatedBy": "",
			"DateModified": "",
			"ModifiedBy": "",
			"Pictures": [],
			"IsDeleted": false
	    }
	}

	sendEmail(event: any, model: any, isValid: boolean) {
		event.preventDefault();
		
		model.Recipient = this.RecipientEmail;
		console.log('model ' + JSON.stringify(model) + ' isValid ' + isValid);
		if(isValid && !this.commonAppService.isUndefined(model.Recipient)){
			this.commonAppService.sendEmail(model)
	            .subscribe((data: any) => {
	            	this.loading = false;
	            	this.email_success_msg = data;
	            	this.email_fail_msg = '';
	            },
	            (error: any) => {
	            	this.loading = false;
	            	console.log(' Error while sendEmail : ' + JSON.stringify(error));
	            	this.email_fail_msg = error;
	            });
	    }
	}

	activeDeactiveProperty(prop: any){
		this.loading = true;
	    prop.IsActive = !prop.IsActive;
	    this.propertyService.activeDeactivePropertyById(prop.Id, prop.IsActive)
            .subscribe((data:any) => {
            	this._success_msg = data;
            	this.loading = false;
            },
            (error: any) => {
            	console.log(' Error while activeDeactiveProperty : ' + JSON.stringify(error));
            	this._fail_msg = error;
            	this.loading = false;
            });
	}

	goTo(location: string): void {
	    window.location.hash = location;
	}
}

export interface EmailUser {
	"Name": "",
	"From": "",
	"Recipient": "",
	"Contact": "",
	"Subject": "",
	"Body": ""
}