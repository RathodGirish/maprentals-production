/**
 * App Component.
 */
import { Component, EventEmitter, AfterViewInit, Renderer } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { GoogleAnalyticsEventsService } from './services/index';
import { UniversalService, MetaSetterService } from './services/index';
import { UniversalModel } from './components/models/universalmodel';

@Component({
    providers: [
        GoogleAnalyticsEventsService,
		UniversalService,
		MetaSetterService
    ],
    selector: 'maprental',
    templateUrl: './app.component.html'
})

export class AppComponent implements AfterViewInit {
	public universalModel: UniversalModel;
	public subscriber: EventEmitter<UniversalModel>;

    public loading = true; 
	constructor(public metaSetter: MetaSetterService, 
		public renderer: Renderer,
		public universalService: UniversalService,
		public router: Router, 
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {

		this.loading = false;
	    this.router.events.subscribe(event => {
	      	if (event instanceof NavigationEnd) {
	        	ga('set', 'page', event.urlAfterRedirects);
	        	ga('send', 'pageview');
	      	}
	    });
		let universalModel: UniversalModel = <UniversalModel> {
                title: 'Builtvisible Homepage',
				ogTitle: 'Builtvisible Homepage111',
                description: 'The home page of Builtvisible, a digital marketing agency',
				ogDescription: 'The home page of Builtvisible, a digital marketing agency1112',
				
		};

		// this.universalModel = universalModel;

		// Set the data for the service from the model
		universalService.set(universalModel);
		// console.log(' this.universalModel ' + JSON.stringify(this.universalModel));
	    // this.googleAnalyticsEventsService.emitEvent("testCategory", "testAction", "testLabel", 10);
  	}
  	submitEvent() {
  		console.log(' submitEvent called anylytics');
	}

	// Instantiate an empty model to populate and subscribe to universalService
    public ngOnInit() {
		let THIS = this;
        THIS.universalModel = new UniversalModel();
		
        this.subscriber = this.universalService.eventEmitter.subscribe((UM) => {
			console.log(' after init load UM ' + JSON.stringify(UM));
            THIS.universalModel = UM;
        });
		
    }

    // unsubscribe from universalService
    public ngOnDestroy() { 
		this.subscriber.unsubscribe() 
	}

	ngAfterViewInit(): void {
		this.metaSetter.setAll(this.renderer);
	}
}