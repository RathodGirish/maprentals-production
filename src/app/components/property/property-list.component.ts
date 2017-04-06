/**
 * Property List Component.
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    template: `
    <div>
        <ul class="bubble">
            <li *ngFor="let task of tasks let i=index" (click)="onSelect(task)">
                <span>{{i+1}}.</span>
                <span>{{task.title}}</span>
            </li>
        </ul>
    </div>
    `,
})

export class PropertyListComponent {

    constructor(public router:Router) {
    }

    public tasks = [
        {id: '1', title: 'Code Cleanup'},
        {id: '2', title: 'Review Code'},
        {id: '3', title: 'Build to Prod'}
    ];
    public errorMessage:any = '';

    onSelect(task) {
        this.router.navigate(['/property', task.id]);
    }
}