"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var angular2_cool_storage_1 = require('angular2-cool-storage');
var LoginModalComponent = (function () {
    function LoginModalComponent(route, router, accountService, http, localStorage, commonAppService, renderer) {
        this.route = route;
        this.router = router;
        this.accountService = accountService;
        this.http = http;
        this.commonAppService = commonAppService;
        this.renderer = renderer;
        this.visible = false;
        this.visibleAnimate = false;
        this.login_success_msg = '';
        this.login_fail_msg = '';
        this.isLoginByRentalLink = true;
        this.localStorage = localStorage;
        console.log(' constructor call ');
    }
    LoginModalComponent.prototype.putCookie = function (key, value) {
        console.log(' key ' + JSON.stringify(key));
        console.log(' value ' + JSON.stringify(value));
        this.localStorage.setObject(key, value);
        //return this.cookieService.putObject(key, value);
    };
    LoginModalComponent.prototype.ngOnInit = function () {
        this.user = {
            Id: 0,
            email: '',
            password: '',
            confirmpassword: ''
        };
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        //this.router.navigateByUrl('/');
    };
    LoginModalComponent.prototype.show = function (flag) {
        var _this = this;
        this.isLoginByRentalLink = flag;
        this.visible = true;
        setTimeout(function () { return _this.visibleAnimate = true; });
    };
    LoginModalComponent.prototype.hide = function () {
        var _this = this;
        this.visibleAnimate = false;
        setTimeout(function () { return _this.visible = false; }, 300);
    };
    LoginModalComponent.prototype.openModal = function (id) {
        this.hide();
        document.getElementById(id).click();
    };
    LoginModalComponent.prototype.login = function (event, model, isValid) {
        var _this = this;
        event.preventDefault();
        console.log('model, isValid ' + model, isValid);
        if (isValid) {
            this.accountService.login(model.email, model.password)
                .subscribe(function (data) {
                console.log(' data ' + JSON.stringify(data));
                if (data.Success == true) {
                    _this.login_success_msg = 'Login Successfull';
                    _this.login_fail_msg = '';
                    //this.putCookie('currentUser', data.Response);
                    _this.localStorage.setObject('currentUser', data.Response);
                    _this.hide();
                    _this.commonAppService.setCurrentUser(data.Response);
                    console.log(' this.isLoginByRentalLink ' + _this.isLoginByRentalLink);
                    if (_this.isLoginByRentalLink == false) {
                        window.location.href = "myrentals/true";
                    }
                    else {
                        window.location.href = "manageProperty/new/true";
                    }
                }
                else {
                    _this.login_fail_msg = data.Response;
                    _this.login_success_msg = '';
                }
            }, function (error) {
                console.log(' Error while login ' + JSON.stringify(error));
                _this.login_fail_msg = error.Response;
                _this.login_success_msg = '';
            });
        }
    };
    __decorate([
        core_1.ViewChild('homeBtn')
    ], LoginModalComponent.prototype, "homeBtn");
    LoginModalComponent = __decorate([
        core_1.Component({
            moduleId: "lmodalModule",
            selector: 'lmodal',
            templateUrl: './loginModal.component.html',
            providers: [angular2_cool_storage_1.CoolLocalStorage]
        }),
        __param(6, core_1.Inject(core_1.Renderer))
    ], LoginModalComponent);
    return LoginModalComponent;
}());
exports.LoginModalComponent = LoginModalComponent;
