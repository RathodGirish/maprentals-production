var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
export let AppComponent = class AppComponent {
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        template: `
    	<nav class="navbar navbar-default navbar-dark bg-inverse">
  		<div class="container-fluid">
			<a routerLink="/home">Home</a>     
	        <a routerLink="/contact">Contact</a>
	        <a routerLink="/about">About</a>
	    </div>
      </nav>
      <router-outlet></router-outlet>
    `
    }), 
    __metadata('design:paramtypes', [])
], AppComponent);
//# sourceMappingURL=app.component.js.map