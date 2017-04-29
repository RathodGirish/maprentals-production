import { Component, Injectable, NgModule, Inject } from '@angular/core';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { GlobalVariable } from '../services/static-variable';


@Injectable()
export class PropertyService {
    headers : Headers;
    constructor(public http: Http) {
    }

    public getAllProperties() {
        return this.http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_PROPERTY)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getAllPropertiesByLatLong(lat: any, long: any, limit: number) {
        return this.http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_PROPERTY_BY_LAT_LONG + '?latitude= ' + lat + '&longitude=' + long + '&limit=' + limit)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getAllPropertiesByLatLong2(lat1: any, lat2: any, long1: any, long2: any, limit: number) {
        return this.http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_PROPERTY_BY_LAT_LONG2 + '?lat1= ' + lat1 + '&lat2='+ lat2 + '&long1='+ long1 + '&long2='+ long2 + '&limit=' + limit)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getAllPropertiesByGeoLatLong(lat: any, long: any, limit: number) {
        return this.http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_PROPERTY_BY_GEO_LAT_LONG + '?latitude= ' + lat + '&longitude='+ long + '&limit=' + limit)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getProperyById(Id: string) {
        return this.http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_PROPERTY_BY_ID + '/' + Id)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getAllPropertiesByUserId(Id: number) {
        return this.http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_PROPERTY_BY_USERID + '?userId=' + Id)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public addProperty(property: any) {
        let body = JSON.stringify(property);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(GlobalVariable.BASE_API_URL + GlobalVariable.ADD_PROPERTY, body, options)
            .map((data: any) => {
                data.json();
                return data.json();
            }); 
    }

    public updateProperty(property: any) {
        let body = JSON.stringify(property);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(GlobalVariable.BASE_API_URL + GlobalVariable.UPDATE_PROPERTY, body, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public activeDeactivePropertyById(Id: number, status: boolean){
        let ActiveDeactiveUrl = (status == true)? GlobalVariable.ACTIVE_PROPERTY_BY_ID : GlobalVariable.DEACTIVE_PROPERTY_BY_ID;
        let body = {};
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        console.log(' ActiveDeactiveUrl ' + ActiveDeactiveUrl);
        return this.http.post(GlobalVariable.BASE_API_URL + ActiveDeactiveUrl + '/' + Id, body, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public deletePropertyById(Id: number){
        let body = {};
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(GlobalVariable.BASE_API_URL + GlobalVariable.DELETE_PROPERTY_BY_ID + '/' + Id, body, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public updatePropertyViewsCount(Id: any) {
        let body = {};
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(GlobalVariable.BASE_API_URL + GlobalVariable.UPDATE_PROPERTY_VIEWS_COUNT + '/' + Id, body, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public freeBumpPropertyById(Id: any) {
        let dt = (new Date().toUTCString());
        let timeStamp = new Date(dt).getTime().toString();
        let body = {};
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(GlobalVariable.BASE_API_URL + GlobalVariable.FREE_BUMPED_PROPERTY_BY_ID + '/' + Id + '?timeStamp=' + timeStamp, body, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

}