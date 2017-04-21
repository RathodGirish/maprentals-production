import {Injectable} from '@angular/core';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalVariable } from '../services/static-variable';
import { Observable } from 'rxjs/Observable';
import { CoolLocalStorage } from 'angular2-cool-storage';

import * as $ from 'jquery';

@Injectable()
export class CommonAppService {
	headers : Headers;
	localStorage: CoolLocalStorage;
	currentUser: any;

	constructor(public http: Http,
		localStorage: CoolLocalStorage){
		this.localStorage = localStorage;  
	}

	public getCurrentUser(){
		//this.currentUser = this.localStorage.getObject('currentUser');
		if(!this.isUndefined(this.localStorage.getObject('currentUser'))) {
			return this.localStorage.getObject('currentUser');
		} else if(!this.isUndefined(this.currentUser)) {
			return this.currentUser;
		}
		return null;
	}

	public setCurrentUser(user: any){
		//this.currentUser = this.localStorage.getObject('currentUser');
		this.currentUser = user;
	}

	public mergeObjects(obj1: any, obj2: any, callback: any){
	    var obj3 = {};
	    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
	    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
	    callback(obj3);
	}

	public getFormattedAddress(place: any){
	    let street_number = "",
	        name = "",
	        address = "",
	        city = "",
	        state = "",
	        zip = "",
	        country = "",
	        formattedAddress = "";

	    for (let i = 0; i < place.address_components.length; i++) {
	        let addr = place.address_components[i];
	        if (addr.types[0] == 'street_number')
	            street_number = addr.short_name;
	        else if (addr.types[0] == 'country')
	            country = addr.long_name;
	        else if (addr.types[0] == 'street_address') // address 1
	            address = address + addr.long_name;
	        else if (addr.types[0] == 'establishment')
	            address = address + addr.long_name;
	        else if (addr.types[0] == 'route')  // address 2
	            address = address + addr.long_name;
	        else if (addr.types[0] == 'postal_code') // Zip
	            zip = addr.short_name;
	        else if (addr.types[0] == ['administrative_area_level_1'])   // State
	            state = addr.short_name;
	        else if (addr.types[0] == ['locality'])   // City
	            city = addr.long_name;
	    }

	    if (street_number != "") {
	        name = street_number + ", ";
	    } else if (place.name && place.name != "") {
	        name = place.name + ", ";
	    }
	    
	    formattedAddress = name + address + ", " + city + ", " + state;
	    let array = formattedAddress.split(',');
	    let newArray = array.filter(function(v){return v!==''});
	    if(address == '' && city == ''){
	        return "";
	    }
	    return formattedAddress;
	}

	public formateAddress(address: any){
		if(!this.isUndefined(address)){
			if (address != null && address.match(/,/g).length >= 3) { 
				address = address.replace(',', '');
			}
			let array = address.split(' ');
			let newAddress = "";
			for (let i = array.length - 1;  0 <= i; i--) {
				if(newAddress.indexOf(array[i]) < 0){
					newAddress = array[i] + " " + newAddress;	
				}
			}
			return newAddress;
		} else {
			return "";
		}
	}

	public getCityFromAddress(address: any){
		if (address != null) { 
		    let arr: any[] = address.split(',');
		    return arr[arr.length-2].replace(/ /g,'');
		}
		return "";
	}

	public getStreetAndCityFromAddress(address: any){
		if (address != null) { 
		    let arr: any[] = address.split(',');
		    return (arr[arr.length-2] + ', ' +  arr[arr.length-3]);
		}
		return "";
	} 

	public getStreetFromAddress(address: any){
		if (address != null) { 
		    let arr: any[] = address.split(',');
		    return (arr[0] + arr[1]);
		}
		return "";
	}

	public convertUrlString(string: any){
		return string.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
	}

