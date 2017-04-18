/**
 * Header Component.
 */
import { Component, OnInit, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Directive, Renderer, HostListener, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { UniversalService } from '../../services/index';
import { UniversalModel } from '../../components/models/universalmodel';

@Component({
    selector: 'header',
	providers: [
		UniversalService
    ],
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
	public universalModel: UniversalModel;
	public subscriber: EventEmitter<UniversalModel>;

    constructor(public universalService: UniversalService) {}

    // Instantiate an empty model to populate and subscribe to universalService
    public ngOnInit() {
        this.universalModel = new UniversalModel();
        this.subscriber = this.universalService.eventEmitter.subscribe((universalModel) => {
            this.universalModel = universalModel;
        });
    }

    // unsubscribe from universalService
    public ngOnDestroy() { this.subscriber.unsubscribe() }
}
