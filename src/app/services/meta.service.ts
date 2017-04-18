import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class MetaSetterService {

  constructor(@Inject(DOCUMENT) public document: any) {}

  public renderer: any;

  public setAll(renderer: any): void {
    this.renderer = renderer;
    let list = document.getElementsByTagName("head")[0].innerHTML;
    //console.log('list ' + list);
    //this.document.forEach( element => this.recurseAllHeadNodes(element) );
  }

  public recurseAllHeadNodes(element: any): void {
    if(element.name === 'title') this.renderer.setText(element, 'myTitle');
    else if(element.name === 'meta') this.renderer.setElementAttribute(element, 'content', 'myMeta');
  }

}