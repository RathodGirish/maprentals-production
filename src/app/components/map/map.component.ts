import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, ContentChildren, QueryList} from '@angular/core';

import { AppComponent } from '../../app.component';

import { GoogleMapsAPIWrapper, MarkerManager, AgmCoreModule, MapsAPILoader, NoOpMapsAPILoader, MouseEvent, InfoWindowManager, SebmGoogleMap, SebmGoogleMapMarker,  SebmGoogleMapInfoWindow} from 'angular2-google-maps/core';

@Directive({
  selector: 'get-map-objects'
})

export class MapComponent implements AfterViewInit {

  /**
   * Get native map object
   */
  public _map: any = null;
  @Output('map') mapChanged: EventEmitter<any> = new EventEmitter<any>();
  set map(val){
    this._map = val;
    this.mapChanged.emit(val);
  }
  get map(){
    return this._map;
  }

   /**
   * Get native map object
   */
  public _mapApiWrapper: any = null;
  @Output('mapApiWrapper') mapApiWrapperChanged: EventEmitter<any> = new EventEmitter<any>();
  set mapApiWrapper(val){
    this._mapApiWrapper = val;
    this.mapApiWrapperChanged.emit(val);
  }
  get mapApiWrapper(){
    return this._mapApiWrapper;
  }

  /**
   * Get marker manager
   */
  public _markerManager: any = null;
  @Output('markerManager') markerManagerChanged: EventEmitter<MarkerManager> = new EventEmitter<MarkerManager>();
  set markerManager(val){
    this._markerManager = val;
    this.markerManagerChanged.emit(val);
  }
  get markerManager(){
    return this._markerManager;
  }

  /**
   * Get infowindow manager
   */
  public _infoWindowManager: any = null;
  @Output('infoWindowManager') infoWindowManagerChanged: EventEmitter<InfoWindowManager> = new EventEmitter<InfoWindowManager>();
  set infoWindowManager(val){
    this._infoWindowManager = val;
    this.infoWindowManagerChanged.emit(val);
  }
  get infoWindowManager(){
    return this._infoWindowManager;
  }

  /**
   * Get sebm markers
   */
  public _markers: any = null;
  @Output('markers') markersChanged: EventEmitter<SebmGoogleMapMarker[]> = new EventEmitter<SebmGoogleMapMarker[]>();
  set markers(val){
    this._markers = val;
    this.markersChanged.emit(val);
  }
  get markers(){
    return this._markers;
  }
  @ContentChildren(SebmGoogleMapMarker) markerChildren: QueryList<SebmGoogleMapMarker>;

  constructor(
    public googleMapsWrapper: GoogleMapsAPIWrapper,
    public googleMarkerManager: MarkerManager,
    public googleInfoWindowManager: InfoWindowManager,
    public sebmGoogleMap: SebmGoogleMap
  ) { }

  //ngOnInit() {
    // this.googleMapsWrapper.getNativeMap()
    //   .then((map)=> {
    //       this._map = map;
    //       console.log('map.getZoom() ' + map.getZoom());
    //       console.log('this._map 1112' + this._map);

    //   });

      // this.content = this._el.nativeElement.querySelector('.sebm-google-map-info-window-content');
  //}

  ngAfterViewInit() {
    // get native map
    this.googleMapsWrapper.getNativeMap().then(map => {
      this._mapApiWrapper = map;
      this.map = map;
      console.log(' here is map object ');
      //let projection = this.map.getProjection();
      //console.log(' here is projection object  '  + projection);
    }, error => {
      throw error;
    })

    // get marker manager
    this.markerManager = this.googleMarkerManager;
    this.infoWindowManager = this.googleInfoWindowManager;
    this.mapApiWrapper = this.googleMapsWrapper;

    let THIS = this;
    const baseAddEventListeners = (<any>SebmGoogleMapMarker.prototype)._addEventListeners;

    (<any>SebmGoogleMapMarker.prototype)._addEventListeners = function() {
        this._markerManager.createEventObservable('mouseover', this)
        .subscribe((position: any) => {
             console.log(' here its this.markerManager ' + this.markerManager + ' this.markerManager.getCenter() ' + this.markerManager.getCenter());

        });

        baseAddEventListeners.call(this);
    }

    // const baseAddEventListeners2 = (<any>SebmGoogleMapInfoWindow.prototype)._addEventListeners;

    // (<any>SebmGoogleMapInfoWindow.prototype)._addEventListeners = function() {
    //     this._infoWindowManager.createEventObservable('mouseover', this)
    //     .subscribe((position: any) => {
    //          console.log(' here its this.infoWindowManager ' + this.infoWindowManager + ' this.infoWindowManager.getCenter() ' + this.infoWindowManager.getCenter());

    //     });

    //     baseAddEventListeners.call(this);
    // }

    // get markers
    this.markerChildren.changes.subscribe(markers => {
      this.markers = markers._results;
    });
    
  }
}