import { Component, OnInit, ViewChild, Input, Output, EventEmitter, Inject, Renderer, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ROUTES } from './navbar-routes.config';
import { MenuType } from './navbar.metadata';
import { User } from '../../components/models/user';

import { UserService, AccountService, CommonAppService } from '../../services/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  moduleId: "navbarModule",
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [
    CommonAppService,
    AccountService,
    CoolLocalStorage
  ]
})

export class NavbarComponent implements OnInit {

  public menuItems: any[];
  public userMenus: any[];
  public brandMenu: any;
  public userMenuTitle: string = "Hi, ";
  isCollapsed = true;
  public isLoginByRentalLink: boolean = true;
  public isOpenLoginModal: boolean = false;

  @ViewChild('navbarbrand')
  public navbarbrand: any;

  @ViewChild('maprentalsNavbarBtn')
  public maprentalsNavbarBtn: any;

  @ViewChild("Search")
  public searchElementRef: ElementRef;

  currentUser: any;
  users: User[] = [];
  localStorage: CoolLocalStorage;
  //router : Router;

  constructor(localStorage: CoolLocalStorage,
    public route: ActivatedRoute,
    public router: Router,
    public renderer: Renderer,
    public accountService: AccountService,
    public commonAppService: CommonAppService) {
    this.localStorage = localStorage;
    this.isOpenLoginModal = route.snapshot.params['login'];
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem.menuType === MenuType.UNAUTH);
    this.userMenus = ROUTES.filter(menuItem => menuItem.menuType === MenuType.AUTH);
    this.brandMenu = ROUTES.filter(menuItem => menuItem.menuType === MenuType.BRAND)[0];

    this.currentUser = this.commonAppService.getCurrentUser();
    if (!this.commonAppService.isUndefined(this.currentUser)) {
      this.userMenuTitle = 'Hi, ' + this.currentUser.Email.substring(0, 8);
    }
  }

  public get menuIcon(): string {
    return this.isCollapsed ? '☰' : '✖';
  }

  public getMenuItemClasses(menuItem: any) {
    return {
      'pull-xs-right': this.isCollapsed && menuItem.menuType === MenuType.UNAUTH
    };
  }

  public getUserMenuClasses(menuItem: any) {
    return {
      'pull-xs-right': this.isCollapsed && menuItem.menuType === MenuType.AUTH
    };
  }

  checkAuth(event: any) {
    this.isLoginByRentalLink = true;
    this.isCollapsed = false;
    event = window.event;
    if (this.currentUser == null) {
      event.preventDefault();
			event.stopPropagation();
      $('#maprentalsNavbarBtn').click();
      $('.navbar-collapse').addClass('collapse');
      this.openModal('loginModalBtn');
    } else {
      // event.startPropagation();
      window.location.assign('manageProperty/new/true');
      // setTimeout(function(){document.location.href = "manageProperty/new/true";},250);
      
      // window.location.href = "manageProperty/new/true";
      
    }
  }

  login() {
    this.isLoginByRentalLink = false;
    $('#maprentalsNavbarBtn').click();
    $('.navbar-collapse').addClass('collapse');
    this.isCollapsed = true;
    this.openModal('loginModalBtn');
  }

  openModal(ButtonId: string) {
    $('#'+ButtonId).click();
    // document.getElementById(ButtonId).click();
  }

  logout(event: any) {
    
    event.stopPropagation();
    this.localStorage.removeItem('currentUser');
    this.goToHomePage();
    window.location.assign('/');
    // event.startPropagation();
    // this.renderer.invokeElementMethod(this.navbarbrand.nativeElement, 'click', []);
  }

  goToHomePage() {
    console.log(' goToHomePage called');
    this.localStorage.removeItem('storageFilters');
    this.localStorage.removeItem('storageMap');
    // this.router.navigate( [
    //   'home', { }
    // ]);
  }
}
