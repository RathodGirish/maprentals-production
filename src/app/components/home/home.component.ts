/**
 * Home Page Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive} from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import {Observable} from 'rxjs/Rx';
import { MetadataService } from 'ng2-metadata';
import { DatepickerModule } from 'ng2-bootstrap/datepicker';
import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import { GoogleMapsAPIWrapper, MarkerManager, AgmCoreModule, MapsAPILoader, NoOpMapsAPILoader, MouseEvent, InfoWindowManager, SebmGoogleMap, SebmGoogleMapMarker, SebmGoogleMapInfoWindow  } from "angular2-google-maps/core";
import { RouteConfig, RouteParams, RouterLink, ROUTER_PROVIDERS, ROUTER_DIRECTIVES } from 'angular2/router';
import { Router, ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { GeneratedUrl } from 'angular2/src/router/rules/route_paths/route_path';

import { PropertyService, CommonAppService } from '../../services/index';

import { LoginModalComponent } from '../../components/popup-modals/loginModal.component';
import { GlobalVariable } from '../../services/static-variable';
import { AppComponent } from '../../app.component';
import { MapComponent }  from '../../components/map/map.component';
import { Multiselect } from '../../components/custom/multiselect/multiselect.component'; 
 
export var iconUrl: string="assets/public/img/pin-purple.png";

import * as $ from 'jquery';

@Component({
    providers: [
        PropertyService, 
        CommonAppService,
        SebmGoogleMap, 
        GoogleMapsAPIWrapper, 
        MarkerManager, 
        Multiselect, 
        MapComponent, 
        InfoWindowManager, 
        CoolLocalStorage, 
        DatepickerModule, 
        FormBuilder,
        Title
    ],
    styleUrls: [ './home.component.css' ],
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, AfterViewInit {
    localStorage: CoolLocalStorage; 
    public currentUser: any;
    public properties: any[] = [];
    public allFullProperties: any[] = [];
    public loading: boolean = false;

    public windowHeight: string;
    public windowWidth: string;
    public latitude: number = 49.895136;;
    public longitude: number = -97.13837439999998;
    public zoom: number = 5;

    removeMarker: SebmGoogleMapMarker;

    public _map: SebmGoogleMap = null;
    @Output('map') mapChanged: EventEmitter<SebmGoogleMap> = new EventEmitter<SebmGoogleMap>();
    set map(val){
        this._map = val;
        this.mapChanged.emit(val);
    }
    get map(){
        return this._map;
    }

    @ViewChild('infoWindowDiv') infoWindowDiv:ElementRef;

    public address: string;
    public searchControl: FormControl;
    
    public isBoundJustChanged: boolean = false;
    public isInfowindowOpen: string = 'No';
    public limitListingCount: number = 200;
    public markers: MarkerObject[] = [];
    public clusters: Cluster[] = [];
    previousMarkers: any[] = [];

    public currentIconUrl: string = iconUrl; 
    public resultCounter: number;
    public centerBounds: any;
    public currentBounds: any;

    @ViewChild('googleMap') googleMap:ElementRef;
    public googleMaps: any;

    @ViewChild("SearchTop")
    public searchElementRef: ElementRef;

    @ViewChild("homeContainer")
    public homeContainer:any;

    public mmap : any;

    public isOpenLoginModal : any = "false";

    /*------ filter -------------*/
    public propertyTypeItems: Observable<Array<any>>;
    public beds: Observable<Array<any>>;
    public _propertyTypeItems: Array<any>;
    public _beds: Array<any>;
    public _selectedItems: Array<any> = [];
    public watchedPropertyTypeItems: Array<any>;
    public watchedBedsItems: Array<any>;

    public moreFilterText: string = "More";
    public isMoreFilter: boolean = true;

    public filterQueryObject: FilterQueryObject;
    public storageFilters: any;
    public storageMap: any;

    public thisMarkersArray: any[] = [];

    /*---- Datetime picker ----*/
    public datePickerPlaceholder = "Available On";

    public myDatePickerOptions: IMyOptions = {
        // other options...
        dateFormat: 'dd-mm-yyyy',
        todayBtnTxt: "Immediately"
    };

    public popoverInfowindowHtml = "";

    public paramCityName: string = "";
    public paramPropertyType: string = "";

    /*--- Mobile view -----*/
    public isMapView: any = true;
    public toggleMapListViewText: string = "List";

    @ViewChild('AvailableDate') AvailableDate:ElementRef;

    public currentRouteUrl = "/";

    constructor(
        public route: ActivatedRoute,
        public title: Title,
        public metaDataService: MetadataService,
        public router: Router,
        public renderer: Renderer,
        public elementRef: ElementRef,
        public fb: FormBuilder,
        public propertyService: PropertyService,
        public commonAppService: CommonAppService,
        public _mapApiWrapper:GoogleMapsAPIWrapper,
        public _markerManager: MarkerManager, 
        public _infoWindowManager: InfoWindowManager,
        public _mapComponent: MapComponent,
        public mapsAPILoader: MapsAPILoader,
        public multiselect: Multiselect,
        public sebmGoogleMap: SebmGoogleMap,
        public ngZone: NgZone,
        localStorage: CoolLocalStorage
        ) { 

        let THIS = this;

        this.initFilterQueryObject();
        this.paramCityName = this.route.snapshot.params['city'];
        this.paramPropertyType = this.route.snapshot.params['propertyType'];

        this.paramPropertyType = this.commonAppService.getPropertyTypeFromParam(this.paramPropertyType);
        if(!this.commonAppService.isUndefined(this.paramPropertyType)){
            this.filterQueryObject.PropertyType.push(this.paramPropertyType);
        }

        this._beds = [];
        this._propertyTypeItems = [];

        this.beds = Observable.of(this._beds);
        this.beds.subscribe(res => { 
            this.watchedBedsItems = res; 
        });

        this.propertyTypeItems = Observable.of(this._propertyTypeItems);
        this.propertyTypeItems.subscribe(res => { this.watchedPropertyTypeItems = res; 
        });

        // this.localStorage = localStorage; 

        
        $(window).trigger('resize');

        localStorage = this.localStorage;
        // this.currentUser = localStorage.getObject('currentUser');
        this.loading = true;
        this.currentIconUrl = iconUrl;
        
        this.router.events.subscribe((url:any) => {
            THIS.currentRouteUrl = url;
            console.log(' THIS.currentRouteUrl ' + THIS.currentRouteUrl);
            THIS.title.setTitle(this.commonAppService.getTitleByUrl(THIS.currentRouteUrl));
            this.metaDataService.setTitle(this.commonAppService.getTitleByUrl(THIS.currentRouteUrl));
            this.metaDataService.setTag('description', this.commonAppService.getDescriptionByUrl(THIS.currentRouteUrl));
            this.metaDataService.setTag('og:description', this.commonAppService.getDescriptionByUrl(THIS.currentRouteUrl));
        });
        //this.metaDataService.setTag('description');
        
        
        this.route.params.subscribe(params => {
            this.isOpenLoginModal  = params['login'];

            if(this.isOpenLoginModal == "true" && this.commonAppService.isUndefined(this.currentUser)){
                setTimeout(() => {
                    document.getElementById('loginModalBtn').click();
                    
                }, 2000);
            }
        });
        // this.renderer.invokeElementMethod(this.homeContainer.nativeElement, 'resiz', []);
        
        // this.storageMap = this.localStorage.getObject('storageMap');
        // this.storageFilters = this.localStorage.getObject('storageFilters');
        
        if(!this.commonAppService.isUndefined(this.storageFilters)){
            console.log(' this.storageFilters ' + JSON.stringify(this.storageFilters));
            this.filterQueryObject = this.storageFilters;
            this.localStorage.removeItem('storageFilters');
            this.setFilterFromStorage(this.storageFilters);
        } else {
            if(this.commonAppService.isUndefined(this.storageFilters) || this.storageFilters.Bed.length <= 0){

                this._beds.push({ label: "Studio", value: "Studio"});
                this._beds.push({ label: "1", value: "1"});
                this._beds.push({ label: "2", value: "2"});
                this._beds.push({ label: "3", value: "3"});
                this._beds.push({ label: "4", value: "4"});
                this._beds.push({ label: "5+", value: "5+"});
            }

            if(this.commonAppService.isUndefined(this.storageFilters) || this.storageFilters.PropertyType.length <= 0){
                if(this.paramPropertyType == 'Apartment'){
                    this._propertyTypeItems.push({ label: "Apartment", value: "Apartment", selected: true, checked: true});
                } else {
                    this._propertyTypeItems.push({ label: "Apartment", value: "Apartment"});
                }

                if(this.paramPropertyType == 'House'){
                    this._propertyTypeItems.push({ label: "House", value: "House", selected: true, checked: true});
                } else {

                    this._propertyTypeItems.push({ label: "House", value: "House"});
                }

                if(this.paramPropertyType == 'Room'){
                    this._propertyTypeItems.push({ label: "Room", value: "Room", selected: true, checked: true});
                } else {
                    this._propertyTypeItems.push({ label: "Room", value: "Room"});
                }

                if(this.paramPropertyType == 'Other'){
                    this._propertyTypeItems.push({ label: "Other", value: "Other", selected: true, checked: true});
                } else {
                    this._propertyTypeItems.push({ label: "Other", value: "Other"});
                }

            }      
        }  

        //create search FormControl
        this.searchControl = new FormControl();


        $("#SearchTop").focusin(function () {
            $(document).keypress(function (e) {
                if (e.which == 13) {
                    let firstResult = $(".pac-container .pac-item:first").text();

                    let geocoder = new google.maps.Geocoder();
                    geocoder.geocode({"address":firstResult }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            THIS.latitude = results[0].geometry.location.lat();
                            THIS.longitude = results[0].geometry.location.lng();
                            THIS.zoom = 11;
                            $("#SearchTop").val(results[0].formatted_address);
                            $("#SearchTop").blur();
                        }
                    });
                } else {
                    $(".pac-container").css("visibility","visible");
                }

            });
        });
        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {

            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['(cities)'],
                componentRestrictions: {
                    country: "ca"
                }
            });

            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    //set latitude, longitude and zoom
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = 12;
                });
            });
        });
        console.log('this.storageMap ' + JSON.stringify(this.storageMap));
        if(!this.commonAppService.isUndefined(this.storageMap)){
            this.zoom = this.storageMap.zoom;
            this.latitude =  this.storageMap.latitude;
            this.longitude = this.storageMap.longitude;

            this.localStorage.removeItem('storageMap');
        } else if(!this.commonAppService.isUndefined(this.paramCityName)){
            
            this.zoom = 11;
            this.latitude = 49.895136;
            this.longitude = -97.13837439999998;
            this.mapsAPILoader.load().then(() => {
                let geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'address': this.paramCityName }, (results, status) => {
                    let latitude = results[0].geometry.location.lat();
                    let longitude = results[0].geometry.location.lng();
                    let formatted_address = results[0].formatted_address;
                    $('#SearchTop').val(formatted_address);
                    THIS.zoom = 11;
                    if(latitude && longitude){
                        THIS.latitude = latitude;
                        THIS.longitude = longitude;
                    } else {
                        
                        THIS.latitude = 49.895136;
                        THIS.longitude = -97.13837439999998;
                    }                
                });
            });
            
        } else {
            let visitorLocationDetails: any;
            // this.commonAppService.getVisitorLocationDetails(function (details){
            //     visitorLocationDetails = details;
            //     console.log('visitorLocationDetails ' + JSON.stringify(visitorLocationDetails));  
            //     console.log('city ' + JSON.stringify(visitorLocationDetails.city));  
                // if(visitorLocationDetails){
                //     THIS.latitude = visitorLocationDetails.lat;
                //     THIS.longitude = visitorLocationDetails.lon;
                // } else {
                //     THIS.latitude = 49.895136;
                //     THIS.longitude = -97.13837439999998;
                // }
            //});
            this.zoom = 11;
            this.latitude = 49.895136;
            this.longitude = -97.13837439999998;
        }
        this.storageMap = {latitude: this.latitude, longitude: this.longitude, zoom: this.zoom};
        console.log('this.latitude ' + JSON.stringify(this.latitude));
        console.log('this.longitude ' + JSON.stringify(this.longitude));
    }

    public ngOnInit() {

    }

    ngAfterViewInit() {
        //this.setMapAndListSize(window.screen.height);
    }

    initFilterQueryObject() {
        this.filterQueryObject = {
            PropertyType: [],
            Min: "",
            Max: "",
            Bed: [],
            Bath: [],
            Keywords: "",
            Pet: "",
            Smoking: "",
            ListedWithin: "",
            DateAvailable: ""
        }
    }

    setLatLongZoom(obj: any){
        this.zoom = obj.zoom;
        this.latitude = obj.latitude;
        this.longitude = obj.longitude;
    }

    infoWindowDivClick(event: any){
        console.log(' infoWindowDivClick success ' );
    }

    public callGetPropertiesByLatLng(lat: number, lng: number){
        this.windowWidth = $(window).width().toString();
        this.windowHeight = $(window).height().toString();
        // this.limitListingCount = 1000;
        let THIS = this;
        this.propertyService.getAllPropertiesByGeoLatLong(lat, lng, this.limitListingCount)
            .subscribe((data: any) => {
                this.loading = false;
                console.log(' TOTAL FETCH DATA ' + JSON.stringify(data.length));
                data.sort(function(a,b){
                    let parsed_date = new Date(parseInt(b.DateListed));
                    let relative_to = new Date(parseInt(a.DateListed));
                    let diff = parsed_date.getTime()-relative_to.getTime();
                    let flag = new Number(Math.floor(diff));
                    return flag;
                });

                this.allFullProperties = [];
                data.map((property: any, index: any) => {
                    
                    if(property && this.checkMarkerVisible(property.Latitude, property.Longitude) && property.Id != "0" && index < this.limitListingCount && property.Pictures.length > 0){
                        this.allFullProperties.push(property); 
                    }
                });

                this.filterListing(data);

            },
            (error: any) => {
                this.loading = false;
                console.log(' Error while  getAllPropertiesByLatLong : ' + JSON.stringify(error));
            });
    }

    setMapManager(mapApiWrapper: GoogleMapsAPIWrapper){
        this._mapApiWrapper = mapApiWrapper;
        //this.map = map;
    }

    setSebmGoogleMap(sebmGoogleMap: SebmGoogleMap){
        this.map = sebmGoogleMap;
    }

    setMarkerManager(markerManager: MarkerManager){
        this._markerManager = markerManager;
    }

    setInfoWindowManager(infoWindowManager: InfoWindowManager){
        this._infoWindowManager = infoWindowManager;
    }

    checkMarkerAlreadyExist(checkMarker: any){
        for (let key in this.previousMarkers) {
            if (this.previousMarkers.hasOwnProperty(key)) {
                let markerItem = this.previousMarkers[key];
                if(markerItem.latitude == checkMarker.latitude && markerItem.longitude == checkMarker.longitude){
                    return true;
                }
            }
        }
        return false;
    }

    public currentMarker: SebmGoogleMapMarker;
    public currentInfowindow = new SebmGoogleMapInfoWindow(this._infoWindowManager, this.infoWindowDiv);

    addMarkers(markers: any){
        let THIS = this;
        if(markers.length <= 0){
            THIS.removeMarkers(this.previousMarkers);
        }
        for (let key in markers) {
            if (markers.hasOwnProperty(key)) {
                let markerItem = markers[key];
                
                let DAYDIFF = this.commonAppService.getDayDiffFromTwoDate(new Date(markerItem.DateListed), new Date());

                this.currentMarker = new SebmGoogleMapMarker(this._markerManager);
                this.currentMarker.iconUrl = (DAYDIFF > 2)?  GlobalVariable.PIN_PURPLE : GlobalVariable.PIN_GREEN;
                this.currentMarker.latitude = markerItem.Latitude;
                this.currentMarker.longitude = markerItem.Longitude;
                this.currentMarker.title = "test";
                this.currentMarker.zIndex = parseInt(key);
                this.currentMarker.opacity = 1;
                this.currentMarker.visible = true;
                // this.currentMarker.label = ""; 

                let flag: boolean = this.checkMarkerVisible(markerItem.Latitude, markerItem.Longitude);

                if(!flag){
                    this._markerManager.deleteMarker(this.currentMarker);
                } else {
                    let isMarkerExists = this.checkMarkerAlreadyExist(this.currentMarker);

                    if(!isMarkerExists){
                        this._markerManager.addMarker(this.currentMarker);

                        this.previousMarkers.push(this.currentMarker);
                        let w = THIS.getWindowWidth();
                        this._markerManager.createEventObservable('mouseover', this.currentMarker)
                        .subscribe((position: any) => {
                            this.currentMarker.iconUrl = GlobalVariable.PIN_RED;
                            //if(parseInt(w) > 767){
                                THIS.openInfowindow(markerItem, position);
                            //}
                        });

                        this._markerManager.createEventObservable('click', this.currentMarker)
                        .subscribe((position: any) => {
                            this.currentMarker.iconUrl = GlobalVariable.PIN_RED;
                            if(parseInt(w) <= 767){
                                THIS.openInfowindow(markerItem, position);
                            }
                        }); 

                        // google.maps.event.addListener(this.currentMarker, 'mouseover', function() {
                        // });

                        this._markerManager.createEventObservable('mouseout', this.currentMarker)
                        .subscribe((position: any) => {
                            this.currentMarker.iconUrl = GlobalVariable.PIN_PURPLE;
                            console.log(' THIS.getIsInfowindowOpenValue ' + THIS.getIsInfowindowOpenValue());
                            setTimeout(() => {
                                if(THIS.getIsInfowindowOpenValue() == 'No'){
                                   this._infoWindowManager.close(THIS.currentInfowindow); 
                                   THIS.changeMarkerColor(markerItem, 0, false);
                                }
                            }, 500);
                        });  
                    }                    
                }
            }
        }
    }

    openInfowindow(markerItem: any, position: any){
        let THIS = this;
        let w = THIS.getWindowWidth();
        THIS.changeMarkerColor(markerItem, 0, true);

        let center: any = THIS._mapApiWrapper.getCenter();

        let quadrant = "",
            offset: any = new google.maps.Size(165, 20);

        quadrant += position.latLng.lng() > center.lng() ? "b" : "t";
        quadrant += position.latLng.lat() < center.lat() ? "l" : "r";

        console.log('quadrant ' + quadrant);

        if (quadrant == "br") {
            offset = new google.maps.Size(-140, 250);
        } else if (quadrant === "tr") {
            offset = new google.maps.Size(160, 250);
        } else if (quadrant === "bl") {
            offset = new google.maps.Size(-145, 5);
        } else if (quadrant === "tl") {
            offset = new google.maps.Size(170, 15);
        }

        let infoWindowLat = 49.895136;
        let infoWindowLong = -97.13837439999998;
        if(parseInt(w) > 767){
            infoWindowLat = position.latLng.lat();
            infoWindowLong = position.latLng.lng();
        } else {
            infoWindowLat = center.lat();
            infoWindowLong = center.lng();
        }
        THIS.currentInfowindow.latitude = infoWindowLat;
        THIS.currentInfowindow.longitude = infoWindowLong;
        
        
        let node=document.createElement('div');
        let thisProperty = (markerItem.PropertyType == 'Room')?'Room Rental' : markerItem.PropertyType;

        let thisBed = (markerItem.Bed == 'Studio')?'Studio' : markerItem.Bed + 'br';

        node.innerHTML = THIS.getHtmlForInfowindow(markerItem);
        //$('.popover').addClass('popover-infowindow');

        //THIS.popoverInfowindowHtml = THIS.getHtmlForInfowindow(markerItem);
        THIS.currentInfowindow.content = node;

        node.onclick=function(){
            THIS.propertyDetails(this, markerItem.Id);
        };

        node.addEventListener("mouseover", function(e: any) {
            console.log(' nodemouseover call _infoWindowManager');
            THIS.setIsInfowindowOpenValue('Yes');
        });

        node.addEventListener("mouseleave", function(e: any) {
            console.log(' nodemouseleave call _infoWindowManager');
            THIS.setIsInfowindowOpenValue('No');
            THIS.removeInfowindow();
            THIS.changeMarkerColor(markerItem, 0, false);
        });

        this._infoWindowManager.addInfoWindow(THIS.currentInfowindow);

        if(parseInt(w) > 767){
            THIS.currentInfowindow.latitude = position.latLng.lat();
            THIS.currentInfowindow.longitude = position.latLng.lng();
            this._infoWindowManager.setOptions(THIS.currentInfowindow, { pixelOffset: offset});

        } else {
            if (quadrant == "br") {
                offset = new google.maps.Size(-70, 240);
            } else if (quadrant === "tr") {
                offset = new google.maps.Size(30, 250);
            } else if (quadrant === "bl") {
                offset = new google.maps.Size(-20, 5);
            } else if (quadrant === "tl") {
                offset = new google.maps.Size(40, 15);
            }
            // THIS.latitude = 49.895136;
            // THIS.longitude = -97.13837439999998;
            this._infoWindowManager.setOptions(THIS.currentInfowindow, { disableAutoPan : true});
        }

        THIS.currentInfowindow.latitude = center.lat();
        THIS.currentInfowindow.longitude = center.lng();

        // this._infoWindowManager.createEventObservable('mouseover', THIS.currentInfowindow).subscribe(() => {
        //     THIS.setIsInfowindowOpenValue('Yes');

        //     console.log(' mouseover call _infoWindowManager');
        // }); 

        this._infoWindowManager.createEventObservable('mouseover', this.currentInfowindow)
        .subscribe((position: any) => {
            THIS.setIsInfowindowOpenValue('Yes');
            console.log(' mouseover call _infoWindowManager');
        }); 

        $('.gm-style-iw').next('div').find('img').click();
        this.removeInfowindow();
        this._infoWindowManager.open(THIS.currentInfowindow);
        console.log(' windowWidth ' + w);
    }

    removeMarkers(prevMarkers: any){
        console.log(' removeMarkers this.previousMarkers ' + JSON.stringify(this.previousMarkers.length) + 'prevMarkers.length' + prevMarkers.length);
        let currentPreMarkersList = [];

        this.previousMarkers.map((mark: any, index: any) => {
            currentPreMarkersList.push(mark); 
        });

        for (let markerKey in currentPreMarkersList) {
            if (currentPreMarkersList.hasOwnProperty(markerKey)) {
                let removeMarkerItem = currentPreMarkersList[markerKey];
                let flag: boolean = this.checkMarkerVisible(removeMarkerItem.Latitude, removeMarkerItem.Longitude);
                if(flag == false){
                    this._markerManager.deleteMarker(removeMarkerItem);
                    this.previousMarkers.splice(this.previousMarkers.indexOf(removeMarkerItem), 1);
                }
            }
        }
    }

    getMarkerLabel(markerItem: any){
        let markerLabelCounter;
        let THIS = this;
        let tempMarkerArray = [];
        this.markers.map((property: any, index: any) => {
            if(property && property.Latitude == markerItem.Latitude && property.Longitude == markerItem.Longitude){
                tempMarkerArray.push(property);
            }
        });

        console.log(' tempMarkerArray.length ' + tempMarkerArray.length);
         
        return tempMarkerArray.length + "";
    }
    
    getHtmlForInfowindow(markerItem: any){
        let THIS = this;
        THIS.thisMarkersArray = [];
        this.markers.map((property: any, index: any) => {
            if(property && property.Latitude == markerItem.Latitude && property.Longitude == markerItem.Longitude){
                THIS.thisMarkersArray.push(property);
            }
        });

        let totalInfowindowMarkers: Number = THIS.thisMarkersArray.length;
        let HTML = "";
        for (let markerKey in THIS.thisMarkersArray) {
            let thisMarkerItem = THIS.thisMarkersArray[markerKey];
            let thisProperty = (thisMarkerItem.PropertyType == 'Room')?'Room Rental' : thisMarkerItem.PropertyType;
            let thisBed = (thisMarkerItem.PropertyType == 'Room')?'' :((thisMarkerItem.Bed == 'Studio')?'Studio' : thisMarkerItem.Bed + 'br');
            HTML += "<div class='list_rental_inforwindow_div'></div>";
            HTML += "<div id='' class='col-xs-12 col-sm-12 col-md-12 pad0' >"+
                    "<button class='closeWindowButton btn btn-danger hidden-sm  hidden-md  hidden-lg'>X</button>"+
                    "<a href='/"+ this.commonAppService.convertUrlString(this.commonAppService.getCityFromAddress(thisMarkerItem.Address)) +"/"+ this.commonAppService.getParamFromPropertyType(thisProperty) +"/" + this.commonAppService.convertUrlString(thisMarkerItem.Title) + "-" + thisMarkerItem.Id + "' data-id='"+thisMarkerItem.Id+"' class='list_rental_inforwindow' id='markerItem.Id' >"+
                        "<div class='col-xs-12 col-sm-12 pad0'>"+
                            "<div class='item'>"+
                                "<img src='"+ thisMarkerItem.PicUrl +"' alt='' class='infowindow-property-pic thumbnail'>"+
                            "</div>"+
                        "</div>"+
                        "<span class='col-xs-12 infowindow-caption col-sm-12'>"+
                            "<div class='col-xs-4 col-sm-4'>"+
                                "<h4 class='text-white'>$"+ thisMarkerItem.MonthlyRent +"</h4>"+
                            "</div>"+
                            "<div class='col-xs-5 col-sm-5 text-right'>"+
                                "<h6 class='price text-white text-center'>"+ thisProperty +"</h6>"+
                            "</div>"+
                            "<div class='col-xs-3 col-sm-3 text-right'>"+
                                "<h6 class='price text-white'>"+ thisBed +"</h6>"+
                            "</div>"+
                        "</span>"+
                    "</a>"+
                "</div>";
                if(new Number(THIS.thisMarkersArray.length) > parseInt(markerKey+1) ) {
                    HTML += "<div class='col-xs-12 col-sm-12 pad0'>"+
                        "<div class='col-xs-12 col-sm-12 pad0 infowindowBreak'><hr></div>"+
                    "</div>";
                }
                
        }

        // $(document).on('mouseover', 'div.list_rental_inforwindow', function() {
        //     THIS.setIsInfowindowOpenValue('Yes');
        // });

        $(document).on("mouseenter", "div.list_rental_inforwindow_div", function() {
            console.log('mouseover works!!!!!!!!!');
            THIS.setIsInfowindowOpenValue('Yes');
        });

        $(document).on('hover', 'div.list_rental_inforwindow_div', function () {
            console.log('mouseover works!!!!!!!!!');
            THIS.setIsInfowindowOpenValue('Yes');
        });

        // $(".list_rental_inforwindow_div").on("mouseover", "div", function() {
           
        // });

        $(document).on('click', 'button.closeWindowButton', function() {
            //THIS._infoWindowManager.close(THIS.currentInfowindow); 
        });

        $(document).on('mouseleave', 'div.list_rental_inforwindow_div', function() {
            THIS.setIsInfowindowOpenValue('No');
            THIS._infoWindowManager.close(THIS.currentInfowindow); 
        });

        return HTML;
    }

    editProperty(event: any, Id: string){
        event.stopPropagation();
        window.location.href = "manageProperty/" + Id;
        // this.router.navigate( [
        //     'manageProperty', { Id: Id}
        // ]);
    }

    propertyDetails(event: any, Id: any){
        this.localStorage.setObject('storageFilters', this.filterQueryObject);
        this.localStorage.setObject('storageMap', this.storageMap);

        this.propertyService.updatePropertyViewsCount(Id)
                .subscribe((data: any) => {
                    this.loading = false;
                    console.log(' data ' + JSON.stringify(data));
                    //event.stopPropagation();
                    // this.router.navigate( [
                    //     'propertyDetails', { Id: Id}
                    // ]);
                },
                (error: any) => {
                    this.loading = false;
                    console.log(' Error while updateProfile : ' + JSON.stringify(error));
                    // event.stopPropagation();
                    // this.router.navigate( [
                    //     'propertyDetails', { Id: Id}
                    // ]);
                });

    }

    changeMarkerColor(prop: any, index: any, flag: boolean){
        for (let markerKey in this.previousMarkers) {
            let preMarkerItem = this.previousMarkers[markerKey];
            if (prop.Latitude == preMarkerItem.latitude && prop.Longitude == preMarkerItem.longitude) {
                let DAYDIFF = this.commonAppService.getDayDiffFromTwoDate(new Date(preMarkerItem.title), new Date());

                preMarkerItem.iconUrl = (flag == true)? GlobalVariable.PIN_RED : ((DAYDIFF > 2)?  GlobalVariable.PIN_PURPLE : GlobalVariable.PIN_GREEN);

                this._markerManager.updateIcon(preMarkerItem);
            }
        }
    }

    toggleMore(){
        this.isMoreFilter = !this.isMoreFilter;
        this.moreFilterText = (this.isMoreFilter)? "More" : "Less";
    }

    closeMore(){
        this.isMoreFilter = !this.isMoreFilter;
    }

    infowindowMouseOver(event: any){
         console.log(' infowindowMouseOver');
    }


    setFilterFromStorage(defaultFilters: any){
        let THIS = this;
        console.log(' defaultFilters.Min ' + JSON.stringify(defaultFilters.Min));
        
        for (var key in defaultFilters) {
            if (defaultFilters.hasOwnProperty(key)) {
                // console.log(' final defaultFilters[key] ' + defaultFilters[key] + ' key  : ' + key);
                if (key == 'PropertyType') {
                    let PropertyTypeArray = ['Apartment', 'House', 'Room', 'Other'];

                    $.each(PropertyTypeArray, function (i, typeVal) {
                        if(defaultFilters[key].indexOf(typeVal) >= 0){
                            THIS._propertyTypeItems.push({ label: typeVal, value: typeVal, selected: true, checked: true});
                        } else {
                            console.log('THIS._propertyTypeItems  ' + THIS._propertyTypeItems);
                            THIS._propertyTypeItems.push({ label: typeVal, value: typeVal});
                        }
                    });
                }

                if (key == 'Min') {
                    $('#minFilter').val(defaultFilters[key]);
                }

                if (key == 'Max') {
                    $('#maxFilter').val(defaultFilters[key]);
                }

                if (key == 'Bed') {
                    let BedArray = ['Studio', '1', '2', '3', '4', '5+'];

                    $.each(BedArray, function (i, typeVal) {
                        if(defaultFilters[key].indexOf(typeVal) >= 0){
                            THIS._beds.push({ label: typeVal, value: typeVal, selected: true, checked: true});
                        } else {
                            console.log('THIS._beds  ' + THIS._beds);
                            THIS._beds.push({ label: typeVal, value: typeVal});
                        }
                    });
                }

                if (key == 'DateAvailable') {
                    // if (defaultFilters[key] == 'Immediately') {
                    //     $('#propAvailableBefore').val(getCalendarFormatDate(new Date()));
                    // } else {
                    //     $('#propAvailableBefore').val(defaultFilters[key]);
                    // }
                }

                if (key == 'Keywords') {
                    $('#Keywords').val(defaultFilters[key]);
                }

                if (key == 'ListedWithin') {
                    $("input[name=listedWithin][data-val='" + defaultFilters[key] + "']").prop('checked', true);
                }

                if (key == 'Bath') {
                    $.each(defaultFilters[key], function (i, val) {
                        $("input[name=baths][data-val='" + val + "']").prop('checked', true);
                    });
                }

                // if (key == 'Pet') {
                //     $.each(defaultFilters[key], function (i, val) {
                //         $("input[name=pets][data-val='" + val + "']").prop('checked', true);
                //     });
                // }

                if (key == 'RentIncludes') {
                    $.each(defaultFilters[key], function (i, val) {
                        $("input[name=rentIncludes][data-val='" + val + "']").prop('checked', true);
                    });
                }

                if (key == 'Smoking') {
                    $("input[name=smoking][data-val='" + defaultFilters[key] + "']").prop('checked', true);
                }

                if (key == 'Amenities') {
                    $.each(defaultFilters[key], function (i, val) {
                        $("input[name=amenities][data-val='" + val + "']").prop('checked', true);
                    });
                }
            }
        }
    }

    clearFilter(){
        this.initFilterQueryObject();
        this.filterListing(this.allFullProperties);
        //$('#morefilter').find('input[type=checkbox]').prop('checked', false);
        //$('#morefilter').find('input[type=radio]').prop('checked', false);

        $('#filtercontainer')
          .find(".form-control,textarea,select")
             .val('')
             .end()
          .find("input[type=checkbox], input[type=radio]")
             .prop("checked", "")
             .end()
          .find("li")
             .removeClass('selected')
             .end();

        $('.multi-select-popup .dropdown-item')
          .find("i")
          .removeClass("fa-check").addClass("glyphicon-none");             
    }

    closeInforwindow(){
        // this.infoWindow.close();
        let w = this.getWindowWidth();
        if(this.getIsInfowindowOpenValue() == 'No'){
            this._infoWindowManager.close(this.currentInfowindow);    
        }
    }

    removeInfowindow(){
        $('.gm-style-iw').parent().remove();
    }

    updateResultCounter(){
        this.resultCounter = this.properties.filter(value => 
            (value.PicUrl != '' && (this.checkMarkerVisible(value.Latitude, value.Longitude)))).length;
    }

    /*------ Filter Property ------- */

    propTypeSelected(event: any){
        let propertyTypeItems: string[] = this.commonAppService.getSelectedFromMultiselect(this.watchedPropertyTypeItems);

        this.filterQueryObject.PropertyType = propertyTypeItems;
        this.filterListing(this.allFullProperties);
    }

    public PropertyTypeMobile: string[] = [];
    propMobilePropertyTypeChange(event: any){
        if(event.target.checked == true){
            this.PropertyTypeMobile.push(event.target.value);
        } else {
            this.PropertyTypeMobile.splice(this.PropertyTypeMobile.indexOf(event.target.value), 1);
        }
        this.filterQueryObject.PropertyType = this.PropertyTypeMobile;
        this.filterListing(this.allFullProperties);
    }

    propMinChange(value: any){
        if(value != this.filterQueryObject.Min){
            this.filterQueryObject.Min = value;
            this.filterListing(this.allFullProperties);
        }
    }

    propMaxChange(value: any){
        if(value != this.filterQueryObject.Max){
            this.filterQueryObject.Max = value;
            this.filterListing(this.allFullProperties);
        }
    }

    propBedSelected(event: any){
        let propertyBedItems: string[] = this.commonAppService.getSelectedFromMultiselect(this.watchedBedsItems);

        this.filterQueryObject.Bed = propertyBedItems;
        this.filterListing(this.allFullProperties);
    }

    public BedMobile: string[] = [];
    propMobileBedChange(event: any){
        if(event.target.checked == true){
            this.BedMobile.push(event.target.value);
        } else {
            this.BedMobile.splice(this.BedMobile.indexOf(event.target.value), 1);
        }
        this.filterQueryObject.Bed = this.BedMobile;
        this.filterListing(this.allFullProperties);
    }

    propAvailableDateSelected(event: any){

        this.filterQueryObject.DateAvailable = ((event.target.checked == true)? new Date().toString() : "");
        this.filterListing(this.allFullProperties);
    }

    propAvailableDateChange(event: IMyDateModel){
        console.log(' event.jsdate ' + event.jsdate);
        this.filterQueryObject.DateAvailable = ((event.jsdate != null)? event.jsdate.toString() : "");
        this.filterListing(this.allFullProperties);
    }

    availableDateMouseover(event: IMyDateModel){
        console.log(' availableDateMouseover ');
        // let eventNew = new MouseEvent('click', {bubbles: true});
        // this.renderer.invokeElementMethod(this.AvailableDate.nativeElement, 'dispatchEvent', [eventNew]);
    }

    propKeywordsChange(value: any){
        if(value.length >= 0){
            this.filterQueryObject.Keywords = value;
            this.filterListing(this.allFullProperties);
        }
    }

    public ListedWithin: string = "";
    propListedWithinChange(event: any){
        console.log(' propListedWithinChange event.target.value ' + event.target.value);
        $('input[type=checkbox][name=listedWithin].listedWithin').each(function () {
            console.log('$(this).data(val) ' + $(this).data('val'));
            if ($(this).data('val') != event.target.value) {
                $(this).prop("checked", false);
            }
        });

        this.ListedWithin = (event.target.checked == true)? event.target.value : "";
        this.filterQueryObject.ListedWithin = this.ListedWithin;
        this.filterListing(this.allFullProperties);
    }

    public Bath: string[] = [];
    propBathChange(event: any){
        if(event.target.checked == true){
            this.Bath.push(event.target.value);
        } else {
            this.Bath.splice(this.Bath.indexOf(event.target.value), 1);
        }
        this.filterQueryObject.Bath = this.Bath;
        this.filterListing(this.allFullProperties);
    }

    public Pet: string[] = [];
    propPetChange(event: any){
        // if(event.target.checked == true){
        //     this.Pet.push(event.target.value);
        // } else {
        //     this.Pet.splice(this.Pet.indexOf(event.target.value), 1);
        // }
        // console.log(' this.Pet ' + JSON.stringify(this.Pet));
        // this.filterQueryObject.Pet = this.Pet;
        // this.filterListing(this.allFullProperties);
    }

    public Smoking: string = "";
    propSmokingChange(event: any){
        $('input[type=checkbox][name=smoking].smoking').each(function () {
            if ($(this).data('val') != event.target.value) {
                $(this).prop("checked", false);
            }
        });

        this.Smoking = (event.target.checked == true)? event.target.value : "";
        this.filterQueryObject.Smoking = this.Smoking;
        this.filterListing(this.allFullProperties);
    }
    filterListing(data: any){
        console.log(' this.filterQueryObject ' + JSON.stringify(this.filterQueryObject));
        
        let filteredListing: any[] = [];
        // let filteredListing = Object.assign([], this.allFullProperties);
        this.allFullProperties.map((property: any) => {
            if(property && property.Id != 0){
                filteredListing.push(property); 
            }
        });

        console.log(' filteredListing ' + JSON.stringify(filteredListing.length));
        let counter = 0;
        if(filteredListing.length <= 0){
            this.markers = [];
            return;
        }
        for (let key in this.allFullProperties) {
            counter++;
            if (this.allFullProperties.hasOwnProperty(key)) {
                let rentalItem = this.allFullProperties[key];
                let dataKey = key;
                let keepGoing = true;
                for (let filterkey in this.filterQueryObject) {
                    if (this.filterQueryObject.hasOwnProperty(filterkey) && keepGoing == true) {

                        if (filterkey == 'PropertyType') {
                            let propertyTypeValue = this.filterQueryObject[filterkey];
                            if (propertyTypeValue.length == 1 && propertyTypeValue.indexOf('Other') != -1) {
                                if (rentalItem.PropertyType == 'Apartment' || rentalItem.PropertyType == 'House' || rentalItem.PropertyType == 'Room') {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                }

                            } else if (propertyTypeValue.length > 0 && (!this.commonAppService.isUndefined(rentalItem.PropertyType)) && propertyTypeValue.indexOf('Other') != -1 && propertyTypeValue.indexOf(rentalItem.PropertyType) == -1) {
                                if (rentalItem.PropertyType == 'Apartment' && propertyTypeValue.indexOf('Apartment') == -1) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                }

                                if (rentalItem.PropertyType == 'House' && propertyTypeValue.indexOf('House') == -1) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                }

                                if (rentalItem.PropertyType == 'Room' && propertyTypeValue.indexOf('Room') == -1) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                }

                            } else if (propertyTypeValue.length > 0 && !this.commonAppService.isUndefined(rentalItem.PropertyType) && propertyTypeValue.indexOf(rentalItem.PropertyType) == -1) {
                                filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                keepGoing = false;
                            }
                        }

                        if (filterkey == 'Min') {
                            let minValue = this.filterQueryObject[filterkey];
                            if (minValue != '' && (!this.commonAppService.isUndefined(rentalItem.MonthlyRent)) && (parseInt(rentalItem.MonthlyRent) < parseInt(minValue))) {
                                filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                keepGoing = false;
                            }
                        }

                        if (filterkey == 'Max') {
                            let maxValue = this.filterQueryObject[filterkey];
                            if (maxValue != '' && (!this.commonAppService.isUndefined(rentalItem.MonthlyRent)) && (parseInt(maxValue) < parseInt(rentalItem.MonthlyRent))) {
                                filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                keepGoing = false;
                            }
                        }

                        if (filterkey == 'Bed') {
                            var bedsValue = this.filterQueryObject[filterkey];
                            if (bedsValue.length > 0 && !this.commonAppService.isUndefined(rentalItem.Bed)) {
                                if (bedsValue.indexOf(rentalItem.Bed) == -1 && rentalItem.Bed < 5) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                }

                                if (bedsValue.indexOf('Studio') == -1 && (rentalItem.Bed == 'Studio')) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                }

                                if (bedsValue.indexOf('5+') == -1 && rentalItem.Bed >= 5) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                }
                            }
                        }

                        if (filterkey == 'DateAvailable') {
                            let dateAvailableValue = this.filterQueryObject[filterkey];

                            let DAYDIFF = null;
                            let DAYDIFF1 = null;
                            if(!this.commonAppService.isUndefined(dateAvailableValue) && !this.commonAppService.isUndefined(rentalItem.DateAvailable)){
                                DAYDIFF = this.commonAppService.getDayDiffFromTwoDate(new Date(dateAvailableValue), new Date(rentalItem.DateAvailable));
                            }
                            if(!this.commonAppService.isUndefined(dateAvailableValue)){
                                DAYDIFF1 = this.commonAppService.getDayDiffFromTwoDate(new Date(dateAvailableValue), new Date());
                            }

                            if(this.commonAppService.isUndefined(dateAvailableValue)){

                            } else  if(!this.commonAppService.isUndefined(dateAvailableValue) && (!this.commonAppService.isUndefined(rentalItem.DateAvailable)) && DAYDIFF1 > 0 && rentalItem.IsImmediateAvailable == false && DAYDIFF > 0) {
                                filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                keepGoing = false;
                            } else  if(!this.commonAppService.isUndefined(dateAvailableValue) &&  DAYDIFF1 <= 0 && rentalItem.IsImmediateAvailable == true && DAYDIFF == null) {
                                filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                keepGoing = false;
                            } else  if(!this.commonAppService.isUndefined(dateAvailableValue) && (!this.commonAppService.isUndefined(rentalItem.DateAvailable)) &&  DAYDIFF1 < 0 && DAYDIFF < 0 && rentalItem.IsImmediateAvailable == false) {
                                filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                keepGoing = false;
                            }
                        }

                        if(filterkey == 'Keywords'){
                            let keywords = this.filterQueryObject[filterkey];

                            if (keywords != '' && (this.commonAppService.isUndefined(rentalItem.Title))) {
                                filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                keepGoing = false;
                            } else if (keywords != '' && (!this.commonAppService.isUndefined(rentalItem.Title)) && (rentalItem.Title.toLowerCase().indexOf(keywords.toLowerCase()) < 0)) {
                                filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                keepGoing = false;
                            }
                        }

                        if (filterkey == 'ListedWithin') {
                            let listedWithinValue = this.filterQueryObject[filterkey];
                            let thisDateListed = rentalItem.DateListed; 
                            // 
                            let DAYDIFF = this.commonAppService.getDayDiffFromTwoDate(new Date(thisDateListed), new Date());

                            if (listedWithinValue != '' && this.commonAppService.isUndefined(thisDateListed)) {
                                filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                keepGoing = false;
                            } else if (listedWithinValue.length != '' && !this.commonAppService.isUndefined(thisDateListed)) {
                                
                                if (listedWithinValue == 'Month' && DAYDIFF > 30) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                } else if (listedWithinValue == 'Week' && DAYDIFF > 7) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                } else if (listedWithinValue == '48h' &&  DAYDIFF > 2) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                }
                            } 
                        }

                        if (filterkey == 'Bath') {
                            var bathsValue = this.filterQueryObject[filterkey];

                            var bathsNumber = parseFloat(rentalItem.Bath);

                            if (bathsValue.length >= 3 && !this.commonAppService.isUndefined(bathsNumber)) {

                            } else if (bathsValue.length == 2 && !this.commonAppService.isUndefined(bathsNumber)) {
                                if (bathsValue.indexOf('1') == -1 && bathsNumber <= 1) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                } else if (bathsValue.indexOf('2') == -1 && (bathsNumber > 1 || bathsNumber <= 2)) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                } else if (bathsValue.indexOf('3+') == -1 && bathsNumber > 2) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                }
                            } else if (bathsValue.length == 1 && !this.commonAppService.isUndefined(bathsNumber)) {
                                if (bathsValue.indexOf('1') != -1 && bathsNumber > 1) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                } else if (bathsValue.indexOf('2') != -1 && (bathsNumber <= 1 || bathsNumber > 2)) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                } else if (bathsValue.indexOf('3+') != -1 && bathsNumber <= 2) {
                                    filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                    keepGoing = false;
                                }
                            }
                        }

                        if (filterkey == 'Pet') {
                            let petsValue = this.filterQueryObject[filterkey];
                            //let petsArray = this.commonAppService.getArrayFromString(rentalItem.Pet);
                            //console.log(' petsArray ' + petsArray);
                            // if (petsValue.length > 0 && !this.commonAppService.isUndefined(rentalItem.Pet) && petsValue.indexOf(rentalItem.Pet) == -1) {
                            //     filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                            //     keepGoing = false;
                            // }
                        }

                        if (filterkey == 'Smoking') {
                            let smokingValue = this.filterQueryObject[filterkey];
                            if (smokingValue != '' && ((rentalItem.Smoking == true && smokingValue == 'Yes') || (rentalItem.Smoking == false && smokingValue == 'No'))) {
                                filteredListing.splice(filteredListing.indexOf(rentalItem), 1);
                                keepGoing = false;
                            }
                        }
                    }
                }
            }
            if(counter == this.allFullProperties.length){
                console.log(' filteredListing ' + JSON.stringify(filteredListing.length));
                console.log(' this.allFullProperties.length ' + JSON.stringify(this.allFullProperties.length));
                this.properties = Object.assign([], filteredListing);

                this.markers = [];
                this.properties.map((property: any) => {
                    if(property && property.Id != 0){
                        // console.log(' property ' + JSON.stringify(property));
                        let markerObj = {
                            Latitude: property.Latitude,
                            Longitude: property.Longitude,
                            Id: property.Id + "",
                            PicUrl: property.Pictures[0].Url,
                            Bed: property.Bed,
                            MonthlyRent: property.MonthlyRent,
                            PropertyType: property.PropertyType,
                            DateCreated: property.DateCreated,
                            DateListed: property.DateListed,
                            Title: property.Title,
                            Address: property.Address,
                            draggable: false
                        };

                        let clusterObj = {
                            markers: property.Address,
                            address_id: "1",
                            price: property.Title,
                            coordinates: {
                                lat: property.Latitude,
                                lng: property.Longitude
                            }
                        };

                        this.markers.push(markerObj); 
                        this.clusters.push(clusterObj);
                    }
                });

                if(this.previousMarkers && this.previousMarkers.length > 0){
                    this.removeMarkers(this.previousMarkers);
                }

                this.addMarkers(this.markers);
                
                console.log(' this.properties '+ JSON.stringify(this.properties.length));
                console.log(' this.markers '+ JSON.stringify(this.markers.length));
                console.log(' this.previousMarkers '+ JSON.stringify(this.previousMarkers.length));
                this.resultCounter = filteredListing.length;
                //this.updateResultCounter();
            }
        }
        
    }

    @ViewChild('infoWindow') infoWindow: any;

    mapClicked() {
        //this._infoWindowManager.close(this.currentInfowindow);
        if(this.markers.length > 0){
            $('.gm-style-iw').next('div').find('img').click();
        }
    }

    markerHover(index: number, infoWindow: any, marker: any) {
        $('.gm-style-iw').next('div').find('img').click();
    }  

    mapBoundsChanged(bounds: any){
        console.log(' mapBoundsChanged call');
        if(!this.commonAppService.isUndefined(bounds)){

            if(!this.commonAppService.isUndefined(bounds) && !this.commonAppService.isUndefined(this.centerBounds)){
            }

            let center = bounds.getCenter();
            this.currentBounds = bounds;
            this.centerBounds = center;
            let lat = center.lat();
            let lng = center.lng();
            this.storageMap.latitude = lat;
            this.storageMap.longitude = lng;
            if(this.isBoundJustChanged == false){
                this.isBoundJustChanged = true;
                //this.callGetPropertiesByLatLng(lat, lng);    
            } 
        }
    }

    mapIdle(event: any, infoWindow: any){
        let lat = this.centerBounds.lat();
        let lng = this.centerBounds.lng();
        console.log(' mapIdle call' + this.windowWidth + '| this.isInfowindowOpen' + this.isInfowindowOpen);
        //if(parseInt(this.windowWidth) > 767 || this.isInfowindowOpen == false){
            this.callGetPropertiesByLatLng(lat, lng);
        //}
    }

    mapCenterChanged(event: any){
        // console.log(' this.isInfowindowOpen ' + this.isInfowindowOpen );
        // if(this.isInfowindowOpen == false){
        //     console.log(' mapCenterChanged call zoom ' + this.zoom);
        //     let lat = this.centerBounds.lat();
        //     let lng = this.centerBounds.lng();
        //     //this.callGetPropertiesByLatLng(lat, lng);
        // }
    }

    mapZoomChange(zoom: number){
        console.log(' mapZoomChange ' + zoom );
        this.zoom = zoom;
        this.storageMap.zoom = zoom;
        this.limitListingCountUpdate(this.zoom);

        let lat = this.centerBounds.lat();
        let lng = this.centerBounds.lng();
        //this.callGetPropertiesByLatLng(lat, lng);
    }

    checkMarkerVisible(lat: number, lng: number){
        let lat1 = this.currentBounds.getSouthWest().lat();
        let lng1 = this.currentBounds.getSouthWest().lng();
        let lat2 = this.currentBounds.getNorthEast().lat();
        let lng2 = this.currentBounds.getNorthEast().lng();
        
        // let isExists: boolean = this.currentBounds.contains( new google.maps.LatLng(lat, lng) );
        // //console.log(' isExists ' + isExists);
        // return isExists;
        if((lat >= lat1 && lat <= lat2) && (lng >= lng1 && lng <= lng2)){
            // return this.currentBounds.contains({'lat': lat, 'lng': lng});
            return true;    
        } 
        return false;
    }

    limitListingCountUpdate(currentZoom: number) {
        if(currentZoom <=5 ){
            this.limitListingCount = 120;
        } else if(currentZoom > 5 && currentZoom <=8){
            this.limitListingCount = 150;
        } else if(currentZoom > 8 && currentZoom <=12){
            this.limitListingCount = 200;
        } else if(currentZoom > 12 && currentZoom <= 15){
            this.limitListingCount = 230;
        } else if(currentZoom > 15 && currentZoom <= 20){
            this.limitListingCount = 250;
        } else if(currentZoom > 20){
            this.limitListingCount = 350; 
        }
    }

    onResize(event: any) {
        console.log( 'event.target.innerWidth ' +  event.target.innerWidth); 
        console.log( 'event.target.innerHeight ' +  event.target.innerHeight);
        this.windowHeight = (event.target.innerHeight);
        this.windowWidth = (event.target.innerWidth);
        this.setMapAndListSize(this.windowHeight);
    }

    setMapAndListSize(height: any){
        console.log( ' setMapAndListSize ' +  height);
        let HEIGHT = "";
        if(height >= 1000){
            HEIGHT = (height - 290) + 'px';
        } else if(height >= 900){
            HEIGHT = (height - 255) + 'px';
        } else if(height >= 700){
            HEIGHT = (height - 135) + 'px';
        } else {
            HEIGHT = (height - 125) + 'px';
        }

        console.log( ' after setMapAndListSize ' +  HEIGHT);
        $('#searchPropertyListing').css({
            'height': HEIGHT
        });
        $('#rentalsItems').css({
            'height': HEIGHT
        });
        $('#googlemap').css({
            'height': HEIGHT
        });
        $('#morefilter').css({
            'height': HEIGHT
        });

        $('#matchingList').css({
            'bottom': (height * 5 / 100) + 'px'
        });
    }

    isNumberKey(event: any){
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
          event.preventDefault();
        }
    }

    openModal(ButtonId: string){
        console.log( ' -----ButtonId ' +  ButtonId); 
        document.getElementById(ButtonId).click();
    }

    toggleMapListView(){
        this.isMapView = !this.isMapView;
        this.toggleMapListViewText = (this.isMapView == true)? "List" : "Map";
    }

    getWindowWidth(){
        return $(window).width().toString();
    }

    getIsInfowindowOpenValue(){
        return this.isInfowindowOpen;
    }

    setIsInfowindowOpenValue(value: any){
        this.isInfowindowOpen = value;
    }
}

export interface MarkerObject {
    Latitude: number;
    Longitude: number;
    Id: string;
    PicUrl: string;
    Bed: string;
    MonthlyRent: string;
    PropertyType: string;
    DateCreated: string;
    DateListed: string;
    Title: string;
    Address: string;
    draggable: boolean;
}

export interface FilterQueryObject{
    PropertyType: string[];
    Min: string;
    Max: string;
    Bed: string[];
    Keywords: string;
    Bath: string[];
    Pet: string;
    Smoking: string;
    ListedWithin: string;
    DateAvailable: string;
}

export interface Cluster {
    markers: string;
    address_id: string;
    price: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}