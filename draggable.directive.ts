
import { Directive, Input, ElementRef, HostListener, Renderer, OnInit} from '@angular/core';

@Directive({
  selector: '[n2-draggable]'
})
export class Draggable implements OnInit{

    topStart:number=0;
    leftStart:number=0;
    _allowDrag:boolean = true;
    md:boolean;

    constructor(public element: ElementRef) {}

    ngOnInit(){
      //css changes
      if(this._allowDrag){
        this.element.nativeElement.style.position = 'relative';
        this.element.nativeElement.className += ' cursor-draggable';
      }
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event:MouseEvent) {
      this.md = true;
      this.topStart = event.clientY - this.element.nativeElement.style.top.replace('px','');
      this.leftStart = event.clientX - this.element.nativeElement.style.left.replace('px','');
    }

    @HostListener('document:mouseup')
    onMouseUp() {
      this.md = false;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event:MouseEvent) {
      if(this.md && this._allowDrag){
        this.element.nativeElement.style.top = (event.clientY - this.topStart) + 'px';
        this.element.nativeElement.style.left = (event.clientX - this.leftStart) + 'px';
      }
    }

    @Input('n2-draggable')
    set allowDrag(value){
      this._allowDrag = value;
      if(this._allowDrag)
        this.element.nativeElement.className += ' cursor-draggable';
      else
        this.element.nativeElement.className = this.element.nativeElement.className
                                                .replace(' cursor-draggable','');
    }
}
