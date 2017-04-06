"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var static_variable_1 = require('../services/static-variable');
var CommonAppService = (function () {
    function CommonAppService(http, localStorage) {
        this.http = http;
        this.localStorage = localStorage;
        console.log(' CommonService call');
    }
    CommonAppService.prototype.getCurrentUser = function () {
        //this.currentUser = this.localStorage.getObject('currentUser');
        console.log(' in CommonService ' + this.localStorage.getObject('currentUser'));
        if (!this.isUndefined(this.localStorage.getObject('currentUser'))) {
            return this.localStorage.getObject('currentUser');
        }
        else if (!this.isUndefined(this.currentUser)) {
            return this.currentUser;
        }
        return null;
    };
    CommonAppService.prototype.setCurrentUser = function (user) {
        //this.currentUser = this.localStorage.getObject('currentUser');
        this.currentUser = user;
    };
    CommonAppService.prototype.mergeObjects = function (obj1, obj2, callback) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        callback(obj3);
    };
    CommonAppService.prototype.getFormattedAddress = function (place) {
        var street_number = "", name = "", address = "", city = "", state = "", zip = "", country = "", formattedAddress = "";
        for (var i = 0; i < place.address_components.length; i++) {
            var addr = place.address_components[i];
            if (addr.types[0] == 'street_number')
                street_number = addr.short_name;
            else if (addr.types[0] == 'country')
                country = addr.long_name;
            else if (addr.types[0] == 'street_address')
                address = address + addr.long_name;
            else if (addr.types[0] == 'establishment')
                address = address + addr.long_name;
            else if (addr.types[0] == 'route')
                address = address + addr.long_name;
            else if (addr.types[0] == 'postal_code')
                zip = addr.short_name;
            else if (addr.types[0] == ['administrative_area_level_1'])
                state = addr.short_name;
            else if (addr.types[0] == ['locality'])
                city = addr.long_name;
        }
        if (street_number != "") {
            name = street_number + ", ";
        }
        else if (place.name && place.name != "") {
            name = place.name + ", ";
        }
        formattedAddress = name + address + ", " + city + ", " + state;
        var array = formattedAddress.split(',');
        var newArray = array.filter(function (v) { return v !== ''; });
        if (address == '' && city == '') {
            return "";
        }
        return formattedAddress;
    };
    CommonAppService.prototype.formateAddress = function (address) {
        if (address != null && address.match(/,/g).length >= 3) {
            address = address.replace(',', '');
        }
        var array = address.split(' ');
        var newAddress = "";
        for (var i = array.length - 1; 0 <= i; i--) {
            if (newAddress.indexOf(array[i]) < 0) {
                newAddress = array[i] + " " + newAddress;
            }
        }
        return newAddress;
    };
    CommonAppService.prototype.getCityFromAddress = function (address) {
        if (address != null) {
            var arr = address.split(',');
            return arr[arr.length - 2].replace(/ /g, '');
        }
        return "";
    };
    CommonAppService.prototype.getStreetAndCityFromAddress = function (address) {
        if (address != null) {
            var arr = address.split(',');
            return (arr[arr.length - 2] + ', ' + arr[arr.length - 3]);
        }
        return "";
    };
    CommonAppService.prototype.getStreetFromAddress = function (address) {
        if (address != null) {
            var arr = address.split(',');
            return (arr[0] + arr[1]);
        }
        return "";
    };
    CommonAppService.prototype.convertUrlString = function (string) {
        return string.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
    };
    CommonAppService.prototype.getFormattedDate = function (date) {
        var dt = new Date(date);
        return (dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2));
    };
    CommonAppService.prototype.getFormattedDateMD = function (date) {
        var dt = new Date(date);
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return (monthNames[dt.getMonth()] + ' ' + ('0' + dt.getDate()).slice(-2));
    };
    CommonAppService.prototype.getFormattedDateMDY = function (date) {
        var dt = new Date(date);
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return (monthNames[dt.getMonth()] + ' ' + ('0' + dt.getDate()).slice(-2) + ', ' + dt.getFullYear());
        //return (('0' + (dt.getMonth()+1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2)+ '-' + dt.getFullYear());
    };
    CommonAppService.prototype.getFormattedPhoneNumber = function (phone) {
        var numbers = phone.replace(/\D/g, ''), char = { 0: '(', 3: ') ', 6: '-' };
        phone = '';
        for (var i = 0; i < numbers.length; i++) {
            phone += (char[i] || '') + numbers[i];
        }
        return phone;
    };
    CommonAppService.prototype.calculateYears = function (months) {
        var year = (months / 12);
        var intYear = Math.trunc(year);
        months = (Number((year - intYear).toFixed(2)) * 12).toFixed();
        if (months != 0 && intYear != 0) {
            return intYear + "yr " + months + "mth";
        }
        else if (months == 0) {
            return intYear + "yr";
        }
        else if (year == 0) {
            return months + "mth";
        }
    };
    CommonAppService.prototype.getFormattedDateFB = function (date_str) {
        if (!date_str) {
            return;
        }
        date_str = $.trim(date_str);
        date_str = date_str.replace(/\.\d\d\d+/, ""); // remove the milliseconds
        date_str = date_str.replace(/-/, "/").replace(/-/, "/"); //substitute - with /
        date_str = date_str.replace(/T/, " ").replace(/Z/, " UTC"); //remove T and substitute Z with UTC
        date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // +08:00 -> +0800
        var parsed_date = new Date(date_str);
        var relative_to = new Date(); //defines relative to what ..default is now
        var diff = relative_to.getTime() - parsed_date.getTime();
        var delta = new Number(Math.floor((diff) / 1000));
        delta = (delta < 2) ? 2 : delta;
        var r = '';
        if (delta < 60) {
            r = delta + ' seconds ago';
        }
        else if (delta < 120) {
            r = 'a minute ago';
        }
        else if (delta < (45 * 60)) {
            var division = new Number(Math.floor((delta.valueOf()) / 1000));
            r = division + ' minutes ago';
        }
        else if (delta < (2 * 60 * 60)) {
            r = 'an hour ago';
        }
        else if (delta < (24 * 60 * 60)) {
            var division = new Number(Math.floor((delta.valueOf()) / 3600));
            r = division + ' hours ago';
        }
        else if (delta < (48 * 60 * 60)) {
            r = 'Yesterday ' + this.convertTimeAMPM(date_str);
        }
        else {
            r = this.getFormattedDateMD(parsed_date) + ' at ' + this.convertTimeAMPM(parsed_date);
        }
        // else {
        // 	let division = new Number(Math.floor((delta.valueOf())/86400));
        // 	r = division + ' days ago';
        // }
        return r;
    };
    CommonAppService.prototype.convertTimeAMPM = function (dt) {
        var date = '';
        if (dt) {
            var c_date = new Date(dt);
            var hrs = c_date.getHours();
            var min = c_date.getMinutes();
            if (isNaN(hrs) || isNaN(min)) {
                return null;
            }
            var type = (hrs <= 12) ? " AM" : " PM";
            date = ((+hrs % 12) || hrs) + ":" + min + type;
        }
        return date;
    };
    CommonAppService.prototype.getDayDiffFromTwoDate = function (firstDate, secondDate) {
        var dayDiff = (secondDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
        return dayDiff;
    };
    CommonAppService.prototype.sendEmail = function (emailUser) {
        var body = JSON.stringify(emailUser);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(static_variable_1.GlobalVariable.BASE_API_URL + static_variable_1.GlobalVariable.SEND_EMAIL, body, options)
            .map(function (data) {
            data.json();
            return data.json();
        });
    };
    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    CommonAppService.prototype.calDistance = function (lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = this.toRad(lat2 - lat1);
        var dLon = this.toRad(lon2 - lon1);
        var radlat1 = this.toRad(lat1);
        var radlat2 = this.toRad(lat2);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radlat1) * Math.cos(radlat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    };
    // Converts numeric degrees to radians
    CommonAppService.prototype.toRad = function (Value) {
        return Value * Math.PI / 180;
    };
    CommonAppService.prototype.isUndefined = function (obj) {
        if (typeof obj == 'undefined' || obj == null || obj == '') {
            return true;
        }
        else {
            return false;
        }
    };
    CommonAppService.prototype.getSelectedFromMultiselect = function (object) {
        var array = [];
        for (var key in object) {
            if (object[key].checked && object[key].checked == true) {
                array.push(object[key].value);
            }
        }
        return array;
    };
    CommonAppService.prototype.getArrayFromString = function (object) {
        var array = [];
        var items = object.slice(1, -1).split(',');
        for (var k in items) {
            console.log(' items[k] ' + JSON.stringify(items[k]).replace(/['"]+/g, '').slice(1, -1));
            array.push(JSON.stringify(items[k]).replace(/['"]+/g, '').slice(1, -1));
        }
        return array;
    };
    CommonAppService.prototype.isNumberKey = function (event) {
        var pattern = /[0-9\+\-\ ]/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    };
    CommonAppService.prototype.getVisitorLocationDetails = function (callback) {
        $.get("https://ip-api.com/json", function (response) {
            callback(response);
        }, "jsonp");
    };
    CommonAppService.prototype.getPropertyTypeFromParam = function (type) {
        if (type == "apartments-for-rent") {
            return "Apartment";
        }
        if (type == "houses-for-rent") {
            return "House";
        }
        if (type == "rooms-for-rent") {
            return "Room";
        }
        if (type == "rentals") {
            return "Other";
        }
        else {
            return "";
        }
    };
    CommonAppService.prototype.getParamFromPropertyType = function (type) {
        if (type == "Apartment") {
            return "apartments-for-rent";
        }
        if (type == "House") {
            return "houses-for-rent";
        }
        if (type == "Room") {
            return "rooms-for-rent";
        }
        else {
            return "rentals";
        }
    };
    CommonAppService.prototype.getPropertyIdFromTitle = function (listingTitle) {
        var titleArray = listingTitle.split('-');
        return titleArray[titleArray.length - 1];
    };
    CommonAppService.prototype.getTitleByUrl = function (url) {
        var urlArray = url.urlAfterRedirects.split("/");
        var city = this.capitalizeFirstLetter(urlArray[1]);
        if (urlArray.length == 2 && urlArray[1] == "") {
            return "MapRentals.ca Winnipeg Apartments & Houses For Rent";
        }
        else if (urlArray.length == 2 && urlArray[1] != "") {
            return city + " Apartments For Rent, Houses For Rent, Rooms & Condos";
        }
        else if (urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'apartments-for-rent') {
            return city + " Apartments For Rent: Post/Find An Apartment Online Free";
        }
        else if (urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'houses-for-rent') {
            return city + " Houses For Rent: Post Free Rental, Find A House to Rent";
        }
        else if (urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'rooms-for-rent') {
            return city + " Rooms For Rent: Find a Room - Shared Accommodations";
        }
        else if (urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'rentals') {
            return city + " Rentals: Homes, Rent Out Condos, Apartments For Rent";
        }
        else {
            return "MapRentals.ca Winnipeg Apartments & Houses For Rent";
        }
    };
    CommonAppService.prototype.getDescriptionByUrl = function (url) {
        var urlArray = url.urlAfterRedirects.split("/");
        var city = this.capitalizeFirstLetter(urlArray[1]);
        if (urlArray.length == 2 && urlArray[1] == "") {
            return "MapRentals.ca, post free listings (property management companies, private owners & landlords). View apartments for rent in Winnipeg, houses for rent, search condo rentals, duplexes, townhouses, or find a room to rent.";
        }
        else if (urlArray.length == 2 && urlArray[1] != "") {
            return city + " apartments for rent, houses for rent, rooms & condos. Find a 1 bedroom, 2 bedrooms, 3 br. or place to rent with 4 bedrooms. Landlords (pvt. owners), property management companies list free online in " + city + ".";
        }
        else if (urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'apartments-for-rent') {
            return city + " Apartments for rent in " + city + ". Find a 1 BR., 2 Bedroom, 3 Bedrooms and 4 bedroom apartments for rent. Landlords (pvt. owners), and property management companies list an apartment online free in" + city + ".";
        }
        else if (urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'houses-for-rent') {
            return city + " Houses for rent in " + city + ". Find a 1 bedroom home., 2 BR., 3 Bedrooms, 4 BR. & 5 bedroom homes to rent out. Landlords (private owners), and property management companies post free " + city + " house rentals.";
        }
        else if (urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'rooms-for-rent') {
            return city + " Rooms for rent in " + city + ". Find people looking to find a roommate (shared accommodation) in a house, apartment, condo, duplex or townhouse. Post online free " + city + " room for rent.";
        }
        else if (urlArray.length == 3 && urlArray[1] != "" && urlArray[2] == 'rentals') {
            return city + " Rentals. Search & Find a Place to Rent (Apartment, Condo, House). Post Property Free Online in Any Area. St. James, Seven Oaks, River East, Transcona, St. Boniface, St. Vital, Fort Garry, River Heights, Downtown, Point Douglas, Inkster.";
        }
        else {
            return "MapRentals.ca " + city + " Apartments & Houses For Rent";
        }
    };
    CommonAppService.prototype.capitalizeFirstLetter = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
    CommonAppService.prototype.getPropertyDetailsUrl = function (Address, PropertyType, Title, Id) {
        return "/" + this.convertUrlString(this.getCityFromAddress(Address)) + "/" + this.getParamFromPropertyType(PropertyType) + "/" + this.convertUrlString(Title) + "-" + Id;
    };
    CommonAppService.prototype.getTitleForFullListing = function (prop) {
        var TITLE = "";
        TITLE += this.getCityFromAddress(prop.Address) + " ";
        TITLE += prop.PropertyType + " For Rent: ";
        TITLE += this.getStreetFromAddress(prop.Address) + ", ";
        TITLE += (prop.PropertyType == 'Room' ? "" : prop.Bed + "br, ");
        TITLE += ((prop.Pet.length == 0 || prop.Pet.indexOf('No') >= 0) ? "No Pets" : "Pet-friendly");
        return TITLE;
    };
    CommonAppService.prototype.getDescriptionForFullListing = function (prop) {
        var DESCRIPTION = "";
        DESCRIPTION += prop.PropertyType + " Rental: ";
        DESCRIPTION += this.getCityFromAddress(prop.Address) + ": ";
        DESCRIPTION += prop.Title + ". ";
        DESCRIPTION += (prop.Description.length < 155) ? prop.Description + ". " : prop.Description.slice(0, 155) + "....";
        return DESCRIPTION;
    };
    CommonAppService = __decorate([
        core_1.Injectable()
    ], CommonAppService);
    return CommonAppService;
}());
exports.CommonAppService = CommonAppService;
var NumberWrapper = (function () {
    function NumberWrapper(value) {
        this.value = value;
    }
    NumberWrapper.prototype.valueOf = function () { return this.value; };
    return NumberWrapper;
}());