	public getFullFormattedDate(date: any){
		let dt= new Date(date);
	   	return (dt.getFullYear() + '-' + ('0' + (dt.getMonth()+1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2)) + ' ' + 
    		('00' + dt.getHours()).slice(-2) + ':' + 
    		('00' + dt.getMinutes()).slice(-2) + ':' + 
    		('00' + dt.getSeconds()).slice(-2);
	}

	public getFormattedDate(date: any){
		let dt= new Date(date);
	   	return (dt.getFullYear() + '-' + ('0' + (dt.getMonth()+1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2));
	}

	public getFormattedDateMD(date: any){
		let dt= new Date(date);
		let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	   	// return (monthNames[dt.getMonth()] + ' ' + ('0' + dt.getDate()).slice(-2));
	   	return (monthNames[dt.getMonth()] + ' ' + ('' + dt.getDate()).slice(-2));
	}

	public getFormattedDateMDY(date: any){
		let dt= new Date(date);
		let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	   	return (monthNames[dt.getMonth()] + ' ' + ('0' + dt.getDate()).slice(-2) + ', ' + dt.getFullYear());

	   	//return (('0' + (dt.getMonth()+1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2)+ '-' + dt.getFullYear());
	}

	public getFormattedPhoneNumber(phone: any){
		if(this.isUndefined(phone)){
 			return "";
		} else {
		    let numbers = phone.replace(/\D/g, ''),
		        char = { 0: '(', 3: ') ', 6: '-' };

		    phone = '';
		    for (let i = 0; i < numbers.length; i++) {
		        phone += (char[i] || '') + numbers[i];
		    }
		    return phone;
		}
	}

	public calculateYears(months: any){
		let year = (months/12);
		let intYear = Math.trunc(year);
		months = (Number((year-intYear).toFixed(2))*12).toFixed();
		if(months != 0 && intYear != 0){
			return intYear + "yr " + months + "mth";
		} else if(months == 0){
			return intYear + "yr";
		} else if(year == 0){
			return months + "mth";
		}
	}

	public getDateByTimestamp(timestamp: any){
		return new Date(parseInt(timestamp)).toString();
	}

	public getCurrentTimeZoneDate(timestamp: any){
		return (this.getFullFormattedDate(new Date(parseInt(timestamp)).toString()));
	}

	public getUTCTime(dtstr: any){
		return "";
	}

	public getFormattedDateFB(date_str: string){
		if (!date_str) {
			return;
		}
	    date_str = $.trim(date_str);
	    date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
	    date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
	    date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
	    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
	    let parsed_date = new Date(date_str);
	    let relative_to = new Date(); //defines relative to what ..default is now

	    let diff = relative_to.getTime()-parsed_date.getTime();

	    let delta = new Number(Math.floor((diff)/1000));
	    delta=(delta<2)?2:delta;

	    let r = '';
	    if (delta < 60) {
	    	r = delta + ' seconds ago';
	    } else if(delta < 120) {
	    	r = 'a minute ago';
	    } else if(delta < (60*60)) {
	    	let division = new Number(Math.floor(delta.valueOf()/60));
	    	r = division + ' minutes ago';
	    } else if(delta < (2*60*60)) {
	    	r = 'an hour ago';
	    }  else if(delta < (24*60*60)) {
	    	let division = new Number(Math.floor((delta.valueOf())/3600));
	    	r = division + ' hours ago';
	    }  else if(delta < (48*60*60)) {
	    	r = 'Yesterday ' + this.convertTimeAMPM(date_str);
	    }  else {
	    	r = this.getFormattedDateMD(parsed_date) + ' at ' + this.convertTimeAMPM(parsed_date);
	    }
	    // else {
	    // 	let division = new Number(Math.floor((delta.valueOf())/86400));
	    // 	r = division + ' days ago';
	    // }
	    return r;	
	}

	public convertTimeAMPM(dt) {
        let date = '';
        if (dt) {
            let c_date = new Date(dt);
            let hrs = c_date.getHours();
            let min = (c_date.getMinutes()<10?'0':'') + c_date.getMinutes();
            
            let type = (hrs <= 12) ? " AM" : " PM";
            date = ((+hrs % 12) || hrs) + ":" + min + type;
        }
        return date;
    }
 
    public getDayDiffFromTwoDate(firstDate: any, secondDate: any) {
        let dayDiff = (secondDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
        return dayDiff;
    }

	public sendEmail(emailUser: any) {
        let body = JSON.stringify(emailUser);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(GlobalVariable.BASE_API_URL + GlobalVariable.SEND_EMAIL, body, options)
            .map((data: any) => {
                data.json();
                return data.json();
            }); 
    }

    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    public calDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
      	let R = 6371; // km
      	let dLat = this.toRad(lat2-lat1);
      	let dLon = this.toRad(lon2-lon1);
      	let radlat1 = this.toRad(lat1);
      	let radlat2 = this.toRad(lat2);

      	let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(radlat1) * Math.cos(radlat2); 
      	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      	let d = R * c;
      	return d;
    }

    // Converts numeric degrees to radians
    public toRad(Value: any) {
        return Value * Math.PI / 180;
    }

    public isUndefined(obj: any){
    	if(typeof obj == 'undefined' || obj == null || obj == ''){
    		return true;
    	} else {
    		return false;
    	}
    }

    public getSelectedFromMultiselect(object: any){
    	let array: string[] = [];

    	for (let key in object) {
           if(object[key].checked && object[key].checked == true){
           		array.push(object[key].value);
           }
        }

        return array;
    }

    public getArrayFromString(object: string){
        let array: string[] = [];

        let items = object.slice(1, -1).split(',');
        for (let k in items){
            console.log(' items[k] ' + JSON.stringify(items[k]).replace(/['"]+/g, '').slice(1, -1));
            array.push(JSON.stringify(items[k]).replace(/['"]+/g, '').slice(1, -1));
        }

        return array;
    }

    public isNumberKey(event: any){
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
          event.preventDefault();
        }
    }

    public getVisitorLocationDetails(callback: any){
    	$.get("https://ip-api.com/json", function(response) {
            callback(response);
        }, "jsonp");
    }

    public getPropertyTypeFromParam(type: any){
    	if(type == "apartments-for-rent"){
    		return "Apartment";
    	} if(type == "houses-for-rent"){
    		return "House";
    	} if(type == "rooms-for-rent"){
    		return "Room";
    	} if(type == "rentals"){
    		return "Other";
    	} else {
    		return "";
    	}
    }

    public getParamFromPropertyType(type: any){
    	if(type == "Apartment"){
    		return "apartments-for-rent";
    	} if(type == "House"){
    		return "houses-for-rent";
    	} if(type == "Room"){
    		return "rooms-for-rent";
    	} else {
    		return "rentals";
    	}
    }

    public getPropertyIdFromTitle(listingTitle: any){
    	let titleArray = listingTitle.split('-');
    	return titleArray[titleArray.length-1];
    }

    public getTitleByUrl(url: any){
    	let urlArray = url.urlAfterRedirects.split("/");
    	let city = this.capitalizeFirstLetter(urlArray[1]);
		console.log(' 111 city ' + city);
		city = (city.toUpperCase() == "ACTIVATE")? "" : city;
    	if(urlArray.length == 2 && urlArray[1] == ""){
    		return "MapRentals.ca Winnipeg Apartments & Houses For Rent";	
    	} else if(urlArray.length == 2 && urlArray[1] != ""){
    		return  city + " Apartments For Rent, Houses For Rent, Rooms & Condos";	
    	} else if(urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'apartments-for-rent'){
    		return  city + " Apartments For Rent: Post/Find An Apartment Online Free";	
    	} else if(urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'houses-for-rent'){
    		return  city + " Houses For Rent: Post Free Rental, Find A House to Rent";	
    	} else if(urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'rooms-for-rent'){
    		return  city + " Rooms For Rent: Find a Room - Shared Accommodations";	
    	} else if(urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'rentals'){
    		return  city + " Rentals: Homes, Rent Out Condos, Apartments For Rent";	
    	} else {
    		return "MapRentals.ca Winnipeg Apartments & Houses For Rent";
    	}
    }

    public getDescriptionByUrl(url: any){
    	let urlArray = url.urlAfterRedirects.split("/");
    	let city = this.capitalizeFirstLetter(urlArray[1]);
    	if(urlArray.length == 2 && urlArray[1] == ""){
    		return "MapRentals.ca, post free listings (property management companies, private owners & landlords). View apartments for rent in Winnipeg, houses for rent, search condo rentals, duplexes, townhouses, or find a room to rent.";	
    	} else if(urlArray.length == 2 && urlArray[1] != ""){
    		return  city + " apartments for rent, houses for rent, rooms & condos. Find a 1 bedroom, 2 bedrooms, 3 br. or place to rent with 4 bedrooms. Landlords (pvt. owners), property management companies list free online in " + city + ".";	
    	} else if(urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'apartments-for-rent'){
    		return  city + " Apartments for rent in "+ city +". Find a 1 BR., 2 Bedroom, 3 Bedrooms and 4 bedroom apartments for rent. Landlords (pvt. owners), and property management companies list an apartment online free in" + city + ".";	
    	} else if(urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'houses-for-rent'){
    		return  city + " Houses for rent in "+ city +". Find a 1 bedroom home., 2 BR., 3 Bedrooms, 4 BR. & 5 bedroom homes to rent out. Landlords (private owners), and property management companies post free "+ city +" house rentals.";	
    	} else if(urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'rooms-for-rent'){
    		return  city + " Rooms for rent in "+ city +". Find people looking to find a roommate (shared accommodation) in a house, apartment, condo, duplex or townhouse. Post online free "+ city +" room for rent.";	
    	} else if(urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'rentals'){
    		return  city + " Rentals. Search & Find a Place to Rent (Apartment, Condo, House). Post Property Free Online in Any Area. St. James, Seven Oaks, River East, Transcona, St. Boniface, St. Vital, Fort Garry, River Heights, Downtown, Point Douglas, Inkster.";	
    	} else {
    		return "MapRentals.ca "+ city +" Apartments & Houses For Rent";
    	}
    }

    public capitalizeFirstLetter(string: any){
    	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    public getPropertyDetailsUrl(Address, PropertyType, Title, Id){
    	return "/" + this.convertUrlString(this.getCityFromAddress(Address)) + "/" + this.getParamFromPropertyType(PropertyType) + "/" + this.convertUrlString(Title) + "-" + Id;
    }
    
    public getTitleForFullListing(prop: any){
    	let TITLE = "";
    	TITLE += this.getCityFromAddress(prop.Address) + " ";
    	TITLE += prop.PropertyType + " For Rent: ";
    	TITLE += this.getStreetFromAddress(prop.Address) + ", ";
    	TITLE += (prop.PropertyType == 'Room'?"": prop.Bed + "br, ");
    	TITLE += ((prop.Pet.length == 0 || prop.Pet.indexOf('No') >= 0)? "No Pets" : "Pet-friendly");

    	return TITLE;
    }

    public getDescriptionForFullListing(prop: any){
    	let DESCRIPTION = "";
    	DESCRIPTION += prop.PropertyType + " Rental: ";
    	DESCRIPTION += this.getCityFromAddress(prop.Address) + ": ";
    	DESCRIPTION += prop.Title + ". ";
    	DESCRIPTION += (prop.Description.length < 155 )? prop.Description + ". " : prop.Description.slice(0,155) + "....";

    	return DESCRIPTION;
    }

	public getSortedPicturesList(Pictures: any){
		let THIS = this;
		let picsList: any[] = [];
		if(Pictures.length == 0){
			return picsList;
		} else {
			$.each(Pictures, function (i, pics) {
				if(THIS.isUndefined(pics.Index) || pics.Index == 0){
					picsList.push(pics); 
				} else {
					$.each(Pictures, function (j, pics2) {
						if((i + 1) == pics2.Index){
							picsList.push(pics2); 
						}
					});
				}
			});
			return picsList;
		}
	}
}

interface Wrapped<T> {
    valueOf(): T;
}

class NumberWrapper {
    constructor(public value: number) {}
    valueOf(): number { return this.value; }
}