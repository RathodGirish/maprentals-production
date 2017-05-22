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
import { CommonAppService, PropertyService, ProfileService, UniversalService } from '../../services/index';
import { UniversalModel } from '../../components/models/universalmodel';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ShareButtonsModule, ShareButton, ShareProvider } from "ng2-sharebuttons";
import { Ng2PageScrollModule } from 'ng2-page-scroll/ng2-page-scroll';
import { MetadataService } from 'ng2-metadata';
// import { MetaService } from 'ng2-meta';

export enum Direction {UNKNOWN, NEXT, PREV}

@Component({
	providers: [
        PropertyService, 
        ProfileService,
        CommonAppService,
		UniversalService,
        CoolLocalStorage,
        Ng2PageScrollModule
    ],
    styleUrls: [ './property-detail.component.css' ],
    templateUrl: './property-detail.component.html'
})

export class PropertyDetailComponent implements OnInit, AfterViewInit, OnDestroy {
	currentUser: any;
	localStorage: CoolLocalStorage;
	public loading: boolean = false;
	public _success_msg: string = '';
	public _fail_msg: string = '';
	public NextPhotoInterval:number = 3000;
	public noLoopSlides:boolean = false;

	public tabActive: string = 'tabPic';

	public email_success_msg: string = '';
	public email_fail_msg: string = '';
	public visible = false;
	public visibleAnimate = false;

	public property: Property;
	public propertyId: string;
	public returnUrl: string;

	public emailUser: EmailUser;
	public RecipientEmail : any = "";
	public PropertyAddress : any = "";
	public PropertyTitle : any = "";
	public PropertyUrl : any = "";

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
	public propertyPictures: any[] = [];

  	fbButton;
  	fbShareTitle = '';
  	fbShareDescription = "";
  	fbShareImage = '';

    @ViewChild('fbBtnRef') fbBtnRef:ElementRef;
	public currentRouteURL = "";

	public universalModel: UniversalModel;
	public subscriber: EventEmitter<UniversalModel>;

