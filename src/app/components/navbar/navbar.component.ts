import { Component, OnInit, ViewChild, Input, Output, EventEmitter, Inject, Renderer, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ROUTES } from './navbar-routes.config';
import { MenuType } from './navbar.metadata';
import { User } from '../../components/models/user';
import { LoginModalComponent } from '../../components/popup-modals/loginModal.component';
import { RegistrationModalComponent } from '../../components/popup-modals/registrationModal.component';

import { UserService, AccountService, CommonAppService } from '../../services/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  moduleId: "navbarModule",
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.css' ],
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
  public isLoginByRentalLink: boolean= true;
  public isOpenLoginModal : boolean = false;

  @ViewChild(LoginModalComponent)
  public lmodal: LoginModalComponent;

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
    console.log(' currentUser ' + JSON.stringify(this.currentUser));
    this.isOpenLoginModal  = route.snapshot.params['login'];
    //console.log('navbar this.isOpenLoginModal ' + this.isOpenLoginModal);
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem.menuType === MenuType.UNAUTH);
    this.userMenus = ROUTES.filter(menuItem => menuItem.menuType === MenuType.AUTH);
    this.brandMenu = ROUTES.filter(menuItem => menuItem.menuType === MenuType.BRAND)[0];
    //this.currentUser = this.localStorage.getObject('currentUser');
    
    this.currentUser = this.commonAppService.getCurrentUser();
    console.log(' this.commonAppService.getCurrentUser ' + JSON.stringify(this.commonAppService.getCurrentUser()));
    if(!this.commonAppService.isUndefined(this.currentUser)){
        this.userMenuTitle = 'Hi, ' + this.currentUser.Email.substring(0,8);
    }
    console.log(' currentUser ' + JSON.stringify(this.currentUser));
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

  checkAuth(event: any){
    this.isLoginByRentalLink = true;
    event.stopPropagation();
    this.isCollapsed = false;
    console.log(' checkAuth call1 ' + this.currentUser);  
    if(this.currentUser == null){
      document.getElementById('maprentalsNavbarBtn').click();
      this.openModal('loginModalBtn');
    } else {
      //this.router.navigateByUrl('/test', true);
      //this.router.navigate(['/manageProperty/' + 'new'], true);
      window.location.href = "manageProperty/new/true";
      // this.router.navigate( [
      //   'manageProperty', { Id: 'new'}
      // ]);
    }
  }

  login(){
    this.isLoginByRentalLink = false;
    document.getElementById('maprentalsNavbarBtn').click();
    this.openModal('loginModalBtn');
  }

  openModal(ButtonId: string){
    document.getElementById(ButtonId).click();
  }

  logout(event: any){
    event.stopPropagation();
    this.localStorage.removeItem('currentUser');
    this.renderer.invokeElementMethod(this.navbarbrand.nativeElement, 'click', []);
  }

  goToHomePage(){
    this.localStorage.removeItem('storageFilters');
    this.localStorage.removeItem('storageMap');
    // this.router.navigate( [
    //   'home', { }
    // ]);
  }
}
