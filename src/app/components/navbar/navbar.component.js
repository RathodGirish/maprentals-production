"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var navbar_routes_config_1 = require('./navbar-routes.config');
var navbar_metadata_1 = require('./navbar.metadata');
var loginModal_component_1 = require('../../components/popup-modals/loginModal.component');
var angular2_cool_storage_1 = require('angular2-cool-storage');
var NavbarComponent = (function () {
    //router : Router;
    function NavbarComponent(localStorage, route, router, renderer, accountService, commonAppService) {
        this.route = route;
        this.router = router;
        this.renderer = renderer;
        this.accountService = accountService;
        this.commonAppService = commonAppService;
        this.userMenuTitle = "Hi, ";
        this.isCollapsed = true;
        this.isLoginByRentalLink = true;
        this.isOpenLoginModal = false;
        this.users = [];
        this.localStorage = localStorage;
        console.log(' currentUser ' + JSON.stringify(this.currentUser));
        this.isOpenLoginModal = route.snapshot.params['login'];
        //console.log('navbar this.isOpenLoginModal ' + this.isOpenLoginModal);
    }
    NavbarComponent.prototype.ngOnInit = function () {
        this.menuItems = navbar_routes_config_1.ROUTES.filter(function (menuItem) { return menuItem.menuType === navbar_metadata_1.MenuType.UNAUTH; });
        this.userMenus = navbar_routes_config_1.ROUTES.filter(function (menuItem) { return menuItem.menuType === navbar_metadata_1.MenuType.AUTH; });
        this.brandMenu = navbar_routes_config_1.ROUTES.filter(function (menuItem) { return menuItem.menuType === navbar_metadata_1.MenuType.BRAND; })[0];
        //this.currentUser = this.localStorage.getObject('currentUser');
        this.currentUser = this.commonAppService.getCurrentUser();
        console.log(' this.commonAppService.getCurrentUser ' + JSON.stringify(this.commonAppService.getCurrentUser()));
        if (!this.commonAppService.isUndefined(this.currentUser)) {
            this.userMenuTitle = 'Hi, ' + this.currentUser.Email.substring(0, 8);
        }
        console.log(' currentUser ' + JSON.stringify(this.currentUser));
    };
    Object.defineProperty(NavbarComponent.prototype, "menuIcon", {
        get: function () {
            return this.isCollapsed ? '☰' : '✖';
        },
        enumerable: true,
        configurable: true
    });
    NavbarComponent.prototype.getMenuItemClasses = function (menuItem) {
        return {
            'pull-xs-right': this.isCollapsed && menuItem.menuType === navbar_metadata_1.MenuType.UNAUTH
        };
    };
    NavbarComponent.prototype.getUserMenuClasses = function (menuItem) {
        return {
            'pull-xs-right': this.isCollapsed && menuItem.menuType === navbar_metadata_1.MenuType.AUTH
        };
    };
    NavbarComponent.prototype.checkAuth = function (event) {
        this.isLoginByRentalLink = true;
        event.stopPropagation();
        this.isCollapsed = false;
        console.log(' checkAuth call1 ' + this.currentUser);
        if (this.currentUser == null) {
            document.getElementById('maprentalsNavbarBtn').click();
            this.openModal('loginModalBtn');
        }
        else {
            //this.router.navigateByUrl('/test', true);
            //this.router.navigate(['/manageProperty/' + 'new'], true);
            window.location.href = "manageProperty/new/true";
        }
    };
    NavbarComponent.prototype.login = function () {
        this.isLoginByRentalLink = false;
        document.getElementById('maprentalsNavbarBtn').click();
        this.openModal('loginModalBtn');
    };
    NavbarComponent.prototype.openModal = function (ButtonId) {
        document.getElementById(ButtonId).click();
    };
    NavbarComponent.prototype.logout = function (event) {
        event.stopPropagation();
        this.localStorage.removeItem('currentUser');
        this.renderer.invokeElementMethod(this.navbarbrand.nativeElement, 'click', []);
    };
    NavbarComponent.prototype.goToHomePage = function () {
        this.localStorage.removeItem('storageFilters');
        this.localStorage.removeItem('storageMap');
        // this.router.navigate( [
        //   'home', { }
        // ]);
    };
    __decorate([
        core_1.ViewChild(loginModal_component_1.LoginModalComponent)
    ], NavbarComponent.prototype, "modal");
    __decorate([
        core_1.ViewChild('navbarbrand')
    ], NavbarComponent.prototype, "navbarbrand");
    __decorate([
        core_1.ViewChild('maprentalsNavbarBtn')
    ], NavbarComponent.prototype, "maprentalsNavbarBtn");
    __decorate([
        core_1.ViewChild("Search")
    ], NavbarComponent.prototype, "searchElementRef");
    NavbarComponent = __decorate([
        core_1.Component({
            moduleId: "navbarModule",
            selector: 'navbar',
            templateUrl: './navbar.component.html',
            styleUrls: ['./navbar.component.css'],
            providers: [angular2_cool_storage_1.CoolLocalStorage]
        })
    ], NavbarComponent);
    return NavbarComponent;
}());
exports.NavbarComponent = NavbarComponent;
