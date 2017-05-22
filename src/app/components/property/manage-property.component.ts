/**
 * Manage Property Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, NgZone, Directive, Renderer, ElementRef, Inject  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, PropertyService, UploadPictureService, ProfileService } from '../../services/index';

import { Property } from '../models/property';
import { User } from '../../components/models/user';

import { Observable } from 'rxjs/Observable';
import { DatepickerModule } from 'ng2-bootstrap/datepicker';
import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { PopoverModule } from 'ng2-bootstrap/popover';
import { AppComponent } from '../../app.component';

import { AgmCoreModule, MapsAPILoader, NoOpMapsAPILoader } from "angular2-google-maps/core";
import { CoolLocalStorage } from 'angular2-cool-storage';

let Dropzone = require('../../../../node_modules/dropzone/dist/min/dropzone-amd-module.min.js');

declare var jQuery: any;

@Component({
	providers: [
		PropertyService,
		ProfileService,
		UploadPictureService,
		Ng2ImgToolsService,
		Ng2ImgMaxService,
		CommonAppService,
		CoolLocalStorage,
		DatepickerModule
	],
	styleUrls: ['./manage-property.component.css'],
	templateUrl: './manage-property.component.html'
})

export class ManagePropertyComponent implements OnInit, AfterViewInit, OnDestroy {

	public listBoxers: Array<string> = ['Sugar Ray Robinson', 'Muhammad Ali', 'George Foreman', 'Joe Frazier', 'Jake LaMotta', 'Joe Louis', 'Jack Dempsey', 'Rocky Marciano', 'Mike Tyson', 'Oscar De La Hoya'];

	listTeamOne: Array<string> = [];
    listTeamTwo: Array<string> = [];
	@Output() filesUploading: EventEmitter<File[]> = new EventEmitter<File[]>();

	public property: Property;
	currentUser: any;
	localStorage: CoolLocalStorage;

	public loading: boolean = false;
	public isEdit: boolean = false;
	public loadingBtnSpinner: string = "<span>Upload</span>";
	public returnUrl: string;
	public propertyId: string;
	public isValidPropertyType: boolean = true;
	public isValidBed: boolean = true;
	public isValidImages: boolean = true;
	public validImageTypeCount = 0;
	public isValidAddress: boolean = true;
	public isValidEmail: boolean = true;
	public isValidPhone: boolean = true;
	public isCalendarMouseHover: boolean = false;
	public imageUploadingFlag = false;
	public htmlDescription: any = "";

	public dropzone: any;
	public dropzoneUploadedFiles: any[] = [];
	public dropzoneUploadedFilesQueue: any[] = [];
	public uploadedFiles: any[] = [];
	public selectedPropertyType: string = "";
	public selectedAgreement: string = "";
	public selectedEmailOnly: boolean = false;
	public selectedPhoneOnly: boolean = false;

	public isActive: boolean = true;
	public isActiveValue: string = 'No';
	public isImmediateAvailable: boolean = false;
	public isAvailableDateChanged: boolean = false;
	public isReload: any = "false";

	@ViewChild('isActiveToggle') isActiveToggle: ElementRef;

	public latitude: number;
	public longitude: number;
	public markerLatitude: number;
	public markerLongitude: number;
	public address: string;
	public searchControl: FormControl;
	public zoom: number;

	@ViewChild("Address")
	public searchElementRef: ElementRef;

	// @ViewChild("dropzone-drop-area")
	// public dropzoneElementRef: ElementRef;

	/*---- Datetime picker ----*/
	public placeholder = "Date";
	public myDatePickerOptions: IMyOptions = {
		// other options...
		dateFormat: 'yyyy-mm-dd',
		showTodayBtn: false,
	};

	public visible = false;
	public visibleAnimate = false;
	public visibleUploading = false;
	public visibleUploadingAnimate = false;
	public showOnMap = false;
	public showOnMapText = 'Show on map';

	public DateAvailable: Object = {};

	public popoverActiveInactiveHtml = "Activation is FREE! <br><br>ACTIVE: Shows your listing to tenants. <br><br> INACTIVE: Hides your listing from tenants, and saves it to your dashboard for future use. IE. Next time unit is vacant.";

	public popoverMapHtml = "Wrong address showing? Move the pin to correct location.";
	public elementRef: ElementRef;

	constructor(
		public route: ActivatedRoute,
		public router: Router,
		public commonAppService: CommonAppService,
		public propertyService: PropertyService,
		public uploadPictureService: UploadPictureService,
		public profileService: ProfileService,
		public renderer: Renderer,
		public mapsAPILoader: MapsAPILoader,
		public ng2ImgToolsService: Ng2ImgMaxService,
		public ngZone: NgZone,
		localStorage: CoolLocalStorage,
		@Inject(ElementRef) elementRef: ElementRef) {
		this.localStorage = localStorage;
		this.elementRef = elementRef;

	}

	public counter = 0;

	ngOnInit() {
		let THIS = this;
		THIS.propertyId = THIS.route.snapshot.params['id'];
		THIS.currentUser = this.localStorage.getObject('currentUser');
		if(THIS.commonAppService.isUndefined(THIS.currentUser)){
			window.location.href = '/';
			return;
		}
		THIS.initProperty();
		THIS.route.params.subscribe(params => {
			THIS.isReload = params['Reload'];
		});
		this.profileService.getProfileById(this.currentUser.Id)
			.subscribe((userDetails: any) => {
				if (userDetails && userDetails.Company != '') {
					this.property.OwnerName = userDetails.FirstName;
					this.property.Phone = userDetails.Contact;
					this.property.LandlordType = userDetails.LandlordType;
				}
			},
			(error: any) => {
				console.log(' Error while getProfileById : ' + JSON.stringify(error));
			});
		if (typeof (this.propertyId) != "undefined" && this.propertyId != "new") {

			this.isEdit = true;
			this.loadingBtnSpinner = '<span> Save</span>';
			this.loading = true;
			this.propertyService.getProperyById(this.propertyId)
				.subscribe((data: any) => {
					THIS.property = Object.assign({}, data);
					console.log('THIS.property ' + JSON.stringify(THIS.property));
					if(THIS.commonAppService.isUndefined(this.property) || THIS.property.UserId != THIS.currentUser.Id){
						window.location.href = '/';
						return;
					}
					
					this.initPictures(this.property.Pictures);
					this.selectedPropertyType = this.property.PropertyType;

					$('.customeText .PropertyType').val((this.property.PropertyType == 'Apartment' || this.property.PropertyType == 'House' || this.property.PropertyType == 'Room') ? "" : this.property.PropertyType);

					$('.customeText .Bed').val((this.property.Bed == 'Studio' || this.property.Bed == '1' || this.property.Bed == '2' || this.property.Bed == '3' || this.property.Bed == '4') ? "" : this.property.Bed);

					$('.customeText .Bath').val((this.property.Bath == '1' || this.property.Bath == '2' || this.property.Bath == '3') ? "" : this.property.Bath);

					$.each(this.property.Pet, function (i, val) {
						$("input[name=Pet][data-val='" + val + "']").prop('checked', true);
					});

					$('.customeText .AgreementTermLength').val((this.property.AgreementTermLength == '12' || this.property.AgreementTermLength == '6' ? "" : this.property.AgreementTermLength));

					this.selectedAgreement = this.property.AgreementType;
					this.selectedEmailOnly = this.property.IsEmailOnly;
					this.selectedPhoneOnly = this.property.IsPhoneOnly;
					this.property.UserId = this.currentUser.Id;
					if(this.property.Smoking != null){
						this.property.Smoking = (this.property.Smoking) ? "true" : "false";
					}
					
					this.htmlDescription = this.property.Description;

					this.setMapPosition({ 'latitude': this.property.Latitude, 'longitude': this.property.Longitude, 'address': this.property.Address });

					this.isActive = this.property.IsActive;
					// if (this.property.IsActive == true) {

					// 	let event = new MouseEvent('click', { bubbles: true });
					// 	this.renderer.invokeElementMethod(this.isActiveToggle.nativeElement, 'dispatchEvent', [event]);
					// 	this.changeIsActive();
					// }

					if (this.property.DateAvailable != null && this.property.DateAvailable != '') {
						let date = new Date(this.commonAppService.getDateByTimestamp(this.property.DateAvailable));
						//this.changeIsImmediateAvailable();
						//this.property.DateAvailable = this.commonAppService.getFormattedDate(new Date(this.property.DateAvailable));

						this.DateAvailable = { date: { year: date.getFullYear(), month: (date.getMonth() + 1), day: (date.getDate()) } };
					}

					if (this.commonAppService.isUndefined(this.property.RentInclude)) {
						this.property.RentInclude = [];
					}

					if (this.commonAppService.isUndefined(this.property.Amenities)) {
						this.property.Amenities = [];
					}
					this.loading = false;
					
				},
				(error: any) => {
					console.log(' Error while getProperyById : ' + JSON.stringify(error));
					this.loading = false;
				});
			// } else {

			// }
		} else {

			this.isEdit = false;
			this.loadingBtnSpinner = '<span> Upload</span>';
			this.initProperty();
			// let event = new MouseEvent('click', { bubbles: true });
			// this.renderer.invokeElementMethod(this.isActiveToggle.nativeElement, 'dispatchEvent', [event]);
			// this.changeIsActive();

			//this.dropzone.emit("resetFiles");
			this.dropzoneUploadedFiles = [];
			$('.dropzone-drop-area .dz-preview').remove();

			this.address = "";
			let visitorLocationDetails: any;
			// this.commonAppService.getVisitorLocationDetails(function (details){
			//     visitorLocationDetails = details;
			//     console.log('visitorLocationDetails ' + JSON.stringify(visitorLocationDetails));  
			//     console.log('city ' + JSON.stringify(visitorLocationDetails.city));  
			//     if(visitorLocationDetails){
			//         THIS.latitude = visitorLocationDetails.lat;
			//         THIS.longitude = visitorLocationDetails.lon;
			//     } else {
			//         THIS.latitude = 49.895136;
			//         THIS.longitude = -97.13837439999998;
			//     }
			// });
			this.zoom = 9;
			// this.latitude = 49.895136;
			// this.longitude = -97.13837439999998;
		}
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
		//});

		//set google maps defaults
		this.zoom = 9;
		this.latitude = 49.895136;
		this.longitude = -97.13837439999998;

		//create search FormControl
		this.searchControl = new FormControl();

		//load Places Autocomplete
		this.mapsAPILoader.load().then(() => {

			let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
				types: ["address"],
				componentRestrictions: {
					country: "ca"
				}
			});

			autocomplete.addListener("place_changed", () => {
				this.ngZone.run(() => {
					//get the place result
					let place: google.maps.places.PlaceResult = autocomplete.getPlace();
					this.address = this.commonAppService.getFormattedAddress(place);

					//verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}

					//set latitude, longitude and zoom
					this.latitude = this.markerLatitude = place.geometry.location.lat();
					this.longitude = this.markerLongitude = place.geometry.location.lng();

					console.log(' place.geometry ' + JSON.stringify(place.geometry));
					console.log(' this.address ' + JSON.stringify(this.address));
					if (place.geometry) {
						this.property.Latitude = this.latitude.toString();
						this.property.Longitude = this.longitude.toString();
					}
					this.zoom = 14;
					this.isValidAddress = true;
					this.property.Address = this.address;
				});
			});
		});

		if(THIS.imageUploadingFlag == false){
			jQuery(this.elementRef.nativeElement).find('.fileup-btn').sortable({
				items: '.fileup-file',
				cursor: 'move',
				opacity: 0.5,
				containment: '#dropzoneFileUpload',
				distance: 20,
				tolerance: 'pointer',
				stop: function () {

					THIS.dropzoneUploadedFilesQueue = [];
					$('#dropzoneFileUpload .fileup-btn .fileup-file').each(function (count, el) {           
						let Name = el.getAttribute('id');
						console.log(' Name ' + Name + ' count ' + count);
						THIS.uploadedFiles.forEach(function(file, index) {
							let initFileName = 'file-upload-image-' + (index) + '-init';
							console.log(' file ' + JSON.stringify(file.Id) + ' | ' + initFileName);
							if (file.Id === Name || initFileName == Name) {
								file.Index = count + 1;
								THIS.dropzoneUploadedFilesQueue.push(file);
							} 
						});
					});
					console.log(' THIS.dropzoneUploadedFilesQueue ' + JSON.stringify(THIS.dropzoneUploadedFilesQueue));
				}
			});
		}

		THIS.counter = 0;

		jQuery.fileup({
			url: 'https://maprentalsapiqa.azurewebsites.net/api/Picture/Upload',
			inputID: 'upload-image',
			queueID: 'upload-image-queue',
			extraFields: {'height': 100, 'width': 100},
			autostart: false,
			onStart: function(file_number, file) {
				
			},
			onSelect: function(file) {
				// console.info(' file.size ' + JSON.stringify(file.size * 1000));
				let loadingButton = "<button type='button' class='uploadingBtnSpinner'><i class='glyphicon glyphicon-refresh glyphicon-refresh-animate cursor-pointer'></i><button>";
				THIS.imageUploadingFlag = true;
				
				THIS.addImageLoader(THIS.counter);

				THIS.uploadPictureWithResize(file, THIS.counter, function(err, data){
					console.log('err' + JSON.stringify(err) + ' data ' + data);
				});
				
				THIS.counter++;
            },
			onSuccess: function(response, file_number, file) {
				console.log('onSuccess' + JSON.stringify(response) + ' file_number ' + file_number);
				
			},
			onError: function(event, file, file_number) {
				console.log('onError');
			},
			onRemove: function(file_number, total, file) {
				console.log('onRemove' + JSON.stringify(file_number) + ' total ' + total);
				THIS.removeImageFromList(file_number.file_number);
			}
		});

		$(document).on('click', 'span.remove-image', function () {
           jQuery('#file-upload-' + this.id + '-init').remove();
		   THIS.removeImageFromListById(this.id);
        });
		
	}

	public fileChange(event: any){
		if(event.currentFiles.length>0){
		this.processFile(event.currentFiles[0]);
		}
	}

	private processFile(file:File){
      this.resizeImage(file);
  	}

	private resizeImage(file:File){
		console.info("Starting resize for file:", file);
			this.ng2ImgToolsService.resize([file], 1500, 800).subscribe( result =>{
				console.log("Resize result:", result);
				//all good
			}, error => {
					console.error("Resize error:", error);
			}
		);
	}

	public uploadPictureWithResize(file, counter, callback){
		let THIS = this;

		THIS.ng2ImgToolsService.resizeImage(file, 1500, 800).subscribe((result) => {		

			THIS.uploadPictureService.uploadPicture(result)
			.subscribe((data: any) => {
				console.log(' Upload File : ' + JSON.stringify(data));
				
				let bodyJSON = data[0];
				let uploadImageObject = {
					"Id": 'file-upload-image-' + (counter),
					"PropertyId": 0,
					"Index": (counter+1),
					"Name": bodyJSON.name,
					"Url": bodyJSON.url,
					"ThumbnailUrl": bodyJSON.thumbUrl
				}
				THIS.uploadedFiles.push(uploadImageObject);
				THIS.removeImageLoader(counter);
				THIS.checkUploadingFlag();
				callback(null, true);
			},
			(error: any) => {
				console.log(' error ' + JSON.stringify(error));
				callback(error, false);
			});
		});
	}

	public getResizeImage(file: any, callback){
		let THIS = this;

		THIS.ng2ImgToolsService.resize([file], 1200, 700).subscribe((result) => {
			callback(null, result);
		},
		(error: any) => {
			alert(' ng2ImgToolsService ' + JSON.stringify(error));
			var img = document.createElement('img');

			img.onload = function(){
				console.log(img.width);
			}

			img.src = file.url;
			callback(error, img);
			// callback(error, false);
		});
	}


	public compress(source_img_obj, quality, maxWidth, output_format, callback){
		
		var mime_type = "image/jpeg";
		if(typeof output_format !== "undefined" && output_format=="png"){
			mime_type = "image/png";
		}
		
		maxWidth = maxWidth || 1000;
		var natW = source_img_obj.naturalWidth;
		var natH = source_img_obj.naturalHeight;
		var ratio = natH / natW;
		if (natW > maxWidth) {
			natW = maxWidth;
			natH = ratio * maxWidth;
		}
		
		var cvs = document.createElement('canvas');
		cvs.width = natW;
		cvs.height = natH;
		
		console.log('quality ' + quality);
		// var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0, natW, natH);
		
		var newImageData = cvs.toDataURL(mime_type, quality/100);
		var result_image_obj = new Image();
		
		result_image_obj.src = newImageData;
		console.log('result_image_obj ' + result_image_obj);
		callback(null, result_image_obj);
	}

	public resizeImageToSpecificWidth(wantedWidth, wantedHeight, datas, callback) {
			// We create an image to receive the Data URI
			var img = document.createElement('img');

			// When the event "onload" is triggered we can resize the image.
			img.onload = function()
				{        
					// We create a canvas and get its context.
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');

					// We set the dimensions at the wanted size.
					canvas.width = wantedWidth;
					canvas.height = wantedHeight;

					// We resize the image with the canvas method drawImage();
					ctx.drawImage(canvas, 0, 0, wantedWidth, wantedHeight);

					var dataURI = canvas.toDataURL();

					/////////////////////////////////////////
					// Use and treat your Data URI here !! //
					/////////////////////////////////////////
				};

			// We put the Data URI in the image's src attribute
			img.src = datas;
			
			callback(img);

			///------------------------------------------------------
			// // create an off-screen canvas
			// var canvas = document.createElement('canvas'),
			// 	ctx = canvas.getContext('2d');

			// // set its dimension to target size
			// canvas.width = wantedWidth;
			// canvas.height = wantedHeight;
			

			// // draw source image into the off-screen canvas:
			// //ctx.drawImage(datas, 0, 0, wantedWidth, wantedHeight);
			// console.log('wantedHeight' + wantedHeight);

			// var img = new Image;

			// img.src = canvas.toDataURL();

			///----------------------------------------------------------------------
			// // encode image to data-uri with base64 version of compressed image
			// callback(img);
			
			// var reader = new FileReader();
			// // reader.onload = function(event) {
			// var img = new Image();
			// //img.onload = function() {
			// 	console.log('width ' + width + ' img.width ' +img.width);
			// 	if (img.width > width) {
			// 		var oc = document.createElement('canvas'), octx = oc.getContext('2d');
			// 		oc.width = img.width;
			// 		oc.height = img.height;
			// 		octx.drawImage(img, 0, 0);
			// 		while (oc.width * 0.5 > width) {
			// 			oc.width *= 0.5;
			// 			oc.height *= 0.5;
			// 			octx.drawImage(oc, 0, 0, oc.width, oc.height);
			// 		}
			// 		oc.width = width;
			// 		oc.height = oc.width * img.height / img.width;

			// 		octx.drawImage(img, 0, 0, oc.width, oc.height);
			// 		// document.getElementById('great-image').src = oc.toDataURL();
			// 		callback(oc.toDataURL());
			// 	} else {
			// 		// document.getElementById('small-image').src = img.src;
			// 		callback(img);
			// 	}
	}
	

	public removeImageFromList(counter){
		let THIS = this;
		THIS.uploadedFiles.forEach(function(file, index) {
			if (file.Index == counter) {
				THIS.uploadedFiles.splice(THIS.uploadedFiles.indexOf(file), 1);
			} 
		});
	}

	public removeImageFromListById(Id: any){
		let THIS = this;
		THIS.uploadedFiles.forEach(function(file, index) {
			let initImageId = (Id.substr(Id.length - 1)) + '-init';
			console.log(' file ' + JSON.stringify(file.Id) + 'initImageId ' + initImageId);
			if (file.Id == initImageId) {
				THIS.uploadedFiles.splice(THIS.uploadedFiles.indexOf(file), 1);
			} 
		});
		console.log(' THIS.uploadedFiles ' + JSON.stringify(THIS.uploadedFiles));
	}

	public addImageLoader(id: any){
		let imageDivId = "#file-upload-image-" + id;

		setTimeout(function() {
			jQuery(imageDivId).append("<button type='button' class='uploadingBtnSpinner'><i class='glyphicon glyphicon-refresh glyphicon-refresh-animate cursor-pointer'></i></button>");
			jQuery(imageDivId + ' .preview').addClass("opacity5");
		}, 1000);
	}

	public removeImageLoader(id: any){
		let imageDivId = "#file-upload-image-" + id;
		console.log(' imageDivId ' + imageDivId);
		setTimeout(function() {
			jQuery(imageDivId + ' .uploadingBtnSpinner').remove();
			jQuery(imageDivId + ' .preview').removeClass("opacity5");
		}, 1000);
	}

	public initPictures(Pictures: any[]) {
		let THIS = this;
		let _thisDropzoneFiles = this.dropzoneUploadedFiles;
		Pictures = this.commonAppService.getSortedPicturesList(Pictures);
		for (let index in Pictures) {
			let _thisPicture = Pictures[index];

			// let _thisDropzoneUploadedFiles: any[] = this.dropzoneUploadedFiles;
			// _thisDropzoneUploadedFiles.push({
			// 	"Id": _thisPicture.Id,
			// 	"PropertyId": _thisPicture.PropertyId,
			// 	"Name": _thisPicture.Name,
			// 	"Url": _thisPicture.Url,
			// 	"ThumbnailUrl": _thisPicture.thumbUrl
			// });

			THIS.uploadedFiles.push({
				"Id": index + '-init',
				"PropertyId": _thisPicture.PropertyId,
				"Name": _thisPicture.Name,
				"Url": _thisPicture.Url,
				"ThumbnailUrl": _thisPicture.ThumbnailUrl
			});

			let HTML = THIS.getDropImageHTML(_thisPicture, index);
			jQuery('#upload-image-queue').append(HTML);
		}
		console.log(' initPictures uploadedFiles ' + THIS.uploadedFiles);
	}

	public getDropImageHTML(item: any, index: any){
		let HTML = "<div id='file-upload-image-" + index + "-init' class='fileup-file image'>"+
				"<div class='preview'>"+
					"<img src='"+ item.ThumbnailUrl + "' alt=''>"+
				"</div>"+				
				"<div class='data'>"+
					"<div class='description'>"+
					"</div>"+
					"<div class='controls'>"+
						"<span class='remove remove-image' id='image-" + index + "' title='Remove'></span>"+
					"</div>"+
				"</div>"+
			"</div>";

		return HTML;				

	}

	public updateLocation(event: any) {
		let newLat = event.coords.lat;
		let newLng = event.coords.lng;
		let latlng = new google.maps.LatLng(newLat, newLng);
		let geocoder = new google.maps.Geocoder();
		let request = {
			latLng: latlng
		};

		this.latitude = this.property.Latitude = newLat;
		this.longitude = this.property.Longitude = newLng;
		this.zoom = 12;

		let __this = this;
		geocoder.geocode(request, function (results: any, status: any) {
			let newAddress = __this.commonAppService.getFormattedAddress(results[0]);
			__this.address = __this.property.Address = newAddress;
			this.isValidAddress = true;
			__this.setMapPosition({ 'latitude': newLat, 'longitude': newLng, 'address': newAddress });
		});
	}

	public setMapPosition(position: any) {
		console.log(' setMapPosition ' + JSON.stringify(position));
		this.latitude = this.property.Latitude = this.markerLatitude = position.latitude;
		this.longitude = this.property.Longitude = this.markerLongitude = position.longitude;
		this.address = this.property.Address = position.address;
		this.zoom = 14;
		if (position.address != '') {
			this.isValidAddress = true;
		}
	}

	public mapBoundsChanged(bounds: any) {
		//console.log(' mapBoundsChanged call ');
		// if(!this.commonAppService.isUndefined(bounds)){

		//     let center = bounds.getCenter();
		//     let lat = center.lat();
		//     let lng = center.lng();
		//     console.log(' mapBoundsChanged ' + lat + ' | ' + lng);

		// }
	}

	public mapIdle(bounds: any) {
		//console.log(' mapIdle call ');
		// if(!this.commonAppService.isUndefined(bounds)){
		//        let center = bounds.getCenter();
		//        let lat = center.lat();
		//        let lng = center.lng();
		//        console.log(' mapIdle ' + lat + ' | ' + lng);
		//    }
	}

	public mapCenterChanged(event: any) {
		//console.log(' mapCenterChanged call ');
	}

	public initProperty() {
		this.property = {
			"Id": 0,
			"UserId": this.currentUser.Id,
			"PropertyType": "",
			"Bed": "",
			"Bath": "",
			"Pet": [],
			"Smoking": "",
			"RentInclude": [],
			"Parking": "",
			"Amenities": [],
			"LandlordType": this.currentUser.LandlordType,
			"AgreementType": "",
			"IsImmediateAvailable": null,
			"DateAvailable": "",
			"DateListed": "",
			"AgreementTermLength": "",
			"OwnerName": this.currentUser.FirstName,
			"Phone": this.currentUser.Contact,
			"IsPhoneOnly": false,
			"Email": this.currentUser.Email,
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

	public changeCheckboxArray(element: any, flag: boolean, field: any) {
		let thisElementValue = element.value;
		if (field == 'Pet') {
			let THIS = this;
			$('input[name="Pet"]').each(function () {
				let thisPetValue = $(this).val();
				if (flag && thisElementValue == 'No' && thisElementValue != thisPetValue) {
					$("input[name=Pet][data-val='Cats']").prop('checked', false);
					$("input[name=Pet][data-val='Dogs']").prop('checked', false);
					$("input[name=Pet][data-val='Any']").prop('checked', false);


					THIS.property[field].splice(THIS.property[field].indexOf('Cats'), 1);
					THIS.property[field].splice(THIS.property[field].indexOf('Dogs'), 1);
					THIS.property[field].splice(THIS.property[field].indexOf('Any'), 1);

					if (THIS.property[field].indexOf('No') <= -1) {
						THIS.property[field].push('No');
					}

				} else if (flag && thisElementValue == 'Any' && thisElementValue != thisPetValue) {
					$("input[name=Pet][data-val='Cats']").prop('checked', false);
					$("input[name=Pet][data-val='Dogs']").prop('checked', false);
					$("input[name=Pet][data-val='No']").prop('checked', false);
					THIS.property[field].splice(THIS.property[field].indexOf('Cats'), 1);
					THIS.property[field].splice(THIS.property[field].indexOf('Dogs'), 1);
					THIS.property[field].splice(THIS.property[field].indexOf('No'), 1);
					if (THIS.property[field].indexOf('Any') <= -1) {
						THIS.property[field].push('Any');
					}

				} else if (flag && (thisElementValue == 'Cats' || thisElementValue == 'Dogs')) {
					$("input[name=Pet][data-val='No']").prop('checked', false);
					$("input[name=Pet][data-val='Any']").prop('checked', false);

					if (THIS.property[field].indexOf('No') != -1) {
						THIS.property[field].splice(THIS.property[field].indexOf('No'), 1);
					}
					if (THIS.property[field].indexOf('Any') != -1) {
						THIS.property[field].splice(THIS.property[field].indexOf('Any'), 1);
					}

					if (thisElementValue == 'Cats' && THIS.property[field].indexOf('Cats') == -1) {
						THIS.property[field].push('Cats');
					}
					if (thisElementValue == 'Dogs' && THIS.property[field].indexOf('Dogs') == -1) {
						THIS.property[field].push('Dogs');
					}

				} else if (!flag && thisPetValue == thisElementValue) {
					console.log(' THIS.property[field].indexOf(thisPetValue) ' + THIS.property[field].indexOf(thisPetValue));
					THIS.property[field].splice(THIS.property[field].indexOf(thisPetValue), 1);
				}
			});
			console.log(' this.property[field] ' + this.property[field]);

		} else {
			if (!flag) {
				this.property[field].splice(this.property[field].indexOf(thisElementValue), 1);
			} else if (this.property[field].indexOf(element.value) <= -1) {
				this.property[field].push(thisElementValue);
			}
		}
	}

	public changeCheckboxString(element: any, flag: boolean, field: any) {
		$("." + field).not($(this)).prop("checked", false);
		let thisElementValue = element.value;
		if (!flag) {
			this.property[field] = "";
			if (field == 'PropertyType') {
				this.isValidPropertyType = false;
			} else if (field == 'Bed') {
				this.isValidBed = false;
			}
		} else {
			this.property[field] = thisElementValue;
			if (field == 'PropertyType') {
				this.isValidPropertyType = true;
			} else if (field == 'Bed') {
				this.isValidBed = true;
			}
		}
		$('.customeText > .' + field).val("");
		console.log(' field ' + field);
		console.log(' this.property[field] ' + this.property[field]);
	}

	public updateCustomInputField(event: any, field: any) {
		$("." + field).prop("checked", false);

		if (field == 'PropertyType') {
			if (event.target.value != '') {
				this.property[field] = event.target.value;
				this.isValidPropertyType = true;
			} else {
				this.property[field] = "";
				this.isValidPropertyType = false;
			}
		} else if (field == 'Bed') {
			if (event.target.value != '') {
				this.property[field] = event.target.value;
				this.isValidPropertyType = true;
			} else {
				this.property[field] = "";
				this.isValidBed = false;
			}
		} else {
			if (event.target.value != '') {
				this.property[field] = event.target.value;
			} else {
				this.property[field] = "";
			}
		}
	}

	public changeIsActive() {
		this.isActive = !this.isActive;
		this.isActiveValue = (this.isActive) ? 'Yes' : 'No';
		this.property.IsActive = this.isActive;
	}

	public changeIsImmediateAvailable() {
		if (!this.commonAppService.isUndefined(this.property.IsImmediateAvailable)) {
			this.property.IsImmediateAvailable = !this.property.IsImmediateAvailable;
		}

		//if(this.property.IsImmediateAvailable == true){
		$('#DateAvailable').val("");
		this.property.DateAvailable = "";
		this.DateAvailable = "";
		//}

		console.log(' this.property.DateAvailable ' + this.property.DateAvailable);
	}

	public propAvailableDateChange(event: IMyDateModel) {
		let selectedDate = ((event.jsdate != null) ? event.jsdate.toString() : "");
		this.property.IsImmediateAvailable = (selectedDate != '') ? false : true;
		this.property.DateAvailable = (selectedDate != '') ? new Date(selectedDate).toString() : "";
		this.isAvailableDateChanged = true;
	}

	public updateDescription(event: any) {
		this.htmlDescription = event.target.value.replace(/\n/g, '<br>');
	}

	public updateAddress(event: any) {
		if (event.target.value == '') {
			this.setMapPosition({ 'latitude': 49.895136, 'longitude': -97.13837439999998, 'address': '' });
			this.isValidAddress = false;
		}
	}

	public updatePhone(event: any) {
		this.property.Phone = event.target.value;

		if (event.target.value == '') {
			this.isValidPhone = false;
		} else {
			this.isValidPhone = true;
		}
		console.log(' updatePhone event.target.value ' + event.target.value);
	}

	public updateEmail(event: any) {
		this.property.Email = event.target.value;
		let pattern = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";

		if (event.target.value == '' || !event.target.value.match(pattern)) {
			this.isValidEmail = false;
		} else {
			this.isValidEmail = true;
		}
	}

	public manageProperty(event: any, model: Property, isValidForm: boolean) {
		event.preventDefault();
		console.log('model,  ' + JSON.stringify(model) + '  isValidForm ' + isValidForm);
		console.log('this.property ' + JSON.stringify(this.property));

		let THIS = this;
		//this.property.Smoking = (this.property.Smoking == "true")? "true": "false";

		this.property.Bed = (this.property.PropertyType == 'Room') ? '' : this.property.Bed;

		this.property.AgreementTermLength = (this.property.AgreementType == 'Month-to-Month') ? '' : this.property.AgreementTermLength;

		this.property.Email = (model.IsPhoneOnly == true) ? '' : this.property.Email;
		this.property.Phone = (model.IsEmailOnly == true) ? '' : this.property.Phone;

		if (this.property.PropertyType == '') {
			this.isValidPropertyType = false;
			$('.validation-modal-body').append('<p class="text-danger"> * Property Type</p>');
			isValidForm = false;
		}

		if (this.property.PropertyType != 'Room' && this.property.Bed == '') {
			this.isValidBed = false;
			$('.validation-modal-body').append('<p class="text-danger"> * Bedrooms</p>');
			isValidForm = false;
		}

		if (this.property.Address == '') {
			this.isValidAddress = false;
			$('.validation-modal-body').append('<p class="text-danger"> * Address</p>');
			isValidForm = false;
		}

		if (model.MonthlyRent == '') {
			$('.validation-modal-body').append('<p class="text-danger"> * Monthly Rent</p>');
			isValidForm = false;
		}

		if (model.Title == '') {
			$('.validation-modal-body').append('<p class="text-danger"> * Listing Title</p>');
			isValidForm = false;
		}

		if (model.Phone == '' && model.IsPhoneOnly) {
			this.isValidPhone = false;
			$('.validation-modal-body').append('<p class="text-danger"> * Phone</p>');
			isValidForm = false;
		}

		if ((model.Email == '' && model.IsEmailOnly)) {
			this.isValidEmail = false;
			$('.validation-modal-body').append('<p class="text-danger"> * Email</p>');
			isValidForm = false;
		}

		if (this.property.DateAvailable) {
			this.property.IsImmediateAvailable = false;
		}
		this.property.Description = this.htmlDescription;

		// if(this.dropzoneUploadedFilesQueue.length != 0 && this.dropzoneUploadedFilesQueue.length == this.dropzoneUploadedFiles.length){
		// 	this.dropzoneUploadedFiles = this.dropzoneUploadedFilesQueue;
		// } else {
		// 	$('#dropzoneFileUpload .dropzone-drop-area .dz-preview').each(function (count, el) {           
		// 		let Name = el.getAttribute('id');
		// 		console.log(' Name ' + Name + ' count ' + count);
		// 		THIS.dropzoneUploadedFiles.forEach(function(file, index) {
		// 			console.log(' file ' + JSON.stringify(file) + 'index ' + index);
		// 			if (file.Name === Name) {
		// 				THIS.dropzoneUploadedFiles[index].Index = count + 1;
		// 			} 
		// 		});
		// 	});
		// }

		if(this.dropzoneUploadedFilesQueue.length != 0 && this.dropzoneUploadedFilesQueue.length == this.uploadedFiles.length){
			this.uploadedFiles = this.dropzoneUploadedFilesQueue;
		} else {
			$('#dropzoneFileUpload .dropzone-drop-area .dz-preview').each(function (count, el) {           
				let Name = el.getAttribute('id');
				console.log(' Name ' + Name + ' count ' + count);
				THIS.uploadedFiles.forEach(function(file, index) {
					if (file.Id === Name) {
						THIS.uploadedFiles[index].Index = count + 1;
					} 
				});
			});
		}

		// delete this.property['Pictures'];
		// this.property.Pictures = this.dropzoneUploadedFiles;

		delete this.property['Pictures'];
		this.property.Pictures = this.uploadedFiles;

		if (!isValidForm) {
			this.openModal();
		}
		if (isValidForm) {
			let finalObject = {};

			for (let attrname in this.property) {
				finalObject[attrname] = this.property[attrname];
			}

			for (let attrname in model) {
				if (attrname != 'RentInclude' && attrname != 'Amenities' && attrname != 'DateAvailable') {
					finalObject[attrname] = model[attrname];
				}
			}

			if (model.IsImmediateAvailable == false && this.property.DateAvailable != '' && (this.isEdit == false || this.isAvailableDateChanged == true)) {
				let dt = new Date(finalObject['DateAvailable']);
				finalObject['DateAvailable'] = new Date(dt).getTime().toString();
				this.isAvailableDateChanged == false;
				//finalObject['DateAvailable'] = this.commonAppService.getFormattedDate(new Date(finalObject['DateAvailable']).toUTCString());		
			}

			console.log(' finalObject ' + JSON.stringify(finalObject) + ' \n this.isEdit ' + this.isEdit);
			this.loading = true;

			if (this.isEdit == true) {
				this.loadingBtnSpinner = "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> <span> Save</span>";
				this.propertyService.updateProperty(finalObject)
					.subscribe((data: any) => {
						this.loading = false;
						console.log(' data ' + JSON.stringify(data));
						window.location.href = this.commonAppService.getPropertyDetailsUrl(this.property.Address, this.property.PropertyType, this.property.Title, this.property.Id);
					},
					(error: any) => {
						this.loading = false;
						console.log(' Error while updateProperty : ' + JSON.stringify(error));
					});
			} else if (this.isEdit == false) {
				let dt = (new Date().toUTCString());
				finalObject['DateListed'] = new Date(dt).getTime();
				this.loadingBtnSpinner = "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> <span> Upload</span>";
				this.propertyService.addProperty(finalObject)
					.subscribe((data: any) => {
						this.loading = false;
						console.log(' data ' + JSON.stringify(data));
						window.location.href = this.commonAppService.getPropertyDetailsUrl(this.property.Address, this.property.PropertyType, this.property.Title, data.Response);
					},
					(error: any) => {
						this.loading = false;
						console.log(' Error while addProperty : ' + JSON.stringify(error));
					});
			}
		}
	}

	public mergeObjects(obj1: any, obj2: any, callback: any) {
		var obj3 = {};
		for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
		for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
		callback(obj3);
	}

	get fileDropped(): boolean {
		if (this.dropzone) {
			return this.dropzone.files.length > 0;
		}
		return false;
	}

	public ngAfterViewInit() {
		let THIS = this;
		if (this.isReload == "true") {
			console.log(' this.isReload ' + this.isReload);
			window.location.href = "/manageProperty/new";
			//window.location.reload();
			//return;
		}
	}

	ngOnDestroy() {
		this.dropzone.disable();
	}

	public checkUploadingFlag(){
		let isUploading = $('.fileup-btn').find('button.uploadingBtnSpinner').length;
		console.log(' isUploading ' + isUploading);
		if(isUploading == 0){
			this.imageUploadingFlag = false;
			// this.hideUploadingModal();
		}
	}

	public isNumberKey(event: any) {
		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(event.charCode);
		if (!pattern.test(inputChar)) {
			event.preventDefault();
		}
	}

	public closeCalendar(event: any) {
		setTimeout(() => {
			console.log('this.isCalendarMouseHover3 ' + this.isCalendarMouseHover);
			if (this.isCalendarMouseHover == false) {
				//$('div.selectorarrow').parent().remove();
			}
		}, 1000);
	}

	public openModal() {
		this.visible = true;
		setTimeout(() => this.visibleAnimate = true);
	}

	public hideModal(): void {
		$('.validation-modal-body p').remove();
		$('.validation-modal-body').append('<p>The following required fields were left blank</p>');

		this.visibleAnimate = false;
		setTimeout(() => this.visible = false, 300);
	}

	public toggleMap(){
		this.showOnMapText = (this.showOnMap == false)? "Hide map": "Show on map";
		this.showOnMap = !this.showOnMap;
		setTimeout(function(){
			window.dispatchEvent(new Event("resize"));
		}, 1);
	}


	public openUploadingModal() {
		this.visibleUploading = true;
		setTimeout(() => this.visibleUploadingAnimate = true);
	}

	public hideUploadingModal(): void {
		$('.validation-modal-body p').remove();
		$('.validation-modal-body').append('<p>The following required fields were left blank</p>');

		this.visibleUploadingAnimate = false;
		setTimeout(() => this.visibleUploading = false, 300);
	}
}