    constructor(
		public route: ActivatedRoute,
		public title: Title,
		public metaDataService: MetadataService,
		// public metaService: MetaService,
		public universalService: UniversalService,
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

		this.currentRouteURL =  route.snapshot.params['city'] + '/' + route.snapshot.params['propertyType'] + '/' + route.snapshot.params['title'];
		console.log(' window.location  ' + window.location );

		if(this.commonAppService.isUndefined(this.propertyId)){
			this.propertyId = this.commonAppService.getPropertyIdFromTitle(route.snapshot.params['title']);
		}

		let universalModel: UniversalModel = <UniversalModel> {
                title: 'Builtvisible Homepage',
				ogTitle: 'Builtvisible Homepage111',
                description: 'The home page of Builtvisible, a digital marketing agency',
				ogDescription: 'The home page of Builtvisible, a digital marketing agency1112',
                canonical: 'https://builtvisible.com/',
                publisher: 'https://plus.google.com/+Builtvisible'
		};

		this.universalModel = universalModel;

		// Set the data for the service from the model
		universalService.set(universalModel);
		//console.log(' this.universalModel detail ' + JSON.stringify(this.universalModel));


		let tm = "" + new Date().getTime();
        // console.log('tm ' + tm);
        // this.metaDataService.setTag('fb:app_id', "966242223397117");
        // this.metaDataService.setTag('og:url', "http://maprentalsstaging.azurewebsites.net?fbrefresh=" + (tm + 5));
		// this.metaDataService.setTag('og:description', "New decription");
		// this.metaDataService.setTag('og:title', "New title");
        // this.metaDataService.setTag('og:image', "https://maprental.azureedge.net/property-pictures/201704151344454207.jpg?t=" + (tm + 4));
        // this.metaDataService.setTag('og:image:type', "image/jpeg");
        // this.metaDataService.setTag('og:image:width', "3523");
        // this.metaDataService.setTag('og:image:height', "2372");
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

	public ngOnDestroy() { 
		//this.subscriber.unsubscribe() 
	}

	ngOnInit() {
		let THIS = this;
		this.fbShareDescription = 'This is a first sharing description';
		this.fbButton = "<img src='../assets/public/img/fb-share.svg'>";
		this.fbShareTitle = '$512/mth | TItle | Winipeg | MapRentals.ca';

		this.initProperty();
		this.currentUser = this.localStorage.getObject('currentUser');


		// $("head").append("<meta property='fb:app_id' content='966242223397117' />");

		// $("head").append("<meta property='og:url' content='http://maprentalsstaging.azurewebsites.net' />");

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
					console.log(' prop ' + JSON.stringify(data));
	            	if(data){
	            		THIS.isPropertyFound = true;
		            	this.property = Object.assign({}, data);
						THIS.increaseViewCount();
		            	this.setShareParameters(this.property);
						$("meta[property='og\\:url']").attr('content', 'https://maprental.azureedge.net');
						$("meta[property='og\\:title']").attr('content', this.property.Title);
						$("meta[name='og\\:description']").attr('content', this.property.Description);
						if(THIS.commonAppService.isUndefined(this.property.Pictures)){
							this.property.Pictures.push(this.commonAppService.getDefaultPictures(this.property)); 
						}
						$("meta[property='og\\:image']").attr('content', this.property.Pictures[0].Url);
		            	//this.setMetaData(this.property);
						// $(window).prerenderReady = true;
						$('.property-description').html("<p>" + this.property.Description + "</p>");
						
						THIS.propertyPictures = THIS.commonAppService.getSortedPicturesList(this.property.Pictures);

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
		            	} else if(!this.commonAppService.isUndefined(this.property.DateAvailable) && !(this.property.DateAvailable == 'NaN')){
		            		
		            		this.availableDateText = 'Available ' + this.commonAppService.getFormattedDateMD(this.commonAppService.getDateByTimestamp(this.property.DateAvailable));
		            		//this.availableDateText = 'Available ' + this.commonAppService.getFormattedDateMD(this.property.DateAvailable);
		            	}

		            	//this.dateCreatedText = this.commonAppService.getFormattedDate(this.property.DateCreated);
		            	this.dateCreatedText = this.commonAppService.getFormattedDateMDY((this.property.DateListed));

		            	if(this.commonAppService.isUndefined(this.property.RentInclude)){
							this.property.RentInclude = [];
						} 

						if(this.commonAppService.isUndefined(this.property.Amenities)){
							this.property.Amenities = [];
						}

						this.property.Address = this.commonAppService.formateAddress(this.property.Address);

						this.profileService.getProfileById(this.property.UserId)
				            .subscribe((userDetails: any) => {
				            	if(userDetails && userDetails.Company != ''){
				            		this.currentPropertyCompany = userDetails.Company;
				            	}
				            },
				            (error: any) => {
				            	console.log(' Error while getProfileById : ' + JSON.stringify(error));
				            });

						this.RecipientEmail = (this.commonAppService.isUndefined(this.property.Email))? "" : this.property.Email;	
						this.PropertyAddress = this.property.Address;
						this.PropertyTitle = this.property.Title;
						this.PropertyUrl = window.location.href; 
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
			"PropertyAddress": "",
			"PropertyTitle": "",
			"PropertyUrl": "",
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

	public increaseViewCount(){

		this.propertyService.updatePropertyViewsCount(this.property.Id)
            .subscribe((data: any) => {
                console.log(' updatePropertyViewsCount ' + JSON.stringify(data));
            },
            (error: any) => {
                console.log(' Error while updatePropertyViewsCount : ' + JSON.stringify(error));
            });
	}

	public setShareParameters(property: any){
		//this.fbShareTitle = "";
	}

	public setMetaData(prop: any){
        this.title.setTitle(this.commonAppService.getTitleForFullListing(prop));
        this.metaDataService.setTitle(this.commonAppService.getTitleForFullListing(prop));
        // this.metaService.setTag('og:description', this.commonAppService.getDescriptionForFullListing(prop));

        let tm = "" + new Date().getTime();
        console.log('tm ' + tm);
        this.metaDataService.setTag('fb:app_id', "966242223397117");
        this.metaDataService.setTag('og:url', "http://maprentalsstaging.azurewebsites.net?fbrefresh=" + (tm + 5));
        this.metaDataService.setTag('og:image', prop.Pictures[0].Url + "?t=" + (tm + 4));
        this.metaDataService.setTag('og:image:type', "image/jpeg");
        this.metaDataService.setTag('og:image:width', "3523");
        this.metaDataService.setTag('og:image:height', "2372");
        this.metaDataService.setTag('image', prop.Pictures[0].Url);

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

    public isActive(url: string) {
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

	public sendEmail(event: any, model: any, isValid: boolean) {
		event.preventDefault();
		
		model.Recipient = this.RecipientEmail;
		model.PropertyAddress = this.PropertyAddress;
		model.PropertyTitle = this.PropertyTitle;
		model.PropertyUrl = this.PropertyUrl;

		console.log('model ' + JSON.stringify(model) + ' isValid ' + isValid);
		if(isValid && !this.commonAppService.isUndefined(model.Recipient)){
			this.loading = true;
			this.commonAppService.sendEmail(model)
	            .subscribe((data: any) => {
	            	this.loading = false;
	            	this.email_success_msg = data;
	            	this.email_fail_msg = '';
					this.openModal();
	            },
	            (error: any) => {
	            	this.loading = false;
	            	console.log(' Error while sendEmail : ' + JSON.stringify(error));
	            	this.email_fail_msg = error;
					this.openModal();
	            });
	    }
	}

	public activeDeactiveProperty(prop: any){
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

	public goTo(location: string): void {
	    window.location.hash = location;
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

export interface EmailUser {
	"Name": "",
	"From": "",
	"Recipient": "",
	"PropertyAddress": "",
	"PropertyTitle": "",
	"PropertyUrl": "",
	"Contact": "",
	"Subject": "",
	"Body": ""
}