/**
 * Property Details Component.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService, CommonAppService } from '../../services/index';

@Component({
	providers: [
        PropertyService, 
        CommonAppService
    ],
    templateUrl: './property-detail.component.html'
})

export class PropertyDetailComponent implements OnInit {
	public propertyId: any;
    public property: any;
    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public propertyService: PropertyService,
        public commonAppService: CommonAppService
        ) {
    }

    public ngOnInit() {
	    console.log('hello `Detail` component');
	    this.propertyId = this.route.snapshot.params['Id'];
	    console.log(' this.propertyId ' + this.propertyId);
	    this.propertyService.getProperyById(this.propertyId)
	      .subscribe((data: any) => {
	        console.log(' data : ' + JSON.stringify(data));
	        this.property = data;
	      },
	      (error: any) => {
	          console.log(' Error while  getAllPropertiesByLatLong : ' + JSON.stringify(error));
	      });
	}
}