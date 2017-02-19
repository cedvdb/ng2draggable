
import { Directive, Input, ElementRef, HostListener, Renderer, OnInit} from '@angular/core';

@Directive({
  selector: '[ng2-draggable]'
})
export class Draggable implements OnInit{
    topStart:number=0;
    leftStart:number=0;
    _allowDrag:boolean = true;
    md:boolean;

    @Input() ng2DraggableTarget: HTMLElement;

    constructor(public element: ElementRef) {}

        ngOnInit(){
          // css changes
          if(this._allowDrag){
            this.element.nativeElement.style.position = 'relative';
            this.element.nativeElement.className += ' cursor-draggable';
          }
        }

        @HostListener('mousedown', ['$event'])
        onMouseDown(event:MouseEvent) {
          if(event.button === 2 || (typeof this.ng2DraggableTarget != 'undefined' && event.target != this.ng2DraggableTarget))
            return; // prevents right click drag, remove his if you don't want it
          this.md = true;
          this.topStart = event.clientY - this.element.nativeElement.style.top.replace('px','');
          this.leftStart = event.clientX - this.element.nativeElement.style.left.replace('px','');
        }

        @HostListener('document:mouseup')
        onMouseUp(event:MouseEvent) {
          this.md = false;
        }

        @HostListener('document:mousemove', ['$event'])
        onMouseMove(event:MouseEvent) {
          if(this.md && this._allowDrag){
            this.element.nativeElement.style.top = (event.clientY - this.topStart) + 'px';
            this.element.nativeElement.style.left = (event.clientX - this.leftStart) + 'px';
          }
        }

        @HostListener('touchstart', ['$event'])
        onTouchStart(event:TouchEvent) {
          this.md = true;
          this.topStart = event.changedTouches[0].clientY - this.element.nativeElement.style.top.replace('px','');
          this.leftStart = event.changedTouches[0].clientX - this.element.nativeElement.style.left.replace('px','');
          event.stopPropagation();
        }

        @HostListener('document:touchend')
        onTouchEnd() {
          this.md = false;
        }

        @HostListener('document:touchmove', ['$event'])
        onTouchMove(event:TouchEvent) {
          if(this.md && this._allowDrag){
            this.element.nativeElement.style.top = ( event.changedTouches[0].clientY - this.topStart ) + 'px';
            this.element.nativeElement.style.left = ( event.changedTouches[0].clientX - this.leftStart ) + 'px';
          }
          event.stopPropagation();
        }

        @Input('ng2-draggable')
        set allowDrag(value:boolean){
          this._allowDrag = value;
          if(this._allowDrag)
            this.element.nativeElement.className += ' cursor-draggable';
          else
            this.element.nativeElement.className = this.element.nativeElement.className
                                                    .replace(' cursor-draggable','');
        }
}
