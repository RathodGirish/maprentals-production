/**
 * Slider Component.
 */
import {Component, OnInit, OnDestroy, Input, HostBinding } from '@angular/core';

import {CarouselComponent, Direction} from  './carousel.component';

@Component({
	moduleId: "sildeModule",
    selector: 'slide',
    templateUrl: './slider.component.html'
})
export class SliderComponent implements OnInit, OnDestroy{
	@Input() public index:number;
    @Input() public direction:Direction;

    @HostBinding('class.active')
    @Input() public active:boolean;

    @HostBinding('class.item')
    @HostBinding('class.carousel-item')
    public addClass:boolean = true;

    constructor(public carousel:CarouselComponent) {
    }

    public ngOnInit() {
        this.carousel.addSlide(this);
    }

    public ngOnDestroy() {
        this.carousel.removeSlide(this);
    }
}