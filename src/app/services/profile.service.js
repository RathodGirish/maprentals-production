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
var ProfileService = (function () {
    function ProfileService(http) {
        this.http = http;
    }
    ProfileService.prototype.getProfileById = function (Id) {
        return this.http.get(static_variable_1.GlobalVariable.BASE_API_URL + static_variable_1.GlobalVariable.GET_PROFILE_BY_ID + '/' + Id)
            .map(function (data) {
            data.json();
            return data.json();
        });
    };
    ProfileService.prototype.updateProfile = function (profile) {
        var body = JSON.stringify(profile);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(static_variable_1.GlobalVariable.BASE_API_URL + static_variable_1.GlobalVariable.UPDATE_PROFILE, body, options)
            .map(function (data) {
            data.json();
            return data.json();
        });
    };
    ProfileService.prototype.updatePassword = function (profile) {
        var body = JSON.stringify(profile);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(static_variable_1.GlobalVariable.BASE_API_URL + static_variable_1.GlobalVariable.UPDATE_PASSWORD, body, options)
            .map(function (data) {
            data.json();
            return data.json();
        });
    };
    ProfileService = __decorate([
        core_1.Injectable()
    ], ProfileService);
    return ProfileService;
}());
exports.ProfileService = ProfileService;
