import { Observable } from 'rxjs/Rx';
import { Subject} from 'rxjs/Subject';
import { Directive, ElementRef, HostListener, Renderer,  EventEmitter, OnInit, OnDestroy } from '@angular/core';

export interface Position{top:number, left:number}

@Directive({
  selector: '[n2-draggable]'
})
export class Draggable implements OnInit, OnDestroy {

    mouseup:Observable<MouseEvent>;
    mousemove:Observable<MouseEvent>;
    mousedown:Observable<MouseEvent>;
    mousedrag:any;

    constructor(public element: ElementRef) {
      this.mouseup   = Observable.fromEvent<MouseEvent>(document, 'mouseup');
      this.mousemove = Observable.fromEvent<MouseEvent>(document, 'mousemove');
      this.mousedown = Observable.fromEvent<MouseEvent>(element.nativeElement, 'mousedown');
      // change css
      this.element.nativeElement.style.position = 'relative';
      this.element.nativeElement.className += ' cursor-grabbable';

      this.mousedrag = this.mousedown.map((event:MouseEvent):Position => {

          return {
            //using style instead of clientboundingrect or offsetTop because else it's buggy
              top: event.clientY - element.nativeElement.style.top.replace('px',''),
              left: event.clientX - element.nativeElement.style.left.replace('px','')
          };
      })
      .flatMap(
          imageOffset => this.mousemove.map((pos:MouseEvent) => ({
              top: pos.clientY - imageOffset.top,
              left: pos.clientX - imageOffset.left
          }))
          .takeUntil(this.mouseup)
      );
    }


    ngOnInit() {
        this.mousedrag.subscribe({
            next: (pos:any) => {
                this.element.nativeElement.style.top = pos.top + 'px';
                this.element.nativeElement.style.left = pos.left + 'px';
            }
        });
    }

    ngOnDestroy(){
      this.mousedrag.unsubscribe();
    }
}
