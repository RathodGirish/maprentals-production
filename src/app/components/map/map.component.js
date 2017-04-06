"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var app_component_1 = require('../../app.component');
var core_2 = require('angular2-google-maps/core');
var MapComponent = (function () {
    function MapComponent(googleMapsWrapper, googleMarkerManager, googleInfoWindowManager, sebmGoogleMap) {
        this.googleMapsWrapper = googleMapsWrapper;
        this.googleMarkerManager = googleMarkerManager;
        this.googleInfoWindowManager = googleInfoWindowManager;
        this.sebmGoogleMap = sebmGoogleMap;
        /**
         * Get native map object
         */
        this._map = null;
        this.mapChanged = new core_1.EventEmitter();
        /**
        * Get native map object
        */
        this._mapApiWrapper = null;
        this.mapApiWrapperChanged = new core_1.EventEmitter();
        /**
         * Get marker manager
         */
        this._markerManager = null;
        this.markerManagerChanged = new core_1.EventEmitter();
        /**
         * Get infowindow manager
         */
        this._infoWindowManager = null;
        this.infoWindowManagerChanged = new core_1.EventEmitter();
        /**
         * Get sebm markers
         */
        this._markers = null;
        this.markersChanged = new core_1.EventEmitter();
    }
    Object.defineProperty(MapComponent.prototype, "map", {
        get: function () {
            return this._map;
        },
        set: function (val) {
            this._map = val;
            this.mapChanged.emit(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapComponent.prototype, "mapApiWrapper", {
        get: function () {
            return this._mapApiWrapper;
        },
        set: function (val) {
            this._mapApiWrapper = val;
            this.mapApiWrapperChanged.emit(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapComponent.prototype, "markerManager", {
        get: function () {
            return this._markerManager;
        },
        set: function (val) {
            this._markerManager = val;
            this.markerManagerChanged.emit(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapComponent.prototype, "infoWindowManager", {
        get: function () {
            return this._infoWindowManager;
        },
        set: function (val) {
            this._infoWindowManager = val;
            this.infoWindowManagerChanged.emit(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapComponent.prototype, "markers", {
        get: function () {
            return this._markers;
        },
        set: function (val) {
            this._markers = val;
            this.markersChanged.emit(val);
        },
        enumerable: true,
        configurable: true
    });
    MapComponent.prototype.ngOnInit = function () {
        // this.googleMapsWrapper.getNativeMap()
        //   .then((map)=> {
        //       this._map = map;
        //       console.log('map.getZoom() ' + map.getZoom());
        //       console.log('this._map 1112' + this._map);
        //   });
        // this.content = this._el.nativeElement.querySelector('.sebm-google-map-info-window-content');
    };
    MapComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // get native map
        this.googleMapsWrapper.getNativeMap().then(function (map) {
            _this._mapApiWrapper = map;
            _this.map = map;
            console.log(' here is map object ');
            //let projection = this.map.getProjection();
            //console.log(' here is projection object  '  + projection);
        }, function (error) {
            throw error;
        });
        // get marker manager
        this.markerManager = this.googleMarkerManager;
        this.infoWindowManager = this.googleInfoWindowManager;
        this.mapApiWrapper = this.googleMapsWrapper;
        var THIS = this;
        var baseAddEventListeners = core_2.SebmGoogleMapMarker.prototype._addEventListeners;
        core_2.SebmGoogleMapMarker.prototype._addEventListeners = function () {
            var _this = this;
            this._markerManager.createEventObservable('mouseover', this)
                .subscribe(function (position) {
                console.log(' here its this.markerManager ' + _this.markerManager + ' this.markerManager.getCenter() ' + _this.markerManager.getCenter());
            });
            baseAddEventListeners.call(this);
        };
        // get markers
        this.markerChildren.changes.subscribe(function (markers) {
            _this.markers = markers._results;
        });
    };
    __decorate([
        core_1.Output('map')
    ], MapComponent.prototype, "mapChanged");
    __decorate([
        core_1.Output('mapApiWrapper')
    ], MapComponent.prototype, "mapApiWrapperChanged");
    __decorate([
        core_1.Output('markerManager')
    ], MapComponent.prototype, "markerManagerChanged");
    __decorate([
        core_1.Output('infoWindowManager')
    ], MapComponent.prototype, "infoWindowManagerChanged");
    __decorate([
        core_1.Output('markers')
    ], MapComponent.prototype, "markersChanged");
    __decorate([
        core_1.ContentChildren(core_2.SebmGoogleMapMarker)
    ], MapComponent.prototype, "markerChildren");
    MapComponent = __decorate([
        core_1.Directive({
            selector: 'get-map-objects'
        }),
        core_1.NgModule({
            imports: [core_2.MarkerManager, core_2.SebmGoogleMapMarker, core_2.SebmGoogleMap],
            declarations: [app_component_1.AppComponent],
            bootstrap: [app_component_1.AppComponent]
        })
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
