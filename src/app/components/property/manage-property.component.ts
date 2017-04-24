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
	public isValidAddress: boolean = true;
	public isValidEmail: boolean = true;
	public isValidPhone: boolean = true;
	public isCalendarMouseHover: boolean = false;
	public imageUploadingFlag = false;
	public htmlDescription: any = "";

	public dropzone: any;
	public dropzoneUploadedFiles: any[] = [];
	public dropzoneUploadedFilesQueue: any[] = [];
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

	/*---- Datetime picker ----*/
	public placeholder = "Date";
	public myDatePickerOptions: IMyOptions = {
		// other options...
		dateFormat: 'yyyy-mm-dd',
		showTodayBtn: false,
	};

	public visible = false;
	public visibleAnimate = false;

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
		public ng2ImgToolsService: Ng2ImgToolsService,
		public ngZone: NgZone,
		localStorage: CoolLocalStorage,
		@Inject(ElementRef) elementRef: ElementRef) {
		this.localStorage = localStorage;
		this.elementRef = elementRef;

	}

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
					if (this.property.IsActive == true) {

						let event = new MouseEvent('click', { bubbles: true });
						this.renderer.invokeElementMethod(this.isActiveToggle.nativeElement, 'dispatchEvent', [event]);
						this.changeIsActive();
					}

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
			let event = new MouseEvent('click', { bubbles: true });
			this.renderer.invokeElementMethod(this.isActiveToggle.nativeElement, 'dispatchEvent', [event]);
			this.changeIsActive();

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
			jQuery(this.elementRef.nativeElement).find('.dropzone-drop-area').sortable({
				items: '.dz-preview',
				cursor: 'move',
				opacity: 0.5,
				containment: '#dropzoneFileUpload',
				distance: 20,
				tolerance: 'pointer',
				stop: function () {

					THIS.dropzoneUploadedFilesQueue = [];
					$('#dropzoneFileUpload .dropzone-drop-area .dz-preview').each(function (count, el) {           
						let Name = el.getAttribute('id');
						console.log(' Name ' + Name + ' count ' + count);
						THIS.dropzoneUploadedFiles.forEach(function(file) {
							console.log(' file ' + JSON.stringify(file));
						if (file.Name === Name) {
								file.Index = count + 1;
								THIS.dropzoneUploadedFilesQueue.push(file);
						} 
						});
					});
					console.log(' THIS.dropzoneUploadedFilesQueue ' + JSON.stringify(THIS.dropzoneUploadedFilesQueue));
				}
			});
		}
	}

	public initPictures(Pictures: any[]) {
		let THIS = this;
		let _thisDropzoneFiles = this.dropzoneUploadedFiles;
		Pictures = this.commonAppService.getSortedPicturesList(Pictures);
		for (let index in Pictures) {
			let _thisPicture = Pictures[index];

			let _thisDropzone = this.dropzone;
			let _thisDropzoneUploadedFiles: any[] = this.dropzoneUploadedFiles;
			_thisDropzoneUploadedFiles.push({
				"Id": _thisPicture.Id,
				"PropertyId": _thisPicture.PropertyId,
				"Name": _thisPicture.Name,
				"Url": _thisPicture.Url
			});

			let mockFile: any = new File([], _thisPicture.Name);

			this.dropzone.options.addedfile.call(this.dropzone, mockFile);
			this.dropzone.options.thumbnail.call(this.dropzone, mockFile, _thisPicture.Url);
			this.dropzone.emit("complete", mockFile);
			let removeButton = Dropzone.createElement("<a href=\"#\" class='glyphicon glyphicon-remove cursor-pointer'></a>");
			removeButton.addEventListener("click", function (e: any) {
				e.preventDefault();
				e.stopPropagation();
				// this.parent().remove();
				_thisDropzone.removeFile(mockFile);

				for (let obj of _thisDropzoneUploadedFiles) {
					if (obj.Url == _thisPicture.Url) {
						_thisDropzoneUploadedFiles.splice(_thisDropzoneUploadedFiles.indexOf(obj), 1);
					}
				}
				console.log(' inner _thisDropzoneUploadedFiles ' + JSON.stringify(_thisDropzoneUploadedFiles));
				if(THIS.dropzoneUploadedFiles.length <= 0){
					THIS.isValidImages = false;
				}
			});
			mockFile.previewElement.appendChild(removeButton);
			mockFile.previewElement.id = _thisPicture.Name;
			this.dropzoneUploadedFiles = _thisDropzoneUploadedFiles;
		}
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

		if(this.dropzoneUploadedFilesQueue.length != 0 && this.dropzoneUploadedFilesQueue.length == this.dropzoneUploadedFiles.length){
			this.dropzoneUploadedFiles = this.dropzoneUploadedFilesQueue;
		} else {
			
			$('#dropzoneFileUpload .dropzone-drop-area .dz-preview').each(function (count, el) {           
				let Name = el.getAttribute('id');
				console.log(' Name ' + Name + ' count ' + count);
				THIS.dropzoneUploadedFiles.forEach(function(file, index) {
					console.log(' file ' + JSON.stringify(file) + 'index ' + index);
					if (file.Name === Name) {
						THIS.dropzoneUploadedFiles[index].Index = count + 1;
					} 
				});
			});
		}

		delete this.property['Pictures'];
		this.property.Pictures = this.dropzoneUploadedFiles;

		if (this.dropzoneUploadedFiles.length <= 0) {
			this.isValidImages = false;
			$('.validation-modal-body').append('<p class="text-danger"> * Pictures</p>');
			isValidForm = false;
		}

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
		this.dropzone = new Dropzone('div#dropzoneFileUpload', {
			url: (files: any) => {
				this.filesUploading.emit(files);
			},
			autoProcessQueue: false,
			uploadMultiple: true,
			parallelUploads: 20,
			hiddenInputContainer: '#dropzone-drop-area',
			dictDefaultMessage: "Click/Drag images here to upload",
			acceptedFiles: 'image/*',
			clickable: '#dropzone-drop-area',
			previewsContainer: '#dropzone-drop-area',
			previewTemplate: '<div class="dz-preview dz-file-preview"><div class="dz-details"><img data-dz-thumbnail/></div></div>'
		});
		this.dropzone.autoDiscover = true;

		this.dropzone.on('addedfile', (file: any) => {
			console.info(' ng2ImgToolsService file.size ' + JSON.stringify(file.size));
			THIS.imageUploadingFlag = true;
			THIS.ng2ImgToolsService.resize([file], 1200, 700).subscribe((result) => {
				if (typeof result.name !== 'undefined' && typeof result.size !== 'undefined' && typeof result.type !== 'undefined') {
					console.info(' result.name ' + JSON.stringify(result.name));
					let loadingButton = Dropzone.createElement("<button type='button' class='uploadingBtnSpinner'><i class='glyphicon glyphicon-refresh glyphicon-refresh-animate cursor-pointer'></i><button>");
					file.previewElement.appendChild(loadingButton);

					this.uploadPictureService.uploadPicture(result)
						.subscribe((data: any) => {
							console.log(' Upload File : ' + JSON.stringify(data));
							if (data[0].url && data[0].url != "") {
								this.dropzoneUploadedFiles.push({
									"Id": 0,
									"PropertyId": 0,
									"Name": data[0].name,
									"Url": data[0].url
								});
								file.Url = data[0].url;
								this.isValidImages = true;
								file.previewElement.id = data[0].name;
								console.log('this.dropzoneUploadedFiles2' + JSON.stringify(this.dropzoneUploadedFiles) + ' file.Url ' + file.Url);
								//dropzoneUploadedFiles.push(file);
								let removeButton = Dropzone.createElement("<a id='" + data[0].name + "' href=\"#\" class='glyphicon glyphicon-remove cursor-pointer'></a>");
								let _thisDropzone = this.dropzone;

								let mockFileUrl = file.Url;

								removeButton.addEventListener("click", function (e: any) {
									e.preventDefault();
									e.stopPropagation();
									_thisDropzone.removeFile(file);
									console.log('THIS.dropzoneUploadedFiles next' + JSON.stringify(THIS.dropzoneUploadedFiles));

									for (let obj of THIS.dropzoneUploadedFiles) {
										if (obj.Url == mockFileUrl) {
											THIS.dropzoneUploadedFiles.splice(this.dropzoneUploadedFiles.indexOf(obj), 1);
										}
									}

									console.log('THIS.dropzoneUploadedFiles one' + JSON.stringify(THIS.dropzoneUploadedFiles));

									THIS.dropzoneUploadedFiles = (typeof this.dropzoneUploadedFiles == 'undefined') ? [] : this.dropzoneUploadedFiles;
									console.log('THIS.dropzoneUploadedFiles' + JSON.stringify(THIS.dropzoneUploadedFiles));
									if(THIS.dropzoneUploadedFiles.length <= 0){
										THIS.isValidImages = false;
									}
								});
								file.previewElement.appendChild(removeButton);
								loadingButton.remove();
								THIS.checkUploadingFlag();
							}
						},
						(error: any) => {
							console.log(' error ' + JSON.stringify(error));
							this.loading = false;
						});
				} else {
					console.log(' Image compression error ' + result);
				}
			});

		}).on('resetFiles', function () {

			// if(this.files.length != 0){
			//     for(let i=0; i<this.files.length; i++){
			//         this.files[i].previewElement.remove();
			//     }
			//     this.files.length = 0;
			// }
		}).on('uploadprogress', function (file, progress) {
			console.log('progress' + progress);
		});

		$(document).on("mouseenter", "div.selectorarrow", function () {
			THIS.isCalendarMouseHover = true;
			//console.log(' THIS.isCalendarMouseHover1  ' + THIS.isCalendarMouseHover);
		});

		$(document).on("mouseleave", "div.selectorarrow", function () {
			THIS.isCalendarMouseHover = false;
			//$('div.selectorarrow').parent().remove();
			//console.log(' THIS.isCalendarMouseHover2  ' + THIS.isCalendarMouseHover);
		});


	}

	ngOnDestroy() {
		this.dropzone.disable();
	}

	public checkUploadingFlag(){
		let isUploading = $('#dropzoneFileUpload .dropzone-drop-area').find('.dz-preview button.uploadingBtnSpinner').length;
		if(isUploading == 0){
			this.imageUploadingFlag = false;
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
}
